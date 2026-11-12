import React from 'react';
import { getCurrentUser } from '@/lib/services/auth';
import { repository } from '@/lib/services/repository';
import { ComposeCommunication } from '@/components/management/ComposeCommunication';
import { formatItalianDate, formatItalianTime } from '@/lib/utils/date';
import {
  Mail,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  Zap,
} from 'lucide-react';

export default async function GestioneComunicazioniPage() {
  const user = await getCurrentUser();
  const activities = await repository.listActivities({ userId: user?.id });
  const communications = await repository.listSentCommunications(user!.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-hero-lightning fill-hero-lightning" />
          Comunicazioni agli Utenti & Invii Email
        </h1>
        <p className="text-xs text-slate-300 mt-0.5">
          Invia messaggi mirati a tutti gli iscritti o ai partecipanti dei singoli meetup. Monitora lo stato di consegna e lettura.
        </p>
      </div>

      <ComposeCommunication activities={activities} />

      {/* Storico Invii */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-white">
          Storico Comunicazioni Inviate ({communications.length})
        </h2>

        {communications.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-3xl border border-dashed border-white/15 p-6">
            <p className="text-xs text-slate-400">Nessuna comunicazione ancora inviata.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {communications.map(async (comm) => {
              const dispatches = await repository.getCommunicationDispatches(comm.id, user!.id);
              const acceptedEmails = dispatches.filter((d) => d.status === 'accepted').length;
              const pendingEmails = dispatches.filter((d) => d.status === 'pending').length;
              const failedEmails = dispatches.filter((d) => d.status === 'failed').length;
              const deliveredEmails = dispatches.filter((d) => d.status === 'delivered').length;

              return (
                <div
                  key={comm.id}
                  className="glass-panel rounded-2xl border border-white/10 p-6 shadow-xl space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-hero-fuchsia/20 text-hero-fuchsia-light border border-hero-fuchsia/30">
                          {comm.target_type === 'all_members'
                            ? 'Tutti gli Iscritti'
                            : 'Iscritti Attività'}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Inviato il {formatItalianDate(comm.sent_at || comm.created_at)} alle{' '}
                          {formatItalianTime(comm.sent_at || comm.created_at)}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-white text-base">{comm.subject}</h3>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <div className="text-slate-300">
                        Destinatari in app: <strong className="text-white">{comm.recipients_count ?? 0}</strong>
                      </div>
                      <div className="text-hero-cyan font-bold flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        Letti: {comm.read_count ?? 0}/{comm.recipients_count ?? 0}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 bg-white/5 p-4 rounded-xl border border-white/5 whitespace-pre-line font-medium leading-relaxed">
                    {comm.body}
                  </p>

                  {/* Stato Email */}
                  {comm.send_email && (
                    <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-3 text-[11px]">
                      <span className="font-bold text-slate-300 flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-hero-lightning" />
                        Stato Email ({dispatches.length}):
                      </span>

                      {acceptedEmails > 0 && (
                        <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                          <CheckCircle className="w-3 h-3 text-emerald-400" />
                          {acceptedEmails} Accettate dal provider
                        </span>
                      )}

                      {pendingEmails > 0 && (
                        <span className="inline-flex items-center gap-1 text-amber-300 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30 font-bold">
                          <Clock className="w-3 h-3 text-amber-300" />
                          {pendingEmails} In coda
                        </span>
                      )}

                      {failedEmails > 0 && (
                        <span className="inline-flex items-center gap-1 text-rose-400 bg-rose-500/15 px-2.5 py-0.5 rounded-full border border-rose-500/30 font-bold">
                          <AlertTriangle className="w-3 h-3 text-rose-400" />
                          {failedEmails} Fallite
                        </span>
                      )}

                      {deliveredEmails > 0 ? (
                        <span className="inline-flex items-center gap-1 text-hero-cyan bg-hero-cyan/15 px-2.5 py-0.5 rounded-full border border-hero-cyan/30 font-bold">
                          <CheckCircle className="w-3 h-3 text-hero-cyan" />
                          {deliveredEmails} Consegna confermata
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">
                          (Consegna confermata: in attesa di webhook di recapito)
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
