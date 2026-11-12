import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/services/auth';
import { repository } from '@/lib/services/repository';
import { formatItalianDate, formatItalianTime } from '@/lib/utils/date';
import { formatSafeContent } from '@/lib/utils/sanitize';
import {
  Calendar,
  FileDown,
  Bell,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Users,
  MapPin,
  Clock,
  Zap,
  Sparkles,
  ShieldCheck,
  Coffee,
  HeartHandshake,
  Compass,
} from 'lucide-react';

export default async function HomePage() {
  const user = await getCurrentUser();

  // Se non autenticato, mostra landing page spettacolare con identità Digital Heroes autentica
  if (!user) {
    return (
      <div className="space-y-20 py-6">
        {/* HERO SECTION ULTRA-EMOZIONANTE */}
        <section className="relative overflow-hidden rounded-3xl p-8 sm:p-14 lg:p-20 text-center border border-white/10 glass-panel shadow-2xl">
          {/* Sfondi ed effetti luce neon */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-hero-fuchsia/20 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-10 right-10 w-72 h-72 bg-hero-lightning/15 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute top-10 left-10 w-64 h-64 bg-hero-cyan/15 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-hero-fuchsia/40 bg-hero-fuchsia/15 text-hero-fuchsia-light text-xs font-black uppercase tracking-widest shadow-fuchsia">
              <Zap className="w-4 h-4 text-hero-lightning fill-hero-lightning animate-bounce" />
              Community Indipendente Salerno & Provincia
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-none">
              NON PASSARE LA VITA DA SOLO DAVANTI AD{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-hero-fuchsia via-pink-400 to-hero-lightning drop-shadow-sm">
                UNO SCHERMO!
              </span>
            </h1>

            <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
              Se lavori in remoto, hai orari flessibili e tutti quelli che conosci ti guardano in maniera strana...{' '}
              <strong className="text-white font-bold">sei nel posto giusto!</strong>
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-hero-fuchsia via-pink-600 to-hero-fuchsia hover:shadow-fuchsia-lg text-white font-black text-sm tracking-wide shadow-fuchsia hover:scale-105 transition duration-300 flex items-center justify-center gap-2 group"
              >
                <Zap className="w-5 h-5 text-hero-lightning fill-hero-lightning group-hover:rotate-12 transition" />
                <span>UNISCITI AGLI HEROES GRATIS</span>
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 font-bold text-sm tracking-wide transition flex items-center justify-center gap-2"
              >
                <span>Accedi alla tua Area</span>
                <ArrowRight className="w-4 h-4 text-hero-fuchsia" />
              </Link>
            </div>

            {/* Micro-badge identitari */}
            <div className="pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="text-hero-lightning font-black text-xl flex items-center gap-1">
                  <Zap className="w-4 h-4 fill-hero-lightning" /> +600
                </div>
                <div className="text-[11px] text-slate-400 font-medium">Remote Workers & Freelancer</div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="text-hero-fuchsia-light font-black text-xl flex items-center gap-1">
                  <Coffee className="w-4 h-4" /> Spazi
                </div>
                <div className="text-[11px] text-slate-400 font-medium">Work-Friendly Censiti</div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="text-hero-cyan font-black text-xl flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> Meetup
                </div>
                <div className="text-[11px] text-slate-400 font-medium">Incontri dal Vivo & Coworking</div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="text-emerald-400 font-black text-xl flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Zero
                </div>
                <div className="text-[11px] text-slate-400 font-medium">Marchette & Fini Commerciali</div>
              </div>
            </div>
          </div>
        </section>

        {/* COSA È DIGITAL HEROES & VALORI AUTENTICI */}
        <section className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-hero-lightning">
              Il Manifesto della Community
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Cosa è <span className="text-hero-fuchsia">Digital ⚡ Heroes</span>
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Siamo una comunità trasversale nata sul web che unisce digital marketers, sviluppatori, designer, creator e impiegati in smart working. 
              Accogliamo tutti, qualsiasi sia il tuo settore: qui troverai uno spazio dove condividere esperienze, risorse e supporto umano.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-panel p-6 rounded-2xl space-y-3 hover:border-hero-fuchsia/40 transition group">
              <div className="w-12 h-12 rounded-xl bg-hero-fuchsia/20 text-hero-fuchsia flex items-center justify-center font-black group-hover:scale-110 transition shadow-fuchsia">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-white">Mappa Spazi &quot;Work Friendly&quot;</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Mappa e censimento dei migliori luoghi sul territorio con ottima connettività, ristoro e servizi ideali per lo smart working a Salerno e provincia.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl space-y-3 hover:border-hero-lightning/40 transition group">
              <div className="w-12 h-12 rounded-xl bg-hero-lightning/20 text-hero-lightning flex items-center justify-center font-black group-hover:scale-110 transition shadow-lightning">
                <Zap className="w-6 h-6 fill-hero-lightning" />
              </div>
              <h3 className="font-bold text-base text-white">Meetup & Lightning Talks</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Incontri informali per conoscersi, scambiarsi idee, condividere progetti e fare rete in maniera rilassata, senza formalità aziendali.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl space-y-3 hover:border-pink-500/40 transition group">
              <div className="w-12 h-12 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center font-black group-hover:scale-110 transition">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-white">Benessere & Work-Life</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Supporto, consigli pratici e riflessioni sul bilanciamento tra vita e lavoro, per non bruciarsi lavorando da soli a casa.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl space-y-3 hover:border-emerald-500/40 transition group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black group-hover:scale-110 transition">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-white">Zero Scopo Commerciale</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Nessun secondo fine e zero marchette. Non siamo legati a corporazioni, partiti o venditori di corsi truffa: solo crescita reale per il territorio.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // UTENTE AUTENTICATO (AREA MEMBRO / DASHBOARD OPERATIVA)
  const upcomingActivities = await repository.listActivities({ userId: user.id });
  const myActivities = upcomingActivities.filter((a) => a.is_user_registered);
  const announcements = await repository.listAnnouncements(user.id);
  const materials = await repository.listMaterials(user.id);
  const userMessages = await repository.listUserMessages(user.id);
  const unreadMessages = userMessages.filter((m) => !m.is_read);

  return (
    <div className="space-y-8">
      {/* Saluto Emozionante e Banner Heroes */}
      <section className="relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-hero-fuchsia/30 bg-gradient-to-r from-hero-surface via-[#120B2E] to-hero-surface shadow-fuchsia">
        <div className="absolute top-0 right-0 w-80 h-80 bg-hero-fuchsia/20 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-64 h-64 bg-hero-lightning/15 blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-hero-fuchsia/20 text-hero-fuchsia-light border border-hero-fuchsia/40 text-xs font-black uppercase tracking-wider mb-2">
              <Zap className="w-3.5 h-3.5 text-hero-lightning fill-hero-lightning" />
              Area Membro Digital Heroes
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Bentornato, {user.first_name}! ⚡
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl font-medium">
              Tieni d&apos;occhio i meetup in programma al Green Hub, scarica le dispense aggiornate e consulta le comunicazioni del network.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/attivita"
              className="px-5 py-2.5 bg-gradient-to-r from-hero-fuchsia to-pink-600 hover:from-pink-600 hover:to-hero-fuchsia text-white rounded-xl text-xs font-black tracking-wide shadow-fuchsia hover:scale-105 transition flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Meetup & Corsi
            </Link>
            <Link
              href="/materiali"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/15 border border-white/15 text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <FileDown className="w-4 h-4 text-hero-cyan" />
              Mappe & Slide
            </Link>
          </div>
        </div>

        {/* Counter cards energetiche */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-md">
            <div className="text-[11px] font-semibold text-slate-400">Le tue iscrizioni</div>
            <div className="text-2xl font-black text-white mt-0.5">{myActivities.length}</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-md">
            <div className="text-[11px] font-semibold text-slate-400">Messaggi non letti</div>
            <div className="text-2xl font-black text-hero-fuchsia-light mt-0.5">
              {unreadMessages.length}
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-md">
            <div className="text-[11px] font-semibold text-slate-400">Materiali scaricabili</div>
            <div className="text-2xl font-black text-hero-cyan mt-0.5">{materials.length}</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-md">
            <div className="text-[11px] font-semibold text-slate-400">Eventi attivi</div>
            <div className="text-2xl font-black text-hero-lightning mt-0.5">
              {upcomingActivities.filter((a) => a.status === 'published').length}
            </div>
          </div>
        </div>
      </section>

      {/* Avviso Notifiche Non Lette */}
      {unreadMessages.length > 0 && (
        <section className="glass-panel-fuchsia rounded-2xl p-4 flex items-center justify-between border-hero-fuchsia/40 shadow-fuchsia">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-hero-fuchsia text-white flex items-center justify-center font-black shadow-fuchsia animate-pulse">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white">
                Hai {unreadMessages.length} messaggi non letti dalla community
              </h2>
              <p className="text-xs text-pink-200">
                Oggetto: &quot;{unreadMessages[0].communication.subject}&quot;
              </p>
            </div>
          </div>
          <Link
            href="/messaggi"
            className="px-4 py-2 bg-gradient-to-r from-hero-fuchsia to-pink-600 hover:scale-105 text-white rounded-xl text-xs font-black transition shadow-fuchsia flex items-center gap-1.5"
          >
            Leggi ora
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </section>
      )}

      {/* Griglia Principale: Attività & Bacheca */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonna Sinistra (2 cols): Iscrizioni & Meetup */}
        <div className="lg:col-span-2 space-y-8">
          {/* Iscrizioni dell'utente */}
          <section className="glass-panel rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-black text-white">Le Tue Iscrizioni Attive</h2>
              </div>
              <Link href="/attivita?filtro=miei" className="text-xs font-bold text-hero-fuchsia-light hover:underline">
                Vedi tutte
              </Link>
            </div>

            {myActivities.length === 0 ? (
              <div className="text-center py-8 px-4 bg-white/5 rounded-xl border border-dashed border-white/15">
                <Calendar className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                <p className="text-sm text-slate-300 font-semibold">Non sei ancora iscritto ai prossimi meetup o corsi.</p>
                <Link
                  href="/attivita"
                  className="mt-3 inline-block px-4 py-2 text-xs font-black text-hero-fuchsia-light hover:text-white transition"
                >
                  Partecipa al prossimo Meetup ⚡ →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {myActivities.map((act) => (
                  <div
                    key={act.id}
                    className="p-4 rounded-xl border border-white/10 bg-white/5 hover:border-hero-fuchsia/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-hero-fuchsia/20 text-hero-fuchsia-light border border-hero-fuchsia/30">
                          {act.type}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                          <Clock className="w-3.5 h-3.5 text-hero-lightning" />
                          {formatItalianDate(act.start_date)}, {formatItalianTime(act.start_date)}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-slate-100 text-base group-hover:text-hero-fuchsia-light transition">
                        <Link href={`/attivita/${act.id}`}>{act.title}</Link>
                      </h3>
                      <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span>{act.is_online ? 'Online (link riservato)' : act.location}</span>
                      </div>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Iscritto
                      </span>
                      <Link
                        href={`/attivita/${act.id}`}
                        className="text-xs font-bold text-hero-fuchsia-light hover:underline flex items-center gap-1"
                      >
                        Dettagli & Luogo
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Prossimi Meetup & Corsi */}
          <section className="glass-panel rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-hero-lightning fill-hero-lightning" />
                <h2 className="text-lg font-black text-white">Prossimi Meetup & Attività</h2>
              </div>
              <Link href="/attivita" className="text-xs font-bold text-hero-fuchsia-light hover:underline">
                Vedi calendario
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingActivities.slice(0, 4).map((act) => (
                <div
                  key={act.id}
                  className="p-5 rounded-2xl border border-white/10 bg-white/5 hover:border-hero-fuchsia/40 hover:bg-white/10 transition flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span className="font-black text-hero-lightning uppercase text-[10px] tracking-wider">
                        {act.type}
                      </span>
                      <span>{formatItalianDate(act.start_date, { day: 'numeric', month: 'short' })}</span>
                    </div>
                    <h3 className="font-extrabold text-white text-base mb-1.5 line-clamp-2 group-hover:text-hero-fuchsia-light transition">
                      <Link href={`/attivita/${act.id}`}>{act.title}</Link>
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                      {act.description}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-hero-fuchsia" />
                      {act.max_participants
                        ? `${act.current_participants_count}/${act.max_participants} posti`
                        : `${act.current_participants_count} partecipanti`}
                    </span>
                    <Link
                      href={`/attivita/${act.id}`}
                      className="font-black text-hero-fuchsia-light group-hover:text-pink-300"
                    >
                      {act.is_user_registered ? 'Iscritto ✓' : 'Partecipa →'}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Colonna Destra (1 col): Bacheca News & Materiali */}
        <div className="space-y-8">
          {/* Bacheca News */}
          <section className="glass-panel rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-hero-fuchsia" />
                <h2 className="text-lg font-black text-white">Bacheca Heroes</h2>
              </div>
              <Link href="/bacheca" className="text-xs font-bold text-hero-fuchsia-light hover:underline">
                Tutte
              </Link>
            </div>

            <div className="space-y-3.5">
              {announcements.slice(0, 3).map((ann) => (
                <div
                  key={ann.id}
                  className={`p-4 rounded-xl border transition ${
                    ann.is_pinned
                      ? 'border-hero-lightning/40 bg-hero-lightning/10 shadow-lightning'
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  {ann.is_pinned && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-hero-lightning bg-amber-400/20 px-2 py-0.5 rounded mb-2 border border-hero-lightning/30">
                      <Zap className="w-3 h-3 fill-hero-lightning" />
                      In Evidenza
                    </span>
                  )}
                  <h3 className="font-extrabold text-white text-sm mb-1 leading-snug">
                    {ann.title}
                  </h3>
                  <div
                    className="text-xs text-slate-300 line-clamp-3 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: formatSafeContent(ann.content) }}
                  />
                  <div className="mt-2 text-[11px] text-slate-400">
                    {formatItalianDate(ann.published_at || ann.created_at)}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Materiali & Guide Operative */}
          <section className="glass-panel rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <FileDown className="w-5 h-5 text-hero-cyan" />
                <h2 className="text-lg font-black text-white">Mappe & Risorse</h2>
              </div>
              <Link href="/materiali" className="text-xs font-bold text-hero-fuchsia-light hover:underline">
                Archivio
              </Link>
            </div>

            <div className="space-y-3">
              {materials.slice(0, 4).map((mat) => (
                <div
                  key={mat.id}
                  className="p-3.5 rounded-xl border border-white/10 bg-white/5 hover:border-hero-cyan/40 hover:bg-white/10 transition flex items-center justify-between gap-3 group"
                >
                  <div className="min-w-0">
                    <span className="text-[10px] font-black text-hero-cyan uppercase tracking-wider">
                      {mat.category}
                    </span>
                    <h3 className="font-bold text-xs text-white truncate group-hover:text-hero-cyan transition">
                      {mat.title}
                    </h3>
                    <span className="text-[11px] text-slate-400">
                      {(mat.file_size / (1024 * 1024)).toFixed(1)} MB
                    </span>
                  </div>
                  <a
                    href={`/api/materials/${mat.id}/download`}
                    className="shrink-0 p-2.5 rounded-xl bg-hero-fuchsia hover:bg-pink-600 text-white shadow-fuchsia transition"
                    title="Scarica file"
                  >
                    <FileDown className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
