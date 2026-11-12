import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, SESSION_COOKIE_NAME } from '@/lib/services/auth';
import { repository } from '@/lib/services/repository';

export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json({ user });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, email } = body;

    let profile = null;

    if (email) {
      profile = await repository.getProfileByEmail(email);
      if (!profile) {
        return NextResponse.json(
          { error: 'Nessun account trovato con questo indirizzo email. Registrati per entrare.' },
          { status: 404 }
        );
      }
    } else if (userId) {
      // In modalità produzione rigorosa, il cambio utente libero è disabilitato salvo flag demo esplicito
      const isProduction = process.env.NODE_ENV === 'production';
      const isDemoEnabled = process.env.ENABLE_DEMO_SWITCHER === 'true';

      if (isProduction && !isDemoEnabled) {
        return NextResponse.json(
          { error: 'Cambio rapido sessione non consentito in ambiente di produzione.' },
          { status: 403 }
        );
      }

      profile = await repository.getProfileById(userId);
      if (!profile) {
        return NextResponse.json({ error: 'Utente non trovato' }, { status: 404 });
      }
    } else {
      return NextResponse.json({ error: 'Fornire email o identificativo utente' }, { status: 400 });
    }

    const response = NextResponse.json({ success: true, user: profile });
    response.cookies.set(SESSION_COOKIE_NAME, profile.id, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 giorni
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Errore sessione';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
