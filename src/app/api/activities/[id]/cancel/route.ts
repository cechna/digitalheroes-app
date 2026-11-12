import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/services/auth';
import { repository } from '@/lib/services/repository';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Devi effettuare l’accesso.' }, { status: 401 });
    }

    const { id: activityId } = await params;
    const result = await repository.cancelRegistration(activityId, user.id);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: result.message });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Errore durante l’annullamento';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
