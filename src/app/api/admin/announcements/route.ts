import { NextRequest, NextResponse } from 'next/server';
import { requireUserWithRole } from '@/lib/services/auth';
import { repository } from '@/lib/services/repository';

export async function POST(req: NextRequest) {
  try {
    const user = await requireUserWithRole(['admin', 'organizer']);
    const body = await req.json();

    const created = await repository.createAnnouncement(
      {
        title: body.title,
        content: body.content,
        image_url: body.imageUrl || null,
        external_link: body.externalLink || null,
        status: body.status || 'published',
        is_pinned: body.isPinned || false,
        visibility: body.visibility || 'all_members',
        activity_id: body.activityId || null,
        created_by: user.id,
      },
      user.id
    );

    return NextResponse.json({ success: true, announcement: created });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Errore pubblicazione annuncio';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
