'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, Loader2, Bell, Pin, Zap } from 'lucide-react';
import { Activity } from '@/types/database';

interface CreateAnnouncementModalProps {
  activities: Activity[];
}

export function CreateAnnouncementModal({ activities }: CreateAnnouncementModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [externalLink, setExternalLink] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [isPinned, setIsPinned] = useState(false);
  const [visibility, setVisibility] = useState<'all_members' | 'activity_attendees'>('all_members');
  const [activityId, setActivityId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          imageUrl: imageUrl || null,
          externalLink: externalLink || null,
          status,
          isPinned,
          visibility,
          activityId: activityId || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Errore creazione annuncio.');
      }

      setIsOpen(false);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Errore pubblicazione');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-gradient-to-r from-amber-500 to-hero-lightning text-slate-950 font-black rounded-xl text-xs shadow-lightning transition flex items-center gap-1.5"
      >
        <Plus className="w-4 h-4" />
        Nuovo Aggiornamento ⚡
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="glass-panel bg-hero-surface/95 border border-white/15 rounded-3xl shadow-2xl max-w-xl w-full p-6 sm:p-8 my-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-hero-fuchsia" />
                Pubblica News in Bacheca
              </h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-xs text-rose-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Titolo dell&apos;Annuncio *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="es. ⚡ Nuova convenzione Coworking al Green Hub"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-hero-fuchsia"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Testo del Comunicato * (supporta **grassetto**, *corsivo*, link)
                </label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Scrivi qui il comunicato per la community..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-hero-fuchsia font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Stato</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-hero-card border border-white/10 text-white"
                  >
                    <option value="published">Pubblicato Subito</option>
                    <option value="draft">Bozza</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Destinatari</label>
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value as 'all_members' | 'activity_attendees')}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-hero-card border border-white/10 text-white"
                  >
                    <option value="all_members">Tutti gli iscritti</option>
                    <option value="activity_attendees">Solo iscritti a un meetup</option>
                  </select>
                </div>
              </div>

              {visibility === 'activity_attendees' && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Seleziona Attività</label>
                  <select
                    value={activityId}
                    onChange={(e) => setActivityId(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-hero-card border border-white/10 text-white"
                  >
                    <option value="">Seleziona...</option>
                    {activities.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">URL Immagine (Facoltativo)</label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Link Esterno (Facoltativo)</label>
                  <input
                    type="url"
                    value={externalLink}
                    onChange={(e) => setExternalLink(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="rounded text-hero-lightning focus:ring-hero-lightning h-4 w-4 bg-white/5 border-white/15"
                />
                <span className="text-xs text-slate-200 flex items-center gap-1.5 font-bold">
                  <Pin className="w-3.5 h-3.5 text-hero-lightning" />
                  Fissa questo annuncio in cima alla bacheca
                </span>
              </label>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 text-xs font-black text-white bg-gradient-to-r from-hero-fuchsia to-pink-600 rounded-xl shadow-fuchsia transition flex items-center gap-1.5"
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  Pubblica Ora
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
