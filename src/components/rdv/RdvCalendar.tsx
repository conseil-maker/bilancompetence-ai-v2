'use client';

import { useState, useEffect } from 'react';
import { Rdv } from '@/types/database.types';
import * as rdvModule from '@/lib/supabase/modules/rdv';

interface RdvCalendarProps {
  userId: string;
  role: 'beneficiaire' | 'consultant';
}

export default function RdvCalendar({ userId, role }: RdvCalendarProps) {
  const [rdvs, setRdvs] = useState<Rdv[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    loadRdvs();
  }, [userId, selectedDate]);

  const loadRdvs = async () => {
    try {
      const data = role === 'beneficiaire' 
        ? await rdvModule.getRdvsBeneficiaire(userId)
        : await rdvModule.getRdvsConsultant(userId);
      setRdvs(data);
    } catch (error) {
      console.error('Erreur chargement RDV:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4">Chargement...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Mes Rendez-vous</h2>

      {/* Liste des RDV */}
      <div className="space-y-4">
        {rdvs.map((rdv) => (
          <div
            key={rdv.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900">{rdv.titre}</h3>
                <p className="text-sm text-gray-600 mt-1">{rdv.description}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  rdv.statut === 'confirme'
                    ? 'bg-green-100 text-green-800'
                    : rdv.statut === 'annule'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {rdv.statut}
              </span>
            </div>

            <div className="mt-3 flex gap-4 text-sm text-gray-600">
              <div>
                📅 {new Date(rdv.date_heure).toLocaleDateString('fr-FR')}
              </div>
              <div>
                🕐 {new Date(rdv.date_heure).toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
              <div>⏱️ {rdv.duree_minutes} min</div>
              {rdv.modalite && <div>📍 {rdv.modalite}</div>}
            </div>

            {rdv.lien_visio && (
              <a
                href={rdv.lien_visio}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-blue-600 hover:underline text-sm"
              >
                🔗 Rejoindre la visioconférence
              </a>
            )}
          </div>
        ))}

        {rdvs.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            Aucun rendez-vous prévu
          </p>
        )}
      </div>
    </div>
  );
}
