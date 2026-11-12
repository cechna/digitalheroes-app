import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/services/auth';
import { repository } from '@/lib/services/repository';
import { formatItalianDate, formatItalianTime } from '@/lib/utils/date';
import { CreateActivityModal } from '@/components/management/CreateActivityModal';
import { Eye, Zap } from 'lucide-react';

export default async function GestioneAttivitaPage() {
  const user = await getCurrentUser();
  const activities = await repository.listActivities({ userId: user?.id });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-hero-lightning fill-hero-lightning" />
            Attività, Meetup & Corsi ({activities.length})
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Crea nuovi eventi, gestisci gli orari, consulta la capienza e visualizza la lista iscritti.
          </p>
        </div>

        <CreateActivityModal />
      </div>

      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 border-b border-white/10 text-slate-300 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Titolo Attività</th>
                <th className="p-4">Tipologia</th>
                <th className="p-4">Data e Ora</th>
                <th className="p-4">Iscritti / Capienza</th>
                <th className="p-4">Stato</th>
                <th className="p-4 text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {activities.map((act) => (
                <tr key={act.id} className="hover:bg-white/5">
                  <td className="p-4">
                    <div className="font-bold text-white text-sm">{act.title}</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-xs">{act.location}</div>
                  </td>
                  <td className="p-4 uppercase font-black text-[10px] text-hero-fuchsia">
                    {act.type}
                  </td>
                  <td className="p-4 text-slate-300">
                    <div>{formatItalianDate(act.start_date)}</div>
                    <div className="text-[11px] text-slate-400">{formatItalianTime(act.start_date)}</div>
                  </td>
                  <td className="p-4">
                    <span className="font-black text-white text-sm">
                      {act.current_participants_count}
                    </span>{' '}
                    / {act.max_participants || '∞'}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${
                        act.status === 'published'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {act.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/attivita/${act.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-hero-fuchsia-light hover:text-white bg-hero-fuchsia/10 hover:bg-hero-fuchsia/20 rounded-xl transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Visualizza
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
