import { NextRequest, NextResponse } from 'next/server';
import { requireUserWithRole } from '@/lib/services/auth';
import { repository } from '@/lib/services/repository';
import { activitySchema } from '@/lib/utils/validation';

export async function POST(req: NextRequest) {
  try {
    const user = await requireUserWithRole(['admin', 'organizer']);
    const body = await req.json();

    const created = await repository.createActivity(
      {
        title: body.title,
        slug: body.slug || `attivita-${Date.now()}`,
        description: body.description,
        type: body.type,
        status: body.status,
        start_date: body.startDate,
        end_date: body.endDate,
        is_online: body.isOnline,
        location: body.location,
        max_participants: body.maxParticipants,
        cover_image_url: body.coverImageUrl || null,
        created_by: user.id,
      },
      user.id
    );

    return NextResponse.json({ success: true, activity: created });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Errore creazione attività';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
