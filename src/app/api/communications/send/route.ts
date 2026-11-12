import { NextRequest, NextResponse } from 'next/server';
import { requireUserWithRole } from '@/lib/services/auth';
import { repository } from '@/lib/services/repository';
import { communicationSchema } from '@/lib/utils/validation';

export async function POST(req: NextRequest) {
  try {
    const user = await requireUserWithRole(['admin', 'organizer']);
    const body = await req.json();

    const parsed = communicationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dati comunicazione non validi', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const result = await repository.sendCommunication(
      {
        subject: parsed.data.subject,
        body: parsed.data.body,
        targetType: parsed.data.targetType,
        targetActivityId: parsed.data.targetActivityId,
        sendEmail: parsed.data.sendEmail,
        selectedUserIds: parsed.data.selectedUserIds,
      },
      user.id
    );

    return NextResponse.json({
      success: true,
      message: `Comunicazione inviata a ${result.recipientsCount} destinatari.`,
      communication: result.communication,
      recipientsCount: result.recipientsCount,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Errore invio comunicazione';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
