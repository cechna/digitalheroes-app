'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types/database';
import { Loader2, Check } from 'lucide-react';

interface UserRoleChangerProps {
  userId: string;
  initialRole: UserRole;
  currentAdminId: string;
}

export function UserRoleChanger({ userId, initialRole, currentAdminId }: UserRoleChangerProps) {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>(initialRole);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRoleChange = async (newRole: UserRole) => {
    if (userId === currentAdminId && newRole !== 'admin') {
      alert('Non puoi declassare il tuo stesso account amministratore.');
      return;
    }

    if (!confirm(`Sei sicuro di voler cambiare il ruolo in "${newRole}"?`)) {
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch('/api/admin/users/role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, newRole }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Errore modifica ruolo.');
      } else {
        setRole(newRole);
        setSuccess(true);
        router.refresh();
      }
    } catch {
      alert('Errore di rete.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={role}
        disabled={loading}
        onChange={(e) => handleRoleChange(e.target.value as UserRole)}
        className="text-xs rounded-xl border border-white/10 py-1.5 px-2.5 font-bold bg-hero-surface text-slate-200 focus:outline-none focus:border-hero-fuchsia"
      >
        <option value="member">Iscritto (Member)</option>
        <option value="organizer">Organizzatore</option>
        <option value="admin">Amministratore</option>
      </select>
      {loading && <Loader2 className="w-3.5 h-3.5 animate-spin text-hero-fuchsia" />}
      {success && <Check className="w-3.5 h-3.5 text-emerald-400" />}
    </div>
  );
}
