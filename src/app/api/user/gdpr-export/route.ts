import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/services/auth';
import { repository } from '@/lib/services/repository';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const data = await repository.exportUserData(user.id);
    return new NextResponse(JSON.stringify(data, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="digitalheroes_export_${user.first_name}_${user.last_name}.json"`,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Errore esportazione dati';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
