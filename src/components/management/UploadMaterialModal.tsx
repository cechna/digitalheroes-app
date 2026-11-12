'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, X, Loader2, FileDown, Lock, Zap } from 'lucide-react';
import { Activity } from '@/types/database';

interface UploadMaterialModalProps {
  activities: Activity[];
}

export function UploadMaterialModal({ activities }: UploadMaterialModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Spazi & Territorio');
  const [activityId, setActivityId] = useState('');
  const [visibility, setVisibility] = useState<'all_members' | 'activity_attendees'>('all_members');
  const [availableFrom, setAvailableFrom] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Seleziona un file da caricare.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('activityId', activityId);
      formData.append('visibility', visibility);
      formData.append('availableFrom', availableFrom);

      const res = await fetch('/api/materials/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Errore caricamento materiale.');
      }

      setIsOpen(false);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Errore durante l’upload.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-gradient-to-r from-hero-cyan to-blue-600 text-white rounded-xl text-xs font-black shadow-lg transition flex items-center gap-1.5"
      >
        <Upload className="w-4 h-4" />
        Carica Materiale ⚡
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="glass-panel bg-hero-surface/95 border border-white/15 rounded-3xl shadow-2xl max-w-xl w-full p-6 sm:p-8 my-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <FileDown className="w-5 h-5 text-hero-cyan" />
                Carica Risorsa / Dispensa Riservata
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
                <label className="block text-xs font-bold text-slate-300 mb-1">File da caricare *</label>
                <input
                  type="file"
                  required
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.png,.jpg,.jpeg,.webp"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setSelectedFile(f);
                  }}
                  className="w-full text-xs text-slate-300 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-hero-cyan/20 file:text-hero-cyan hover:file:bg-hero-cyan/30 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Ammessi: PDF, DOCX, XLSX, PPTX, ZIP, PNG, JPG (max 25 MB). Magic bytes verificati sul server.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Titolo del Documento *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="es. Mappa Spazi Coworking e Work-Friendly 2026"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-hero-fuchsia"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Descrizione (Facoltativa)</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Breve spiegazione del contenuto..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-hero-fuchsia"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Categoria *</label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Spazi, Meetup, Guide"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Attività Collegata</label>
                  <select
                    value={activityId}
                    onChange={(e) => {
                      setActivityId(e.target.value);
                      if (e.target.value) {
                        setVisibility('activity_attendees');
                      }
                    }}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-hero-card border border-white/10 text-white"
                  >
                    <option value="">Nessuna (Materiale generale)</option>
                    {activities.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Regola di Accesso *</label>
                <div className="space-y-2 bg-white/5 p-3 rounded-xl border border-white/10">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="visibility"
                      value="all_members"
                      checked={visibility === 'all_members'}
                      onChange={() => setVisibility('all_members')}
                      className="text-hero-fuchsia focus:ring-hero-fuchsia"
                    />
                    <span className="text-xs text-slate-200">
                      Disponibile a <strong>tutti gli iscritti</strong> di Digital Heroes
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="visibility"
                      value="activity_attendees"
                      checked={visibility === 'activity_attendees'}
                      onChange={() => setVisibility('activity_attendees')}
                      className="text-hero-fuchsia focus:ring-hero-fuchsia"
                    />
                    <span className="text-xs text-slate-200 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-hero-lightning" />
                      Riservato <strong>soltanto agli iscritti confermati</strong> del meetup selezionato
                    </span>
                  </label>
                </div>
              </div>

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
                  Carica File ⚡
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
