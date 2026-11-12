import { NextRequest, NextResponse } from 'next/server';
import { registerSchema } from '@/lib/utils/validation';
import { repository } from '@/lib/services/repository';
import { SESSION_COOKIE_NAME } from '@/lib/services/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dati di registrazione non validi', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const newProfile = await repository.registerUser({
      email: parsed.data.email,
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      organization: parsed.data.organization,
      privacyVersion: parsed.data.privacyVersion,
      marketingConsent: parsed.data.marketingConsent,
      emailNotificationsConsent: parsed.data.emailNotificationsConsent,
    });

    const response = NextResponse.json({ success: true, profile: newProfile });
    response.cookies.set(SESSION_COOKIE_NAME, newProfile.id, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Errore durante la registrazione';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
