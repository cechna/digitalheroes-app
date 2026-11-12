import React from 'react';
import { getCurrentUser } from '@/lib/services/auth';
import { repository } from '@/lib/services/repository';
import { formatItalianDate } from '@/lib/utils/date';
import { CreateAnnouncementModal } from '@/components/management/CreateAnnouncementModal';
import { Pin, Lock, Zap } from 'lucide-react';

export default async function GestioneBachecaPage() {
  const user = await getCurrentUser();
  const announcements = await repository.listAnnouncements(user?.id);
  const activities = await repository.listActivities({ userId: user?.id });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-hero-lightning fill-hero-lightning" />
            Bacheca & Comunicati ({announcements.length})
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Pubblica avvisi per la community, fissa comunicati in alto e gestisci la visibilità mirata.
          </p>
        </div>

        <CreateAnnouncementModal activities={activities} />
      </div>

      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 border-b border-white/10 text-slate-300 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Titolo Annuncio</th>
                <th className="p-4">Fissato</th>
                <th className="p-4">Destinatari</th>
                <th className="p-4">Stato</th>
                <th className="p-4">Data Pubblicazione</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {announcements.map((ann) => (
                <tr key={ann.id} className="hover:bg-white/5">
                  <td className="p-4">
                    <div className="font-bold text-white text-sm">{ann.title}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-1 max-w-md">
                      {ann.content}
                    </div>
                  </td>
                  <td className="p-4">
                    {ann.is_pinned ? (
                      <span className="inline-flex items-center gap-1 text-hero-lightning font-black bg-amber-400/20 px-2.5 py-0.5 rounded-full text-[10px] border border-hero-lightning/40">
                        <Pin className="w-3 h-3" /> Fissato
                      </span>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>
                  <td className="p-4">
                    {ann.visibility === 'all_members' ? (
                      <span className="text-slate-300">Tutti gli iscritti</span>
                    ) : (
                      <span className="text-hero-lightning font-bold flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Solo iscritti attività
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${
                        ann.status === 'published'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-white/10 text-slate-300'
                      }`}
                    >
                      {ann.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400">
                    {formatItalianDate(ann.published_at || ann.created_at)}
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
