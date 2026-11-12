import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/services/auth';
import { repository } from '@/lib/services/repository';
import { formatItalianDate, formatItalianTime } from '@/lib/utils/date';
import { formatSafeContent } from '@/lib/utils/sanitize';
import { Bell, Pin, ExternalLink, ShieldCheck, Zap } from 'lucide-react';

export default async function BachecaPage() {
  const user = await getCurrentUser();
  const announcements = await repository.listAnnouncements(user?.id);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-hero-lightning mb-1">
            <Zap className="w-3.5 h-3.5 fill-hero-lightning" />
            Comunicati & Novità
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Bacheca Ufficiale <span className="text-hero-fuchsia">Digital Heroes</span>
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            News, aggiornamenti su eventi, spazi convenzionati e storie della community.
          </p>
        </div>

        {(user?.role === 'admin' || user?.role === 'organizer') && (
          <Link
            href="/gestione/bacheca"
            className="self-start sm:self-auto px-5 py-2.5 bg-gradient-to-r from-hero-fuchsia to-pink-600 hover:from-pink-600 hover:to-hero-fuchsia text-white text-xs font-black rounded-xl shadow-fuchsia transition flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            Pubblica Aggiornamento
          </Link>
        )}
      </div>

      {announcements.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-3xl border border-dashed border-white/15 p-6">
          <Bell className="w-14 h-14 text-slate-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-white">Nessun aggiornamento pubblicato</h2>
          <p className="text-xs text-slate-400 mt-1">
            Al momento non ci sono nuovi annunci in bacheca.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {announcements.map((ann) => (
            <article
              key={ann.id}
              className={`glass-panel rounded-3xl p-6 sm:p-8 shadow-xl transition duration-300 ${
                ann.is_pinned
                  ? 'border-hero-lightning/40 bg-hero-lightning/5 shadow-lightning'
                  : 'hover:border-hero-fuchsia/40'
              }`}
            >
              {ann.is_pinned && (
                <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-hero-lightning bg-amber-400/20 px-3 py-1 rounded-full w-fit mb-4 border border-hero-lightning/30">
                  <Zap className="w-3.5 h-3.5 fill-hero-lightning" />
                  In Evidenza
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
                <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
                  {ann.title}
                </h2>
                <time className="text-xs text-slate-400 shrink-0 font-medium">
                  {formatItalianDate(ann.published_at || ann.created_at)}, {formatItalianTime(ann.published_at || ann.created_at)}
                </time>
              </div>

              {ann.image_url && (
                <div className="my-4 rounded-2xl overflow-hidden bg-slate-900 max-h-80 border border-white/10">
                  <img
                    src={ann.image_url}
                    alt={ann.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Contenuto formattato e protetto da XSS */}
              <div
                className="text-slate-200 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: formatSafeContent(ann.content) }}
              />

              {ann.external_link && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <a
                    href={ann.external_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-hero-fuchsia-light hover:text-pink-300 hover:underline"
                  >
                    <span>Scopri di più</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
