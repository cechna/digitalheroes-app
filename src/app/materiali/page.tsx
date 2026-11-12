import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/services/auth';
import { repository } from '@/lib/services/repository';
import { formatItalianDate } from '@/lib/utils/date';
import {
  FileDown,
  Lock,
  Search,
  FileText,
  FileSpreadsheet,
  FileArchive,
  Image as ImageIcon,
  Zap,
} from 'lucide-react';

export default async function MaterialiPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; q?: string }>;
}) {
  const user = await getCurrentUser();
  const { categoria, q } = await searchParams;

  let materials = await repository.listMaterials(user?.id);

  if (categoria) {
    materials = materials.filter((m) => m.category.toLowerCase() === categoria.toLowerCase());
  }
  if (q) {
    const query = q.toLowerCase();
    materials = materials.filter(
      (m) =>
        m.title.toLowerCase().includes(query) ||
        (m.description && m.description.toLowerCase().includes(query)) ||
        m.file_name.toLowerCase().includes(query)
    );
  }

  const categories = Array.from(new Set(materials.map((m) => m.category)));

  const getFileIcon = (mime: string, filename: string) => {
    if (mime.includes('pdf')) return <FileText className="w-6 h-6 text-hero-fuchsia" />;
    if (mime.includes('sheet') || mime.includes('excel'))
      return <FileSpreadsheet className="w-6 h-6 text-emerald-400" />;
    if (mime.includes('zip') || filename.endsWith('.zip'))
      return <FileArchive className="w-6 h-6 text-hero-lightning" />;
    if (mime.includes('image')) return <ImageIcon className="w-6 h-6 text-hero-cyan" />;
    return <FileText className="w-6 h-6 text-slate-400" />;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-hero-lightning mb-1">
            <Zap className="w-3.5 h-3.5 fill-hero-lightning" />
            Risorse & Guide Esclusive
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Mappe, Slide & <span className="text-hero-fuchsia">Materiali da Scaricare</span>
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Mappa degli spazi work-friendly di Salerno e provincia, slide dei meetup e guide operative sul remote working.
          </p>
        </div>

        {(user?.role === 'admin' || user?.role === 'organizer') && (
          <Link
            href="/gestione/materiali"
            className="self-start sm:self-auto px-5 py-2.5 bg-gradient-to-r from-hero-fuchsia to-pink-600 hover:from-pink-600 hover:to-hero-fuchsia text-white text-xs font-black rounded-xl shadow-fuchsia transition duration-200"
          >
            + Carica Materiale
          </Link>
        )}
      </div>

      {/* Ricerca e Filtri */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form method="GET" className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            name="q"
            defaultValue={q || ''}
            placeholder="Cerca materiali per titolo o parola chiave..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-hero-fuchsia focus:ring-1 focus:ring-hero-fuchsia"
          />
        </form>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <Link
            href="/materiali"
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              !categoria ? 'bg-hero-fuchsia text-white shadow-fuchsia' : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            Tutte
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/materiali?categoria=${encodeURIComponent(cat)}`}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                categoria?.toLowerCase() === cat.toLowerCase()
                  ? 'bg-hero-fuchsia text-white shadow-fuchsia'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Grid Materiali */}
      {materials.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-3xl border border-dashed border-white/15 p-6">
          <FileDown className="w-14 h-14 text-slate-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-white">Nessun materiale disponibile</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Non ci sono documenti corrispondenti ai criteri di ricerca o associati al tuo account.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {materials.map((mat) => (
            <div
              key={mat.id}
              className="glass-panel rounded-2xl border border-white/10 p-6 shadow-xl hover:border-hero-fuchsia/40 hover:shadow-fuchsia transition duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 shrink-0 group-hover:scale-105 transition">
                    {getFileIcon(mat.mime_type, mat.file_name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-hero-cyan border border-hero-cyan/20">
                        {mat.category}
                      </span>
                      {mat.visibility === 'activity_attendees' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-hero-lightning/15 text-hero-lightning border border-hero-lightning/30 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Solo iscritti attività
                        </span>
                      )}
                    </div>
                    <h3 className="font-extrabold text-white text-base leading-snug group-hover:text-hero-fuchsia-light transition">
                      {mat.title}
                    </h3>
                  </div>
                </div>

                {mat.description && (
                  <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                    {mat.description}
                  </p>
                )}

                <div className="text-[11px] text-slate-400 mb-4 flex items-center gap-2">
                  <span className="font-mono text-slate-400">{mat.file_name}</span>
                  <span>•</span>
                  <span>{(mat.file_size / (1024 * 1024)).toFixed(2)} MB</span>
                  <span>•</span>
                  <span>{formatItalianDate(mat.created_at)}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {mat.visibility === 'all_members' ? 'Accesso libero per tutti gli iscritti' : 'Accesso riservato'}
                </span>
                <a
                  href={`/api/materials/${mat.id}/download`}
                  className="px-4 py-2 bg-gradient-to-r from-hero-fuchsia to-pink-600 hover:from-pink-600 hover:to-hero-fuchsia text-white text-xs font-black rounded-xl shadow-fuchsia transition flex items-center gap-1.5"
                >
                  <FileDown className="w-4 h-4" />
                  Scarica File
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
