import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/services/auth';
import { repository } from '@/lib/services/repository';
import { formatItalianDate, formatItalianTime } from '@/lib/utils/date';
import { History, Zap } from 'lucide-react';

export default async function GestioneRegistroPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    redirect('/gestione');
  }

  const { logs, total } = await repository.listAuditLogs(user.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-hero-lightning fill-hero-lightning" />
            Registro Operazioni Amministrative ({total})
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Tracciamento di sicurezza delle operazioni di modifica ruoli, pubblicazione attività, upload e invii di comunicazioni.
          </p>
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 border-b border-white/10 text-slate-300 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Data e Ora</th>
                <th className="p-4">Amministratore</th>
                <th className="p-4">Azione</th>
                <th className="p-4">Entità</th>
                <th className="p-4">Dettagli Operazione</th>
                <th className="p-4">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-white/5">
                  <td className="p-4 whitespace-nowrap text-slate-400 font-sans">
                    {formatItalianDate(log.created_at)} {formatItalianTime(log.created_at)}
                  </td>
                  <td className="p-4 font-sans font-bold text-white">
                    {log.admin ? `${log.admin.first_name} ${log.admin.last_name}` : 'Sistema / Admin'}
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-hero-fuchsia/20 text-hero-fuchsia-light border border-hero-fuchsia/30 text-[10px] font-black">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 uppercase text-[10px] text-hero-lightning font-bold">
                    {log.entity_type}
                  </td>
                  <td className="p-4 text-[11px] text-slate-300 font-mono max-w-sm truncate">
                    {log.details ? JSON.stringify(log.details) : '—'}
                  </td>
                  <td className="p-4 text-slate-400 text-[10px]">{log.ip_address || '127.0.0.1'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
