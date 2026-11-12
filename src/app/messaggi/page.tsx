import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/services/auth';
import { repository } from '@/lib/services/repository';
import { MessageItem } from '@/components/messages/MessageItem';
import { MessageSquare, ShieldCheck, Inbox, Zap } from 'lucide-react';

export default async function MessaggiPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="text-center py-20 glass-panel rounded-3xl border border-white/10 p-8 max-w-md mx-auto">
        <MessageSquare className="w-14 h-14 text-slate-500 mx-auto mb-3" />
        <h2 className="text-xl font-black text-white">Accesso richiesto</h2>
        <p className="text-xs text-slate-400 mt-1 mb-6">
          Devi accedere per consultare i tuoi messaggi personali.
        </p>
        <Link
          href="/login"
          className="px-6 py-3 bg-gradient-to-r from-hero-fuchsia to-pink-600 text-white rounded-xl text-xs font-black shadow-fuchsia"
        >
          Accedi Subito
        </Link>
      </div>
    );
  }

  const messages = await repository.listUserMessages(user.id);
  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-hero-lightning mb-1">
            <Zap className="w-3.5 h-3.5 fill-hero-lightning" />
            Casella Interna
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            I Tuoi <span className="text-hero-fuchsia">Messaggi</span>
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Comunicazioni operative, link per i meetup e istruzioni riservate dalla community.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-black px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-200">
            {unreadCount > 0 ? (
              <span className="text-hero-fuchsia-light">{unreadCount} non letti</span>
            ) : (
              'Tutti i messaggi letti ✓'
            )}
          </div>
          {(user.role === 'admin' || user.role === 'organizer') && (
            <Link
              href="/gestione/comunicazioni"
              className="px-4 py-2 bg-gradient-to-r from-hero-fuchsia to-pink-600 text-white text-xs font-black rounded-xl shadow-fuchsia transition flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Invia Comunicazione
            </Link>
          )}
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-3xl border border-dashed border-white/15 p-6">
          <Inbox className="w-14 h-14 text-slate-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-white">Nessun messaggio ricevuto</h2>
          <p className="text-xs text-slate-400 mt-1">
            Quando gli organizzatori invieranno istruzioni o avvisi sulle tue attività, compariranno qui.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((item) => (
            <MessageItem
              key={item.id}
              recipientId={item.id}
              communicationId={item.communication_id}
              subject={item.communication.subject}
              body={item.communication.body}
              isRead={item.is_read}
              sentAt={item.communication.sent_at || item.created_at}
            />
          ))}
        </div>
      )}
    </div>
  );
}
