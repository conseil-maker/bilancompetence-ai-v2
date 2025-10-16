'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { qualiopiModule } from '@/lib/supabase/modules';

interface Reclamation {
  id: string;
  beneficiaire_id: string;
  sujet: string;
  description: string;
  statut: string;
  date_soumission: string;
  date_resolution?: string;
  reponse?: string;
}

export default function ReclamationsPage() {
  const { user } = useAuth();
  const [reclamations, setReclamations] = useState<Reclamation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReclamation, setSelectedReclamation] = useState<Reclamation | null>(null);
  const [reponse, setReponse] = useState('');

  useEffect(() => {
    loadReclamations();
  }, []);

  const loadReclamations = async () => {
    try {
      setLoading(true);
      // Simuler le chargement
      const mockData: Reclamation[] = [
        {
          id: '1',
          beneficiaire_id: 'b1',
          sujet: 'Problème de connexion',
          description: 'Je ne peux pas accéder à mon compte',
          statut: 'En attente',
          date_soumission: new Date().toISOString(),
        },
        {
          id: '2',
          beneficiaire_id: 'b2',
          sujet: 'Document manquant',
          description: 'Mon certificat n\'a pas été généré',
          statut: 'En cours',
          date_soumission: new Date(Date.now() - 86400000).toISOString(),
        },
      ];
      setReclamations(mockData);
    } catch (err) {
      setError('Erreur lors du chargement des réclamations');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatut = async (id: string, newStatut: string) => {
    try {
      // Mettre à jour le statut
      setReclamations(prev =>
        prev.map(r => (r.id === id ? { ...r, statut: newStatut } : r))
      );
    } catch (err) {
      setError('Erreur lors de la mise à jour');
    }
  };

  const handleSubmitReponse = async () => {
    if (!selectedReclamation || !reponse) return;

    try {
      setReclamations(prev =>
        prev.map(r =>
          r.id === selectedReclamation.id
            ? { ...r, reponse, statut: 'Résolue', date_resolution: new Date().toISOString() }
            : r
        )
      );
      setSelectedReclamation(null);
      setReponse('');
    } catch (err) {
      setError('Erreur lors de l\'envoi de la réponse');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-600 font-bold">Erreur</h2>
          <p className="text-red-500">{error}</p>
          <button
            onClick={loadReclamations}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Gestion des Réclamations</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Sujet
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Bénéficiaire
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reclamations.map(reclamation => (
              <tr key={reclamation.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{reclamation.sujet}</div>
                  <div className="text-sm text-gray-500">{reclamation.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {reclamation.beneficiaire_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      reclamation.statut === 'Résolue'
                        ? 'bg-green-100 text-green-800'
                        : reclamation.statut === 'En cours'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {reclamation.statut}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(reclamation.date_soumission).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => setSelectedReclamation(reclamation)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Traiter
                  </button>
                  {reclamation.statut !== 'Résolue' && (
                    <button
                      onClick={() => handleUpdateStatut(reclamation.id, 'En cours')}
                      className="text-green-600 hover:text-green-900"
                    >
                      Marquer en cours
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedReclamation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-4">{selectedReclamation.sujet}</h2>
            <p className="text-gray-600 mb-4">{selectedReclamation.description}</p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Votre réponse
              </label>
              <textarea
                value={reponse}
                onChange={(e) => setReponse(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Entrez votre réponse..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setSelectedReclamation(null);
                  setReponse('');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmitReponse}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Envoyer la réponse
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

