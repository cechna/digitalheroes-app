import React from 'react';
import { Shield, Lock, CheckCircle2, FileText, ArrowLeft, Mail, ExternalLink, Database, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Informativa Privacy (GDPR) - Digital ⚡ Heroes',
  description: 'Informativa sul trattamento dei dati personali ai sensi degli artt. 13 e 14 del Regolamento UE 2016/679 (GDPR) per la community Digital Heroes.',
};

export default function PrivacyPage() {
  const lastUpdated = '4 Novembre 2026';
  const privacyVersion = '1.0';

  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6 space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-hero-fuchsia transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Torna alla Home
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3.5">
          <div className="p-3.5 rounded-2xl bg-hero-fuchsia/10 text-hero-fuchsia border border-hero-fuchsia/30 shadow-[0_0_20px_rgba(228,4,136,0.25)]">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Informativa sul Trattamento dei Dati Personali
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Ai sensi degli artt. 13 e 14 del Regolamento Generale sulla Protezione dei Dati (UE) 2016/679 (&quot;GDPR&quot;)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Versione <strong className="text-white">{privacyVersion}</strong> • {lastUpdated}</span>
        </div>
      </div>

      {/* Sintesi Rapida per l'Utente */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 bg-gradient-to-br from-white/5 to-hero-surface/80 space-y-4">
        <div className="flex items-center gap-2 text-hero-lightning text-xs font-black uppercase tracking-wider">
          <CheckCircle2 className="w-4 h-4" />
          Sintesi della nostra politica in 4 punti chiari:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
            <strong className="text-white block mb-1">1. Nessuna profilazione commerciale</strong>
            Non vendiamo mai i tuoi dati né mostriamo annunci pubblicitari di terze parti.
          </div>
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
            <strong className="text-white block mb-1">2. Solo cookie tecnici essenziali</strong>
            Utilizziamo esclusivamente cookie HTTP-Only necessari all&apos;autenticazione sicura della sessione.
          </div>
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
            <strong className="text-white block mb-1">3. Controllo totale nelle tue mani</strong>
            Dalla sezione <Link href="/profilo" className="text-hero-fuchsia underline font-bold">Profilo</Link> puoi scaricare tutti i tuoi dati in JSON o eliminare definitivamente il tuo account con un click.
          </div>
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
            <strong className="text-white block mb-1">4. Archiviazione sicura in Europa</strong>
            I dati risiedono su infrastrutture cloud conformi al GDPR con policy a livello di riga (Row Level Security).
          </div>
        </div>
      </div>

      {/* Contenuto Completo Articolato */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 space-y-8 text-slate-300 text-sm leading-relaxed">
        {/* Sezione 1: Titolare del Trattamento */}
        <section className="space-y-3">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <span className="text-hero-fuchsia">1.</span> Titolare del Trattamento
          </h2>
          <p>
            Il Titolare del trattamento dei dati personali raccolti tramite la presente piattaforma web è:
          </p>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5 text-xs">
            <p className="font-bold text-white text-sm">Community Digital Heroes</p>
            <p className="text-slate-300">Iniziativa territoriale per il remote working, digitale e innovazione a Salerno e provincia.</p>
            <p className="text-slate-400">Sede operativa / riferimento: The Green Hub, Cava de&apos; Tirreni (SA) / Salerno.</p>
            <p className="text-slate-300 flex items-center gap-1.5 pt-1">
              <Mail className="w-3.5 h-3.5 text-hero-fuchsia" />
              Email per l&apos;esercizio dei diritti privacy:{' '}
              <a href="mailto:privacy@digital-heroes.net" className="text-hero-fuchsia underline font-semibold">
                privacy@digital-heroes.net
              </a>
            </p>
          </div>
        </section>

        {/* Sezione 2: Tipologia di Dati Trattati */}
        <section className="space-y-3">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <span className="text-hero-fuchsia">2.</span> Tipologia di Dati Personali Trattati
          </h2>
          <p>
            Nell&apos;ambito dell&apos;erogazione dei servizi della piattaforma, vengono raccolte e trattate le seguenti categorie di dati:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
            <li>
              <strong className="text-white">Dati identificativi e di contatto:</strong> nome, cognome, indirizzo di posta elettronica, eventuale organizzazione o attività lavorativa indicata dall&apos;utente al momento della registrazione o nell&apos;area profilo.
            </li>
            <li>
              <strong className="text-white">Dati di partecipazione alle attività della community:</strong> eventi, meetup di coworking nei bar work-friendly o corsi a cui l&apos;utente ha effettuato l&apos;iscrizione, date e orari di registrazione o disdetta.
            </li>
            <li>
              <strong className="text-white">Dati relativi ai materiali riservati:</strong> metadati relativi al download autorizzato di dispense, slide, codice o guide fornite dai relatori.
            </li>
            <li>
              <strong className="text-white">Dati di messaggistica interna e comunicazioni:</strong> messaggi operativi inviati dagli organizzatori, stato di lettura della casella interna e consensi espliciti alle notifiche email.
            </li>
            <li>
              <strong className="text-white">Dati tecnici di navigazione e log di sistema:</strong> indirizzo IP anonimizzato, log di audit delle operazioni amministrative rilevanti (per finalità di integrità e sicurezza del sistema).
            </li>
          </ul>
        </section>

        {/* Sezione 3: Finalità e Basi Giuridiche del Trattamento */}
        <section className="space-y-3">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <span className="text-hero-fuchsia">3.</span> Finalità del Trattamento e Basi Giuridiche
          </h2>
          <div className="space-y-3 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <strong className="text-white block font-bold text-sm">
                A. Gestione dell&apos;iscrizione alla piattaforma e partecipazione alle attività
              </strong>
              <p>
                Consentire la creazione del profilo, l&apos;accesso all&apos;area riservata, la prenotazione del posto ai meetup e corsi, il download dei materiali didattici e la ricezione di comunicazioni di servizio strettamente operative (cambi di orario, link alle sessioni).
              </p>
              <p className="text-hero-lightning text-[11px] font-semibold pt-1">
                Base giuridica: Esecuzione di misure contrattuali o precontrattuali di cui l&apos;interessato è parte (Art. 6, par. 1, lett. b del GDPR).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <strong className="text-white block font-bold text-sm">
                B. Notifiche informative e Newsletter facoltativa
              </strong>
              <p>
                Inviare aggiornamenti su nuove iniziative, spazi di lavoro condiviso, progetti open source e guide per il lavoro da remoto.
              </p>
              <p className="text-hero-lightning text-[11px] font-semibold pt-1">
                Base giuridica: Consenso espresso e liberamente revocabile in qualsiasi momento dal profilo personale (Art. 6, par. 1, lett. a del GDPR).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <strong className="text-white block font-bold text-sm">
                C. Sicurezza informatica, prevenzione frodi e conformità legale
              </strong>
              <p>
                Protezione della piattaforma da accessi abusivi, prevenzione di abusi sui download dei materiali protetti, tracciamento atomico delle capienze per la sicurezza degli spazi fisici e tenuta dei log di audit.
              </p>
              <p className="text-hero-lightning text-[11px] font-semibold pt-1">
                Base giuridica: Legittimo interesse del titolare alla sicurezza della rete e delle informazioni (Art. 6, par. 1, lett. f del GDPR) e adempimento di obblighi legali (Art. 6, par. 1, lett. c del GDPR).
              </p>
            </div>
          </div>
        </section>

        {/* Sezione 4: Cookie Policy e Archiviazione Locale */}
        <section className="space-y-3">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <span className="text-hero-fuchsia">4.</span> Politica sui Cookie e Tecnologie di Archiviazione Locale
          </h2>
          <p>
            La piattaforma Digital Heroes è stata progettata nel rispetto del principio di <em>Privacy by Design</em> e <em>Minimizzazione dei dati</em>:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
            <li>
              <strong className="text-white">Nessun cookie di profilazione o tracciamento pubblicitario:</strong> non utilizziamo Google Analytics, pixel di Meta, tracker commerciali né strumenti di fingerprinting.
            </li>
            <li>
              <strong className="text-white">Cookie tecnici essenziali (HTTP-Only):</strong> utilizziamo esclusivamente il cookie tecnico di sessione <code className="bg-white/10 px-1.5 py-0.5 rounded text-hero-cyan text-xs">dh_session_user_id</code> (o token Supabase Auth), strettamente necessario per mantenere l&apos;accesso autenticato all&apos;area riservata. Essendo cookie tecnici, ai sensi dell&apos;art. 122 del Codice Privacy e delle Linee Guida del Garante Privacy italiano (10 giugno 2021), non richiedono il consenso preventivo dell&apos;utente né banner di blocco invasivi.
            </li>
            <li>
              <strong className="text-white">Service Worker e Cache PWA:</strong> per consentire l&apos;installazione dell&apos;applicazione su smartphone come Progressive Web App (PWA), il browser può memorizzare nella cache locale le sole risorse statiche d&apos;interfaccia (icone, font, fogli di stile), senza conservare file riservati o dati sensibili non autorizzati.
            </li>
          </ul>
        </section>

        {/* Sezione 5: Modalità del Trattamento e Sicurezza */}
        <section className="space-y-3">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <span className="text-hero-fuchsia">5.</span> Misure Tecniche e Organizzative di Sicurezza
          </h2>
          <p>
            Tutti i trattamenti vengono effettuati mediante strumenti elettronici automatizzati, nel rispetto dei principi di correttezza, liceità e trasparenza, con l&apos;adozione di rigide misure di sicurezza (Art. 32 GDPR):
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Crittografia in transito e a riposo</strong>
                Protocollo HTTPS/TLS obbligatorio e storage protetto su PostgreSQL.
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5">
              <Database className="w-4 h-4 text-hero-cyan shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Row Level Security (RLS)</strong>
                Isolamento dei dati a livello di database per impedire accessi incrociati non autorizzati.
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5">
              <Shield className="w-4 h-4 text-hero-fuchsia shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">URL di Download a Scadenza</strong>
                I materiali privati non sono mai indicizzati né esposti pubblicamente.
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5">
              <FileText className="w-4 h-4 text-hero-lightning shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Validazione Magic Bytes</strong>
                I file caricati vengono controllati nella firma binaria per prevenire codice malevolo.
              </div>
            </div>
          </div>
        </section>

        {/* Sezione 6: Destinatari dei Dati e Fornitori Terzi */}
        <section className="space-y-3">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <span className="text-hero-fuchsia">6.</span> Destinatari dei Dati e Trasferimento Estero
          </h2>
          <p>
            I dati personali non vengono ceduti a terzi per scopi promozionali. Possono essere trattati unicamente da fornitori tecnici nominati Responsabili del Trattamento (Art. 28 GDPR):
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
            <li>
              <strong className="text-white">Hosting e Database:</strong> Supabase Inc. (infrastruttura PostgreSQL e Storage situata in server data-center nell&apos;Unione Europea) e Vercel Inc. (infrastruttura di hosting applicativo edge con crittografia TLS).
            </li>
            <li>
              <strong className="text-white">Servizio di Invio Email Transazionali:</strong> Resend / provider SMTP configurato, utilizzato esclusivamente per recapitare conferme di iscrizione e aggiornamenti operativi degli eventi.
            </li>
          </ul>
          <p className="text-xs text-slate-400">
            Eventuali trasferimenti verso paesi terzi al di fuori dello Spazio Economico Europeo (SEE) avvengono esclusivamente sulla base di Decisioni di Adeguatezza della Commissione Europea o mediante la sottoscrizione di Clausole Contrattuali Standard (Standard Contractual Clauses - SCC).
          </p>
        </section>

        {/* Sezione 7: Periodo di Conservazione dei Dati */}
        <section className="space-y-3">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <span className="text-hero-fuchsia">7.</span> Periodo di Conservazione dei Dati
          </h2>
          <p>
            I dati del profilo e le iscrizioni alle attività vengono conservati per l&apos;intera durata della permanenza dell&apos;utente nella community Digital Heroes. Qualora l&apos;iscritto richieda la cancellazione del proprio account, tutti i dati personali identificativi vengono eliminati permanentemente e in tempo reale dal database. I dati aggregati o resi anonimi potranno essere conservati esclusivamente a fini statistici interni (es. conteggio presenze totali ai meetup senza riferimenti a persone).
          </p>
        </section>

        {/* Sezione 8: Diritti dell'Interessato (GDPR) */}
        <section className="space-y-3">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <span className="text-hero-fuchsia">8.</span> Diritti dell&apos;Interessato (Artt. 15-22 GDPR)
          </h2>
          <p>
            In qualità di interessato, il GDPR ti garantisce il pieno controllo sui tuoi dati personali. Puoi esercitare in ogni momento i seguenti diritti:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <strong className="text-white block font-bold mb-1">Diritto di Accesso e Rettifica</strong>
              Visualizzare e modificare le tue informazioni anagrafiche in tempo reale.
            </div>
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <strong className="text-white block font-bold mb-1">Diritto alla Portabilità (JSON)</strong>
              Scaricare tutti i tuoi dati e le iscrizioni direttamente dalla pagina Profilo in formato strutturato.
            </div>
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <strong className="text-white block font-bold mb-1">Diritto alla Cancellazione (Oblio)</strong>
              Cancellare il tuo account e tutte le tue registrazioni con eliminazione immediata.
            </div>
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <strong className="text-white block font-bold mb-1">Revoca del Consenso e Opposizione</strong>
              Modificare in qualsiasi momento le preferenze per le comunicazioni email opzionali.
            </div>
          </div>

          <div className="pt-2 text-xs text-slate-300">
            <p>
              Tutte le funzionalità di <strong>Esportazione Dati</strong> e <strong>Cancellazione Account</strong> sono fruibili autonomamente e istantaneamente nell&apos;area{' '}
              <Link href="/profilo" className="text-hero-fuchsia font-bold underline">
                Profilo Utente
              </Link>.
            </p>
            <p className="mt-2 text-slate-400">
              Hai inoltre sempre il diritto di proporre reclamo all&apos;Autorità di controllo nazionale (Garante per la Protezione dei Dati Personali - Piazza Venezia n. 11, 00187 Roma,{' '}
              <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" className="text-hero-cyan underline inline-flex items-center gap-1">
                www.garanteprivacy.it <ExternalLink className="w-3 h-3 inline" />
              </a>
              ).
            </p>
          </div>
        </section>

        {/* Sezione 9: Aggiornamenti dell'Informativa */}
        <section className="space-y-3 pt-4 border-t border-white/10">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <span className="text-hero-fuchsia">9.</span> Modifiche alla Presente Informativa
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            La presente informativa potrà subire modifiche in seguito all&apos;introduzione di nuove funzionalità o aggiornamenti normativi. In caso di modifiche sostanziali, gli utenti registrati riceveranno apposita comunicazione nell&apos;applicazione o via email prima dell&apos;entrata in vigore delle nuove disposizioni.
          </p>
        </section>
      </div>
    </div>
  );
}
