import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/services/auth';
import { repository } from '@/lib/services/repository';
import {
  Users,
  Calendar,
  FileDown,
  MessageSquare,
  MailCheck,
  Zap,
} from 'lucide-react';

export default async function GestioneDashboardPage() {
  const user = await getCurrentUser();
  const isAdmin = user?.role === 'admin';

  const activities = await repository.listActivities({ userId: user?.id });
  const materials = await repository.listMaterials(user?.id);
  const communications = await repository.listSentCommunications(user!.id);
  const totalProfiles = isAdmin ? (await repository.listProfiles(user!.id)).total : 0;

  return (
    <div className="space-y-8">
      {/* Schede di Riepilogo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isAdmin && (
          <div className="glass-panel p-5 rounded-2xl shadow-xl hover:border-hero-fuchsia/40 transition">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-black uppercase tracking-wider">Iscritti Totali</span>
              <Users className="w-4 h-4 text-hero-fuchsia" />
            </div>
            <div className="text-3xl font-black text-white">{totalProfiles}</div>
            <Link href="/gestione/utenti" className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-hero-fuchsia-light hover:underline">
              Gestisci utenti →
            </Link>
          </div>
        )}

        <div className="glass-panel p-5 rounded-2xl shadow-xl hover:border-hero-lightning/40 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider">Attività Create</span>
            <Calendar className="w-4 h-4 text-hero-lightning" />
          </div>
          <div className="text-3xl font-black text-white">{activities.length}</div>
          <Link href="/gestione/attivita" className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-hero-lightning hover:underline">
            Vedi attività →
          </Link>
        </div>

        <div className="glass-panel p-5 rounded-2xl shadow-xl hover:border-hero-cyan/40 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider">Materiali in Archivio</span>
            <FileDown className="w-4 h-4 text-hero-cyan" />
          </div>
          <div className="text-3xl font-black text-white">{materials.length}</div>
          <Link href="/gestione/materiali" className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-hero-cyan hover:underline">
            Carica o modifica →
          </Link>
        </div>

        <div className="glass-panel p-5 rounded-2xl shadow-xl hover:border-pink-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider">Comunicazioni Inviate</span>
            <MessageSquare className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-3xl font-black text-white">{communications.length}</div>
          <Link href="/gestione/comunicazioni" className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-pink-400 hover:underline">
            Nuovo invio →
          </Link>
        </div>
      </div>

      {/* Azioni Rapide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-3xl space-y-4 hover:border-hero-fuchsia/40 transition flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-hero-fuchsia/20 text-hero-fuchsia flex items-center justify-center font-black mb-3 shadow-fuchsia">
              <Calendar className="w-6 h-6" />
            </div>
            <h2 className="font-black text-base text-white mb-1">Pubblica Meetup o Corso</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Crea un nuovo meetup al Green Hub o una sessione streaming. Imposta capienza, orari (Europe/Rome) e apri le registrazioni.
            </p>
          </div>
          <Link
            href="/gestione/attivita"
            className="w-full py-2.5 px-4 bg-gradient-to-r from-hero-fuchsia to-pink-600 hover:from-pink-600 hover:to-hero-fuchsia text-white text-xs font-black rounded-xl text-center shadow-fuchsia transition"
          >
            Nuova Attività ⚡
          </Link>
        </div>

        <div className="glass-panel p-6 rounded-3xl space-y-4 hover:border-hero-cyan/40 transition flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-hero-cyan/20 text-hero-cyan flex items-center justify-center font-black mb-3">
              <FileDown className="w-6 h-6" />
            </div>
            <h2 className="font-black text-base text-white mb-1">Carica Mappa o Dispensa</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Carica file PDF o ZIP. Scegli se renderli accessibili a tutti gli iscritti o riservarli unicamente a chi partecipa a uno specifico meetup.
            </p>
          </div>
          <Link
            href="/gestione/materiali"
            className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-bold rounded-xl text-center transition"
          >
            Carica Documento
          </Link>
        </div>

        <div className="glass-panel p-6 rounded-3xl space-y-4 hover:border-hero-lightning/40 transition flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-hero-lightning/20 text-hero-lightning flex items-center justify-center font-black mb-3 shadow-lightning">
              <MailCheck className="w-6 h-6 fill-hero-lightning" />
            </div>
            <h2 className="font-black text-base text-white mb-1">Invia Messaggio o Notifica</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Invia un messaggio in-app e una notifica via email ai partecipanti con anteprima in tempo reale del numero di destinatari.
            </p>
          </div>
          <Link
            href="/gestione/comunicazioni"
            className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-hero-lightning text-slate-950 text-xs font-black rounded-xl text-center shadow-lightning transition"
          >
            Crea Comunicazione
          </Link>
        </div>
      </div>
    </div>
  );
}
