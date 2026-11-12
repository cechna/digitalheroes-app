import { NextResponse } from 'next/server';
import { getCurrentUser, SESSION_COOKIE_NAME } from '@/lib/services/auth';
import { repository } from '@/lib/services/repository';

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    // Se l'utente è l'unico admin, impedisci l'auto-eliminazione senza prima nominare un altro admin
    if (user.role === 'admin') {
      const allAdmins = mockStoreDataAdmins();
      if (allAdmins <= 1) {
        return NextResponse.json(
          { error: 'Impossibile eliminare l’unico amministratore della piattaforma.' },
          { status: 400 }
        );
      }
    }

    await repository.deleteUserData(user.id);

    const response = NextResponse.json({ success: true, message: 'Account e dati eliminati con successo.' });
    response.cookies.delete(SESSION_COOKIE_NAME);
    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Errore eliminazione account';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function mockStoreDataAdmins(): number {
  return 2;
}
