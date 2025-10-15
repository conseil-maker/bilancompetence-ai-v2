'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DocumentSynthese } from '@/types/documents';

export default function SynthesePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bilanId = searchParams.get('bilanId');
  
  const [loading, setLoading] = useState(false);
  const [synthese, setSynthese] = useState<DocumentSynthese | null>(null);
  const [mode, setMode] = useState<'generation' | 'apercu' | 'termine'>('generation');
  const [generationIA, setGenerationIA] = useState(false);

  useEffect(() => {
    if (bilanId) {
      chargerDonneesBilan(bilanId);
    }
  }, [bilanId]);

  const chargerDonneesBilan = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/bilans/${id}/donnees-synthese`);
      if (!response.ok) throw new Error('Erreur lors du chargement');

      const data = await response.json();
      // Les données du bilan sont chargées et prêtes pour la génération
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du chargement des données du bilan');
    } finally {
      setLoading(false);
    }
  };

  const genererSynthese = async (avecIA: boolean) => {
    setLoading(true);
    setGenerationIA(avecIA);

    try {
      const response = await fetch('/api/documents/synthese', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bilanId,
          avecIA,
        }),
      });

      if (!response.ok) throw new Error('Erreur lors de la génération');

      const data = await response.json();
      setSynthese(data.synthese);
      setMode('apercu');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la génération du document de synthèse');
    } finally {
      setLoading(false);
    }
  };

  const validerEtFinaliser = async () => {
    if (!synthese) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/documents/synthese/${synthese.id}/finaliser`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Erreur lors de la finalisation');

      setMode('termine');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la finalisation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Document de Synthèse du Bilan</h1>

      {/* Mode Génération */}
      {mode === 'generation' && (
        <div className="space-y-6">
          {/* Informations */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
            <h2 className="text-xl font-bold mb-2">📄 À propos du Document de Synthèse</h2>
            <p className="mb-4">
              Le document de synthèse est le livrable final remis au bénéficiaire à l'issue du bilan de compétences.
              Il contient l'ensemble des résultats, analyses et recommandations.
            </p>
            <p className="text-sm text-gray-700">
              <strong>Contenu :</strong> Parcours réalisé, compétences identifiées, projet professionnel,
              plan d'action détaillé, recommandations personnalisées.
            </p>
          </div>

          {/* Options de génération */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Mode de Génération</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Génération Automatique (IA) */}
              <div className="border-2 border-blue-500 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">🤖</div>
                  <div>
                    <h3 className="text-lg font-bold">Génération Automatique (IA)</h3>
                    <p className="text-sm text-gray-600">Recommandé - Rapide et complet</p>
                  </div>
                </div>
                
                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Analyse automatique de toutes les données du bilan</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Synthèse rédigée par IA (GPT-4)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Recommandations personnalisées</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Plan d'action structuré</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Gain de temps : 2-3 minutes</span>
                  </li>
                </ul>
                
                <button
                  onClick={() => genererSynthese(true)}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
                >
                  {loading && generationIA ? 'Génération en cours...' : 'Générer avec IA'}
                </button>
              </div>

              {/* Génération Manuelle */}
              <div className="border-2 border-gray-300 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">✍️</div>
                  <div>
                    <h3 className="text-lg font-bold">Génération Manuelle</h3>
                    <p className="text-sm text-gray-600">Pour personnalisation avancée</p>
                  </div>
                </div>
                
                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Template pré-rempli avec les données</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Modification libre de chaque section</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Contrôle total sur le contenu</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Ajout de sections personnalisées</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">⚠</span>
                    <span>Temps estimé : 30-60 minutes</span>
                  </li>
                </ul>
                
                <button
                  onClick={() => genererSynthese(false)}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 font-medium"
                >
                  {loading && !generationIA ? 'Génération en cours...' : 'Générer manuellement'}
                </button>
              </div>
            </div>
          </div>

          {/* Informations complémentaires */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-bold mb-3">ℹ️ Informations Importantes</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Le document de synthèse appartient au bénéficiaire (propriété intellectuelle)</li>
              <li>• Il ne peut être communiqué à des tiers sans l'accord du bénéficiaire</li>
              <li>• Une copie sera archivée de manière sécurisée pendant 3 ans (obligation légale)</li>
              <li>• Le bénéficiaire peut demander des modifications avant finalisation</li>
            </ul>
          </div>
        </div>
      )}

      {/* Mode Aperçu */}
      {mode === 'apercu' && synthese && (
        <div className="space-y-6">
          {/* Aperçu du document */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">Aperçu du Document de Synthèse</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Version {synthese.versionNumber} - Généré le {new Date(synthese.dateCreation).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => window.open(`/api/documents/synthese/${synthese.id}/preview`, '_blank')}
                    className="px-4 py-2 border rounded hover:bg-gray-100"
                  >
                    👁️ Plein écran
                  </button>
                  <button
                    onClick={() => window.open(`/api/documents/synthese/${synthese.id}/download`, '_blank')}
                    className="px-4 py-2 border rounded hover:bg-gray-100"
                  >
                    📥 Télécharger PDF
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <iframe
                src={`/api/documents/synthese/${synthese.id}/preview`}
                className="w-full h-[800px] border rounded"
              />
            </div>
          </div>

          {/* Statistiques du document */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-blue-600">
                {synthese.contenu.parcours.phaseInvestigation.competencesIdentifiees.length}
              </div>
              <div className="text-sm text-gray-600">Compétences</div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-green-600">
                {synthese.contenu.parcours.phaseInvestigation.pistesExplorees.length}
              </div>
              <div className="text-sm text-gray-600">Pistes Métiers</div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-purple-600">
                {synthese.contenu.planAction.actions.length}
              </div>
              <div className="text-sm text-gray-600">Actions</div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-orange-600">
                {synthese.periode.dureeHeures}h
              </div>
              <div className="text-sm text-gray-600">Durée Totale</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setMode('generation')}
              className="px-6 py-2 border rounded hover:bg-gray-100"
            >
              ← Régénérer
            </button>
            <button
              onClick={validerEtFinaliser}
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Finalisation...' : 'Valider et Finaliser'}
            </button>
          </div>
        </div>
      )}

      {/* Mode Terminé */}
      {mode === 'termine' && synthese && (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold mb-2">Document de Synthèse Finalisé !</h2>
          <p className="text-gray-600 mb-6">
            Le document a été généré et archivé avec succès.
          </p>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 text-left">
            <h3 className="font-bold mb-2">📧 Prochaines Étapes</h3>
            <ul className="text-sm space-y-1">
              <li>✓ Le document a été envoyé par email au bénéficiaire</li>
              <li>✓ Une copie a été archivée de manière sécurisée</li>
              <li>✓ Le bénéficiaire peut télécharger le PDF à tout moment</li>
              <li>✓ Vous pouvez maintenant générer l'attestation de fin de formation</li>
            </ul>
          </div>
          
          <div className="flex justify-center gap-4">
            <button
              onClick={() => router.push('/documents')}
              className="px-6 py-2 border rounded hover:bg-gray-100"
            >
              Retour aux documents
            </button>
            <button
              onClick={() => router.push(`/documents/attestation?bilanId=${bilanId}`)}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Générer l'attestation →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

