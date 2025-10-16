'use client';

import Link from 'next/link';
import { Bilan } from '@/types/database.types';

interface BilanCardProps {
  bilan: Bilan;
  role?: 'beneficiaire' | 'consultant' | 'admin';
}

const statusColors = {
  en_attente: 'bg-gray-100 text-gray-800',
  en_cours: 'bg-blue-100 text-blue-800',
  termine: 'bg-green-100 text-green-800',
  abandonne: 'bg-red-100 text-red-800',
};

const statusLabels = {
  en_attente: 'En attente',
  en_cours: 'En cours',
  termine: 'Terminé',
  abandonne: 'Abandonné',
};

const santeColors = {
  vert: 'bg-green-500',
  orange: 'bg-orange-500',
  rouge: 'bg-red-500',
};

export default function BilanCard({ bilan, role = 'beneficiaire' }: BilanCardProps) {
  const getBaseUrl = () => {
    if (role === 'consultant') return '/bilans';
    if (role === 'admin') return '/bilans';
    return '/beneficiaire-dashboard';
  };

  const progress = calculateProgress(bilan);

  return (
    <Link href={`${getBaseUrl()}/${bilan.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer border border-gray-200">
        {/* En-tête */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {bilan.titre}
            </h3>
            {bilan.description && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {bilan.description}
              </p>
            )}
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              statusColors[bilan.status]
            }`}
          >
            {statusLabels[bilan.status]}
          </span>
        </div>

        {/* Indicateurs */}
        <div className="space-y-3">
          {/* Barre de progression */}
          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Progression</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Dates */}
          <div className="flex justify-between text-sm">
            <div>
              <span className="text-gray-500">Début :</span>
              <span className="ml-2 text-gray-900">
                {bilan.date_debut
                  ? new Date(bilan.date_debut).toLocaleDateString('fr-FR')
                  : 'Non défini'}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Fin prévue :</span>
              <span className="ml-2 text-gray-900">
                {bilan.date_fin_prevue
                  ? new Date(bilan.date_fin_prevue).toLocaleDateString('fr-FR')
                  : 'Non défini'}
              </span>
            </div>
          </div>

          {/* Santé du bilan (pour consultants) */}
          {role !== 'beneficiaire' && bilan.sante_bilan && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Santé :</span>
              <div className="flex items-center gap-1">
                <div
                  className={`w-3 h-3 rounded-full ${
                    santeColors[bilan.sante_bilan]
                  }`}
                />
                <span className="text-sm font-medium capitalize">
                  {bilan.sante_bilan}
                </span>
              </div>
              {bilan.alerte_decrochage && (
                <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">
                  ⚠️ Alerte décrochage
                </span>
              )}
            </div>
          )}

          {/* Score d'engagement (pour consultants) */}
          {role !== 'beneficiaire' && bilan.engagement_score !== null && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Engagement :</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                <div
                  className={`h-2 rounded-full ${
                    bilan.engagement_score >= 70
                      ? 'bg-green-500'
                      : bilan.engagement_score >= 40
                      ? 'bg-orange-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${bilan.engagement_score}%` }}
                />
              </div>
              <span className="text-sm font-medium">{bilan.engagement_score}%</span>
            </div>
          )}
        </div>

        {/* Pied de carte */}
        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
          <span>
            Créé le {new Date(bilan.created_at).toLocaleDateString('fr-FR')}
          </span>
          {bilan.derniere_activite && (
            <span>
              Dernière activité :{' '}
              {new Date(bilan.derniere_activite).toLocaleDateString('fr-FR')}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// Fonction pour calculer la progression
function calculateProgress(bilan: Bilan): number {
  let progress = 0;

  if (bilan.preliminaire_completed_at) progress += 33;
  if (bilan.investigation_completed_at) progress += 33;
  if (bilan.conclusion_completed_at) progress += 34;

  return Math.round(progress);
}

