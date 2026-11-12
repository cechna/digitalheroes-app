import React from 'react';
import { FileText, AlertTriangle, Zap, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TerminiPage() {
  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-hero-fuchsia transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Torna alla Home
      </Link>

      <div className="flex items-center gap-3 pb-4 border-b border-white/10">
        <div className="p-3 rounded-2xl bg-hero-lightning/10 text-hero-lightning border border-hero-lightning/30 shadow-[0_0_15px_rgba(255,190,1,0.2)]">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Termini e Condizioni di Utilizzo
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Versione 1.0 — Comunità Digital Heroes</p>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-amber-500/10 border border-hero-lightning/30 text-hero-lightning text-xs flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 shrink-0 text-hero-lightning mt-0.5" />
        <div>
          <span className="font-bold text-white uppercase tracking-wider">Avviso per il Gestore:</span>
          <p className="mt-1 leading-relaxed text-slate-300">
            I presenti termini costituiscono la bozza standard della community aperta per il remote working a Salerno. Integrare con clausole specifiche qualora vengano attivati servizi a pagamento o sponsorizzazioni formali prima del rilascio pubblico.
          </p>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6 text-slate-300 text-sm leading-relaxed">
        <section>
          <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4 text-hero-fuchsia" />
            1. Spirito della Community e Oggetto
          </h2>
          <p>
            <strong className="text-white">Digital Heroes</strong> è una community informale e indipendente nata per riunire chi lavora da remoto o studia il digitale e l&apos;AI a Salerno e provincia. <em>Nessuno scopo commerciale, zero marchette, supporto spontaneo tra pari.</em> L&apos;iscrizione alla piattaforma dà accesso agli eventi di coworking nei bar con tavoli adatti e prese o al The Green Hub, alla bacheca e all&apos;archivio materiali.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4 text-hero-fuchsia" />
            2. Codice di Condotta e Iscrizione
          </h2>
          <p>
            Tutti i partecipanti sono tenuti al reciproco rispetto, alla collaborazione e all&apos;accoglienza. È severamente vietato ogni comportamento discriminatorio, molestia o spam commerciale non autorizzato durante i meetup fisici o nelle comunicazioni della community. L&apos;amministratore si riserva la facoltà di revocare l&apos;accesso in caso di violazioni gravi.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4 text-hero-fuchsia" />
            3. Materiali e Proprietà Intellettuale
          </h2>
          <p>
            I materiali didattici, presentazioni, appunti e snippet condivisi dagli organizzatori e relatori sono destinati all&apos;uso personale e formativo dei membri della community. La ridistribuzione a scopo di lucro senza espresso consenso dei creatori è vietata.
          </p>
        </section>
      </div>
    </div>
  );
}
