import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/services/auth';
import { repository } from '@/lib/services/repository';
import { formatItalianDate, formatItalianTime } from '@/lib/utils/date';
import { RegistrationButton } from '@/components/activities/RegistrationButton';
import {
  Clock,
  MapPin,
  Users,
  FileDown,
  Shield,
  ArrowLeft,
  Lock,
  UserCheck,
  Zap,
} from 'lucide-react';

export default async function AttivitaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  const { id } = await params;

  const activity = await repository.getActivityById(id, user?.id);
  if (!activity) {
    notFound();
  }

  // Se l'attività è in bozza, solo admin o organizzatori assegnati possono vederla
  if (activity.status === 'draft') {
    const isManager =
      user?.role === 'admin' ||
      (user?.role === 'organizer' &&
        activity.organizers?.some((o) => o.id === user.id));
    if (!isManager) {
      notFound();
    }
  }

  // Materiali collegati
  const allMaterials = await repository.listMaterials(user?.id);
  const linkedMaterials = allMaterials.filter((m) => m.activity_id === activity.id);

  // Se l'utente è organizzatore/admin, carica la lista degli iscritti
  const canViewAttendees =
    user?.role === 'admin' ||
    (user?.role === 'organizer' &&
      activity.organizers?.some((o) => o.id === user.id));

  let attendees: Array<{ id: string; first_name: string; last_name: string; email: string; organization?: string | null }> = [];
  if (canViewAttendees) {
    attendees = await repository.getActivityAttendees(activity.id, user!.id);
  }

  const isFull =
    activity.max_participants !== null &&
    (activity.current_participants_count ?? 0) >= activity.max_participants;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <Link
          href="/attivita"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-hero-fuchsia-light transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Torna alle attività
        </Link>
      </div>

      {/* Card Dettaglio */}
      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        {activity.cover_image_url && (
          <div className="h-64 sm:h-96 w-full overflow-hidden bg-slate-900 relative">
            <img
              src={activity.cover_image_url}
              alt={activity.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-hero-navy via-hero-navy/50 to-transparent" />
          </div>
        )}

        <div className="p-6 sm:p-10 space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-hero-fuchsia/20 text-hero-fuchsia-light border border-hero-fuchsia/40 shadow-fuchsia flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-hero-lightning fill-hero-lightning" />
              {activity.type}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                activity.status === 'published'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}
            >
              Stato: {activity.status === 'published' ? 'Iscrizioni Aperte' : activity.status}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
            {activity.title}
          </h1>

          {/* Dettagli orari e luogo */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-hero-lightning shrink-0" />
              <div>
                <div className="font-bold text-white">Data e Orario</div>
                <div className="text-slate-300">
                  {formatItalianDate(activity.start_date)}
                  <br />
                  {formatItalianTime(activity.start_date)} - {formatItalianTime(activity.end_date)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-hero-fuchsia shrink-0" />
              <div>
                <div className="font-bold text-white">Luogo / Sede</div>
                <div className="break-words text-slate-300">
                  {activity.is_online ? (
                    activity.is_user_registered || canViewAttendees ? (
                      <a
                        href={activity.location}
                        target="_blank"
                        rel="noreferrer"
                        className="text-hero-cyan hover:underline font-bold"
                      >
                        {activity.location}
                      </a>
                    ) : (
                      <span className="text-slate-500 italic">Disponibile dopo l’iscrizione</span>
                    )
                  ) : (
                    activity.location
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-hero-cyan shrink-0" />
              <div>
                <div className="font-bold text-white">Capienza</div>
                <div className="text-slate-300">
                  {activity.max_participants !== null ? (
                    <span>
                      {activity.current_participants_count} / {activity.max_participants} iscritti
                    </span>
                  ) : (
                    <span>{activity.current_participants_count} partecipanti</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Descrizione */}
          <div className="text-slate-200 text-sm leading-relaxed space-y-2">
            <h2 className="text-base font-black text-white">Informazioni sull’attività</h2>
            <p className="whitespace-pre-line text-slate-300">{activity.description}</p>
          </div>

          {/* Sezione Iscrizione */}
          <div className="pt-6 border-t border-white/10">
            {user ? (
              <RegistrationButton
                activityId={activity.id}
                isRegistered={activity.is_user_registered ?? false}
                isFull={isFull}
                isPublished={activity.status === 'published'}
              />
            ) : (
              <div className="p-6 rounded-2xl bg-white/5 border border-hero-fuchsia/40 text-center space-y-3">
                <p className="text-sm font-bold text-white">
                  Effettua l’accesso per riservare il tuo posto a questo evento
                </p>
                <div className="flex justify-center gap-3">
                  <Link
                    href="/login"
                    className="px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-bold border border-white/10"
                  >
                    Accedi
                  </Link>
                  <Link
                    href="/register"
                    className="px-5 py-2.5 bg-gradient-to-r from-hero-fuchsia to-pink-600 text-white rounded-xl text-xs font-black shadow-fuchsia"
                  >
                    Crea account gratis ⚡
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Materiali Collegati */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center gap-2">
          <FileDown className="w-5 h-5 text-hero-cyan" />
          <h2 className="text-lg font-black text-white">Materiali e dispense collegate</h2>
        </div>

        {linkedMaterials.length === 0 ? (
          <p className="text-xs text-slate-500 italic">
            Nessun materiale ancora caricato per questo meetup.
          </p>
        ) : (
          <div className="space-y-3">
            {linkedMaterials.map((mat) => (
              <div
                key={mat.id}
                className="p-4 rounded-2xl border border-white/10 bg-white/5 hover:border-hero-cyan/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-black text-hero-cyan bg-hero-cyan/10 px-2 py-0.5 rounded border border-hero-cyan/30">
                      {mat.category}
                    </span>
                    {mat.visibility === 'activity_attendees' && (
                      <span className="text-[10px] text-hero-lightning bg-amber-400/10 font-bold px-2 py-0.5 rounded flex items-center gap-1 border border-hero-lightning/30">
                        <Lock className="w-3 h-3" /> Riservato agli iscritti
                      </span>
                    )}
                  </div>
                  <h3 className="font-extrabold text-sm text-white">{mat.title}</h3>
                  {mat.description && <p className="text-xs text-slate-400 mt-0.5">{mat.description}</p>}
                </div>
                <a
                  href={`/api/materials/${mat.id}/download`}
                  className="px-4 py-2 bg-hero-fuchsia hover:bg-pink-600 text-white rounded-xl text-xs font-black shadow-fuchsia transition flex items-center justify-center gap-1.5 shrink-0"
                >
                  <FileDown className="w-4 h-4" />
                  Scarica ({(mat.file_size / (1024 * 1024)).toFixed(1)} MB)
                </a>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Elenco Iscritti - Riservato Organizzatori */}
      {canViewAttendees && (
        <section className="glass-panel rounded-3xl border border-purple-500/40 p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-hero-fuchsia" />
              <h2 className="text-lg font-black text-white">
                Elenco Iscritti Riservato ({attendees.length})
              </h2>
            </div>
            <span className="text-xs text-purple-300 font-bold">
              Visibile solo agli organizzatori
            </span>
          </div>

          {attendees.length === 0 ? (
            <p className="text-xs text-slate-400 italic">
              Nessun utente ancora registrato.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                <thead className="bg-white/10 text-slate-300 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Partecipante</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Organizzazione</th>
                    <th className="p-3">Stato</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {attendees.map((att) => (
                    <tr key={att.id} className="hover:bg-white/5">
                      <td className="p-3 font-bold text-white">
                        {att.first_name} {att.last_name}
                      </td>
                      <td className="p-3 text-slate-300">{att.email}</td>
                      <td className="p-3 text-slate-400">{att.organization || '—'}</td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-black">
                          <UserCheck className="w-3.5 h-3.5" /> Confermato
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
