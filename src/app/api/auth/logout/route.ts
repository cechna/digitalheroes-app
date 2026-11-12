import { NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME } from '@/lib/services/auth';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Disconnessione completata con successo' });
  
  // Rimuove il cookie di sessione
  response.cookies.set(SESSION_COOKIE_NAME, '', {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 0,
    expires: new Date(0),
  });

  return response;
}
