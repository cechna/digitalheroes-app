import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/services/auth';
import { repository } from '@/lib/services/repository';
import { UserRoleChanger } from '@/components/management/UserRoleChanger';
import { formatItalianDate } from '@/lib/utils/date';
import { CheckCircle, Zap } from 'lucide-react';
import { UserRole } from '@/types/database';

export default async function GestioneUtentiPage({
  searchParams,
}: {
  searchParams: Promise<{ ruolo?: string; q?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    redirect('/gestione');
  }

  const { ruolo, q } = await searchParams;

  const { profiles, total } = await repository.listProfiles(user.id, {
    role: ruolo as UserRole | undefined,
    search: q,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-hero-lightning fill-hero-lightning" />
            Gestione Utenti & Ruoli ({total})
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Consulta gli iscritti, assegna ruoli di Organizzatore o Amministratore e verifica i consensi privacy.
          </p>
        </div>

        {/* Filtri Ruolo */}
        <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 p-1.5 rounded-2xl text-xs font-bold self-start sm:self-auto backdrop-blur-md">
          <a
            href="/gestione/utenti"
            className={`px-3.5 py-1.5 rounded-xl transition ${
              !ruolo ? 'bg-hero-fuchsia text-white shadow-fuchsia' : 'text-slate-300 hover:text-white'
            }`}
          >
            Tutti
          </a>
          <a
            href="/gestione/utenti?ruolo=member"
            className={`px-3.5 py-1.5 rounded-xl transition ${
              ruolo === 'member' ? 'bg-hero-fuchsia text-white shadow-fuchsia' : 'text-slate-300 hover:text-white'
            }`}
          >
            Iscritti
          </a>
          <a
            href="/gestione/utenti?ruolo=organizer"
            className={`px-3.5 py-1.5 rounded-xl transition ${
              ruolo === 'organizer' ? 'bg-hero-fuchsia text-white shadow-fuchsia' : 'text-slate-300 hover:text-white'
            }`}
          >
            Organizzatori
          </a>
          <a
            href="/gestione/utenti?ruolo=admin"
            className={`px-3.5 py-1.5 rounded-xl transition ${
              ruolo === 'admin' ? 'bg-hero-lightning text-slate-950 shadow-lightning' : 'text-slate-300 hover:text-white'
            }`}
          >
            Amministratori
          </a>
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 border-b border-white/10 text-slate-300 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Utente</th>
                <th className="p-4">Organizzazione</th>
                <th className="p-4">Consenso Privacy</th>
                <th className="p-4">Data Iscrizione</th>
                <th className="p-4">Ruolo Attuale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {profiles.map((p) => (
                <tr key={p.id} className="hover:bg-white/5">
                  <td className="p-4">
                    <div className="font-bold text-white text-sm">
                      {p.first_name} {p.last_name}
                    </div>
                    <div className="text-slate-400 text-[11px]">{p.email}</div>
                  </td>
                  <td className="p-4 text-slate-300">{p.organization || '—'}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/15 px-2.5 py-0.5 rounded-full text-[11px] border border-emerald-500/30">
                      <CheckCircle className="w-3 h-3" />
                      v{p.privacy_version}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400">{formatItalianDate(p.created_at)}</td>
                  <td className="p-4">
                    <UserRoleChanger
                      userId={p.id}
                      initialRole={p.role}
                      currentAdminId={user.id}
                    />
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
