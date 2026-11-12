import { NextRequest, NextResponse } from 'next/server';
import { requireUserWithRole } from '@/lib/services/auth';
import { repository } from '@/lib/services/repository';

export async function POST(req: NextRequest) {
  try {
    const admin = await requireUserWithRole(['admin']);
    const { userId, newRole } = await req.json();

    if (!['admin', 'organizer', 'member'].includes(newRole)) {
      return NextResponse.json({ error: 'Ruolo non valido' }, { status: 400 });
    }

    const updated = await repository.updateProfileRole(userId, newRole, admin.id);
    return NextResponse.json({ success: true, profile: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Errore modifica ruolo';
    return NextResponse.json({ error: message }, { status: 403 });
  }
}
