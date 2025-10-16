'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { bilansModule } from '@/lib/supabase/modules';
import KanbanBoard from '@/components/plan-action/KanbanBoard';

export default function MonPlandActionPage() {
  const { user } = useAuth();
  const [bilanId, setBilanId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadBilan();
    }
  }, [user]);

  const loadBilan = async () => {
    try {
      if (!user) return;
      const bilans = await bilansModule.getBilansByBeneficiaire(user.id);
      if (bilans.length > 0) {
        setBilanId(bilans[0].id);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Chargement...</div>;
  }

  if (!bilanId) {
    return <div className="p-8 text-center">Aucun bilan actif</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Mon Plan d'Action</h1>
      <KanbanBoard bilanId={bilanId} />
    </div>
  );
}
