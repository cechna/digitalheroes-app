import React from 'react';
import { getCurrentUser } from '@/lib/services/auth';
import { repository } from '@/lib/services/repository';
import { formatItalianDate } from '@/lib/utils/date';
import { UploadMaterialModal } from '@/components/management/UploadMaterialModal';
import { FileDown, Lock, Check, Zap } from 'lucide-react';

export default async function GestioneMaterialiPage() {
  const user = await getCurrentUser();
  const materials = await repository.listMaterials(user?.id);
  const activities = await repository.listActivities({ userId: user?.id });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-hero-lightning fill-hero-lightning" />
            Archivio Materiali Didattici ({materials.length})
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Carica slide, dispense, template e gestisci i permessi di download per singoli eventi o per tutta la community.
          </p>
        </div>

        <UploadMaterialModal activities={activities} />
      </div>

      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 border-b border-white/10 text-slate-300 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Nome File & Titolo</th>
                <th className="p-4">Categoria</th>
                <th className="p-4">Dimensione</th>
                <th className="p-4">Visibilità & Accesso</th>
                <th className="p-4">Data Caricamento</th>
                <th className="p-4 text-right">Download Test</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {materials.map((mat) => (
                <tr key={mat.id} className="hover:bg-white/5">
                  <td className="p-4">
                    <div className="font-bold text-white text-sm">{mat.title}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{mat.file_name}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-lg bg-white/10 font-black text-hero-cyan text-[10px] uppercase">
                      {mat.category}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300">
                    {(mat.file_size / (1024 * 1024)).toFixed(2)} MB
                  </td>
                  <td className="p-4">
                    {mat.visibility === 'all_members' ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Tutti gli iscritti
                      </span>
                    ) : (
                      <span className="text-hero-lightning font-bold flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" /> Solo iscritti attività
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-slate-400">{formatItalianDate(mat.created_at)}</td>
                  <td className="p-4 text-right">
                    <a
                      href={`/api/materials/${mat.id}/download`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-hero-fuchsia hover:bg-pink-600 text-white font-bold rounded-xl text-xs transition shadow-fuchsia"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      Scarica
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
