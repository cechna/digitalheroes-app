import type { Metadata, Viewport } from 'next';
import './globals.css';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { getCurrentUser } from '@/lib/services/auth';
import { repository } from '@/lib/services/repository';
import { Zap, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Digital ⚡ Heroes - Community per Remote Workers, Corsi & Meetup',
  description: 'La community indipendente per chi lavora in remoto: meetup, corsi, materiali esclusivi e networking senza scopo commerciale.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#E40488',
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  // Calcola il conteggio dei messaggi non letti per l'utente loggato
  let unreadCount = 0;
  if (currentUser) {
    const messages = await repository.listUserMessages(currentUser.id);
    unreadCount = messages.filter((m) => !m.is_read).length;
  }

  return (
    <html lang="it" className="dark">
      <head>
        <link rel="apple-touch-icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen text-slate-100 antialiased flex flex-col selection:bg-hero-fuchsia selection:text-white">
        <Navbar currentUser={currentUser} unreadCount={unreadCount} />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        
        {/* Footer emozionante con anima community */}
        <footer className="border-t border-white/10 bg-[#040718]/90 backdrop-blur-md py-10 text-xs text-slate-400 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-hero-fuchsia to-pink-600 flex items-center justify-center text-white shadow-fuchsia">
                <Zap className="w-5 h-5 text-hero-lightning fill-hero-lightning" />
              </div>
              <div>
                <span className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
                  Digital <span className="text-hero-lightning">⚡</span> Heroes
                </span>
                <p className="text-[11px] text-slate-400">
                  Nessuno scopo commerciale • Zero marchette • 100% Community
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs">
              <Link href="/attivita" className="hover:text-hero-fuchsia transition">Meetup & Corsi</Link>
              <Link href="/materiali" className="hover:text-hero-fuchsia transition">Materiali Riservati</Link>
              <Link href="/bacheca" className="hover:text-hero-fuchsia transition">Bacheca</Link>
              <Link href="/privacy" className="hover:text-hero-fuchsia transition">Informativa Privacy</Link>
              <Link href="/termini" className="hover:text-hero-fuchsia transition">Termini di Servizio</Link>
            </div>

            <p className="text-slate-500 text-[11px] flex items-center gap-1">
              Fatto con <Heart className="w-3 h-3 text-hero-fuchsia fill-hero-fuchsia inline" /> per i remote worker di Salerno e provincia.
            </p>
          </div>
        </footer>

        {/* Registrazione Service Worker per PWA */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW error:', err));
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
