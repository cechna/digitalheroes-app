import { NextRequest, NextResponse } from 'next/server';
import { requireUserWithRole } from '@/lib/services/auth';
import { repository } from '@/lib/services/repository';

export async function POST(req: NextRequest) {
  try {
    await requireUserWithRole(['admin', 'organizer']);
    const { targetType, targetActivityId, selectedUserIds } = await req.json();

    const recipients = await repository.resolveRecipients(targetType, targetActivityId, selectedUserIds);

    return NextResponse.json({
      count: recipients.length,
      sample: recipients.slice(0, 5).map((r) => ({
        id: r.id,
        name: `${r.first_name} ${r.last_name}`,
        email: r.email,
        consentEmail: r.email_notifications_consent,
      })),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Errore calcolo anteprima destinatari';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
