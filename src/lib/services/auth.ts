import { cookies } from 'next/headers';
import { repository } from '@/lib/services/repository';
import { Profile, UserRole } from '@/types/database';

export const SESSION_COOKIE_NAME = 'dh_session_user_id';

// Utente predefinito per il collaudo rapido in locale: Admin
export const DEFAULT_DEV_USER_ID = '00000000-0000-0000-0000-000000000001';

/**
 * Ottiene l'utente correntemente autenticato dalla sessione
 */
export async function getCurrentUser(): Promise<Profile | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  // In produzione senza cookie di sessione l'utente è ospite (null).
  // In dev è consentito l'auto-login salvo disattivazione esplicita.
  const isDev = process.env.NODE_ENV !== 'production';
  const autoLoginInDev = process.env.DISABLE_DEV_AUTO_LOGIN !== 'true';

  const sessionUserId = sessionCookie || (isDev && autoLoginInDev ? DEFAULT_DEV_USER_ID : null);

  if (!sessionUserId) {
    return null;
  }

  const profile = await repository.getProfileById(sessionUserId);
  return profile;
}

/**
 * Impone un controllo di autorizzazione sui ruoli richiesti
 */
export async function requireUserWithRole(allowedRoles: UserRole[]): Promise<Profile> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Accesso non autorizzato. Effettua il login.');
  }

  if (!allowedRoles.includes(user.role)) {
    throw new Error(`Accesso negato. Questa sezione richiede privilegi: ${allowedRoles.join(', ')}.`);
  }

  return user;
}
