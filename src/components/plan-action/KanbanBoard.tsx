'use client';

import { useState, useEffect } from 'react';
import { PlanAction } from '@/types/database.types';
import { planActionModule } from '@/lib/supabase/modules';

interface KanbanBoardProps {
  bilanId: string;
}

const columns = [
  { id: 'a_faire', label: 'À faire', color: 'bg-gray-100' },
  { id: 'en_cours', label: 'En cours', color: 'bg-blue-100' },
  { id: 'termine', label: 'Terminé', color: 'bg-green-100' },
];

export default function KanbanBoard({ bilanId }: KanbanBoardProps) {
  const [actions, setActions] = useState<PlanAction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActions();
  }, [bilanId]);

  const loadActions = async () => {
    try {
      const data = await planActionModule.getActionsByBilan(bilanId);
      setActions(data);
    } catch (error) {
      console.error('Erreur chargement actions:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateActionStatus = async (actionId: string, newStatus: string) => {
    try {
      await planActionModule.updateAction(actionId, { statut: newStatus });
      loadActions();
    } catch (error) {
      console.error('Erreur mise à jour action:', error);
    }
  };

  if (loading) return <div className="p-4">Chargement...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map((column) => (
        <div key={column.id} className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-gray-900 mb-4">{column.label}</h3>
          
          <div className="space-y-3">
            {actions
              .filter((action) => action.statut === column.id)
              .map((action) => (
                <div
                  key={action.id}
                  className={`${column.color} rounded-lg p-3 cursor-move`}
                  draggable
                  onDragEnd={() => {}}
                >
                  <h4 className="font-medium text-gray-900">{action.titre}</h4>
                  {action.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {action.description}
                    </p>
                  )}
                  
                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                    <span className="px-2 py-0.5 bg-white rounded-full">
                      {action.type}
                    </span>
                    {action.date_echeance && (
                      <span>
                        📅 {new Date(action.date_echeance).toLocaleDateString('fr-FR')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
