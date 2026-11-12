import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/services/auth';
import { repository } from '@/lib/services/repository';
import { formatItalianDate, formatItalianTime } from '@/lib/utils/date';
import { Calendar, Users, MapPin, Clock, Zap } from 'lucide-react';

export default async function AttivitaPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string; filtro?: string; q?: string }>;
}) {
  const user = await getCurrentUser();
  const { tipo, filtro, q } = await searchParams;

  const activities = await repository.listActivities({
    userId: user?.id,
    type: tipo,
    search: q,
    onlyRegistered: filtro === 'miei',
  });

  return (
    <div className="space-y-8">
      {/* Header Sezione */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-hero-lightning mb-1">
            <Zap className="w-3.5 h-3.5 fill-hero-lightning" />
            Eventi, Meetup & Formazione
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Meetup & Corsi per <span className="text-hero-fuchsia">Digital Heroes</span>
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Incontri informali per remote worker al Green Hub, spazi coworking sul territorio e corsi operativi su intelligenza artificiale.
          </p>
        </div>

        {/* Filtri rapidi per tipo */}
        <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 p-1.5 rounded-2xl text-xs font-bold self-start sm:self-auto backdrop-blur-md">
          <Link
            href="/attivita"
            className={`px-3.5 py-1.5 rounded-xl transition ${
              !tipo && filtro !== 'miei'
                ? 'bg-hero-fuchsia text-white shadow-fuchsia'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Tutte
          </Link>
          <Link
            href="/attivita?tipo=meetup"
            className={`px-3.5 py-1.5 rounded-xl transition ${
              tipo === 'meetup'
                ? 'bg-hero-fuchsia text-white shadow-fuchsia'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Meetup
          </Link>
          <Link
            href="/attivita?tipo=event"
            className={`px-3.5 py-1.5 rounded-xl transition ${
              tipo === 'event'
                ? 'bg-hero-fuchsia text-white shadow-fuchsia'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Eventi
          </Link>
          <Link
            href="/attivita?tipo=course"
            className={`px-3.5 py-1.5 rounded-xl transition ${
              tipo === 'course'
                ? 'bg-hero-fuchsia text-white shadow-fuchsia'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Corsi
          </Link>
          {user && (
            <Link
              href="/attivita?filtro=miei"
              className={`px-3.5 py-1.5 rounded-xl transition ${
                filtro === 'miei'
                  ? 'bg-hero-lightning text-slate-950 font-black shadow-lightning'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Le mie iscrizioni
            </Link>
          )}
        </div>
      </div>

      {/* Elenco Attività */}
      {activities.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-3xl border border-dashed border-white/15 p-6">
          <Calendar className="w-14 h-14 text-slate-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-white">Nessuna attività trovata</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Non ci sono incontri che corrispondono ai filtri selezionati. Prova a rimuovere i filtri.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((act) => {
            const isFull =
              act.max_participants !== null && (act.current_participants_count ?? 0) >= act.max_participants;
            const availableSeats =
              act.max_participants !== null
                ? Math.max(0, act.max_participants - (act.current_participants_count ?? 0))
                : null;

            return (
              <div
                key={act.id}
                className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-xl hover:border-hero-fuchsia/50 hover:shadow-fuchsia transition duration-300 flex flex-col justify-between group"
              >
                <div>
                  {act.cover_image_url ? (
                    <div className="h-44 w-full overflow-hidden bg-slate-800 relative">
                      <img
                        src={act.cover_image_url}
                        alt={act.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-hero-navy via-transparent to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-hero-surface/90 text-hero-lightning border border-hero-lightning/40 backdrop-blur-md">
                          {act.type}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-32 w-full bg-gradient-to-br from-hero-fuchsia/40 via-purple-900/60 to-hero-navy p-4 flex items-end">
                      <span className="text-hero-lightning font-black text-xs uppercase tracking-wider flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 fill-hero-lightning" /> Digital Heroes
                      </span>
                    </div>
                  )}

                  <div className="p-6">
                    {act.is_user_registered && (
                      <span className="inline-block mb-2 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Sei Registrato ✓
                      </span>
                    )}

                    <h2 className="font-black text-lg text-white mb-2 leading-snug group-hover:text-hero-fuchsia-light transition">
                      <Link href={`/attivita/${act.id}`}>{act.title}</Link>
                    </h2>

                    <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                      {act.description}
                    </p>

                    <div className="space-y-2 text-xs text-slate-400 pt-3 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-hero-lightning shrink-0" />
                        <span>
                          {formatItalianDate(act.start_date)}, {formatItalianTime(act.start_date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-hero-fuchsia shrink-0" />
                        <span className="truncate">
                          {act.is_online ? 'Online (link riservato)' : act.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-hero-cyan shrink-0" />
                        <span>
                          {act.max_participants !== null ? (
                            isFull ? (
                              <strong className="text-rose-400">Posti esauriti ({act.max_participants}/{act.max_participants})</strong>
                            ) : (
                              <span>Posti disponibili: <strong className="text-white">{availableSeats}</strong> su {act.max_participants}</span>
                            )
                          ) : (
                            <span>{act.current_participants_count} partecipanti</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    href={`/attivita/${act.id}`}
                    className={`w-full block text-center py-3 px-4 rounded-xl text-xs font-black transition duration-200 ${
                      act.is_user_registered
                        ? 'bg-white/10 hover:bg-white/15 text-slate-200 border border-white/15'
                        : isFull
                        ? 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5'
                        : 'bg-gradient-to-r from-hero-fuchsia to-pink-600 hover:from-pink-600 hover:to-hero-fuchsia text-white shadow-fuchsia hover:shadow-fuchsia-lg'
                    }`}
                  >
                    {act.is_user_registered
                      ? 'Gestisci Iscrizione'
                      : isFull
                      ? 'Posti Esauriti'
                      : 'Partecipa al Meetup ⚡'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
