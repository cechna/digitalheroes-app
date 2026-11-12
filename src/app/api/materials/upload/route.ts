import { NextRequest, NextResponse } from 'next/server';
import { requireUserWithRole } from '@/lib/services/auth';
import { repository } from '@/lib/services/repository';

export async function POST(req: NextRequest) {
  try {
    const user = await requireUserWithRole(['admin', 'organizer']);

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const title = (formData.get('title') as string) || '';
    const description = (formData.get('description') as string) || '';
    const category = (formData.get('category') as string) || 'Generale';
    const activityId = (formData.get('activityId') as string) || null;
    const visibility = ((formData.get('visibility') as string) || 'all_members') as 'all_members' | 'activity_attendees';
    const availableFrom = (formData.get('availableFrom') as string) || null;

    if (!file || !title) {
      return NextResponse.json({ error: 'Titolo e file sono obbligatori.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    const created = await repository.uploadMaterial(
      {
        title,
        description,
        category,
        activityId: activityId === '' ? null : activityId,
        visibility,
        availableFrom: availableFrom === '' ? null : availableFrom,
      },
      {
        filename: file.name,
        mimeType: file.type || 'application/octet-stream',
        bytes,
      },
      user.id
    );

    return NextResponse.json({ success: true, material: created });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Errore caricamento materiale';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
