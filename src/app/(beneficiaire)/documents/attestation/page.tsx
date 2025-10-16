'use client';

import { useState, useEffect } from 'react';
import { useDocuments } from '@/hooks/api/useDocuments';
import { useRouter, useSearchParams } from 'next/navigation';
import { AttestationFinFormation } from '@/types/documents';

export default function AttestationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bilanId = searchParams.get('bilanId');
  
  const [loading, setLoading] = useState(false);
  const [attestation, setAttestation] = useState<AttestationFinFormation | null>(null);
  const [donneesBilan, setDonneesBilan] = useState<any>(null);

  useEffect(() => {
    if (bilanId) {
      chargerDonneesBilan(bilanId);
    }
  }, [bilanId]);

  const chargerDonneesBilan = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/bilans/${id}`);
      if (!response.ok) throw new Error('Erreur lors du chargement');

      const data = await response.json();
      setDonneesBilan(data);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du chargement des données du bilan');
    } finally {
      setLoading(false);
    }
  };

  const genererAttestation = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/documents/attestation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bilanId }),
      });

      if (!response.ok) throw new Error('Erreur lors de la génération');

      const data = await response.json();
      setAttestation(data.attestation);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la génération de l\'attestation');
    } finally {
      setLoading(false);
    }
  };

  if (!donneesBilan) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Chargement des données du bilan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Attestation de Fin de Formation</h1>

      {!attestation ? (
        <div className="space-y-6">
          {/* Informations */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
            <h2 className="text-xl font-bold mb-2">📜 À propos de l'Attestation</h2>
            <p className="mb-4">
              L'attestation de fin de formation certifie que le bénéficiaire a suivi et terminé
              l'intégralité du parcours de bilan de compétences.
            </p>
            <p className="text-sm text-gray-700">
              <strong>Document obligatoire</strong> pour les financements CPF, OPCO et Pôle Emploi.
            </p>
          </div>

          {/* Récapitulatif du bilan */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Récapitulatif du Bilan</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Bénéficiaire</label>
                <p className="font-medium">{donneesBilan.beneficiaire.prenom} {donneesBilan.beneficiaire.nom}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Consultant</label>
                <p className="font-medium">{donneesBilan.consultant.prenom} {donneesBilan.consultant.nom}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Date de début</label>
                <p className="font-medium">{new Date(donneesBilan.dateDebut).toLocaleDateString('fr-FR')}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Date de fin</label>
                <p className="font-medium">{new Date(donneesBilan.dateFin).toLocaleDateString('fr-FR')}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Durée totale</label>
                <p className="font-medium">{donneesBilan.dureeHeures} heures</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Nombre de séances</label>
                <p className="font-medium">{donneesBilan.nombreSeances} séances</p>
              </div>
            </div>
          </div>

          {/* Phases réalisées */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Phases Réalisées</h2>
            
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-green-50 rounded">
                <span className="text-2xl mr-3">✓</span>
                <div className="flex-1">
                  <div className="font-medium">Phase Préliminaire</div>
                  <div className="text-sm text-gray-600">Entretien initial et définition des objectifs</div>
                </div>
                <div className="text-sm font-medium text-green-600">
                  {donneesBilan.phasePreliminaire.dureeHeures}h
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-green-50 rounded">
                <span className="text-2xl mr-3">✓</span>
                <div className="flex-1">
                  <div className="font-medium">Phase d'Investigation</div>
                  <div className="text-sm text-gray-600">Tests, analyses et exploration des pistes</div>
                </div>
                <div className="text-sm font-medium text-green-600">
                  {donneesBilan.phaseInvestigation.dureeHeures}h
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-green-50 rounded">
                <span className="text-2xl mr-3">✓</span>
                <div className="flex-1">
                  <div className="font-medium">Phase de Conclusion</div>
                  <div className="text-sm text-gray-600">Synthèse et élaboration du projet professionnel</div>
                </div>
                <div className="text-sm font-medium text-green-600">
                  {donneesBilan.phaseConclusion.dureeHeures}h
                </div>
              </div>
            </div>
          </div>

          {/* Compétences et objectifs */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Résultats du Bilan</h2>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded">
                <div className="text-3xl font-bold text-blue-600">
                  {donneesBilan.competencesIdentifiees?.length || 0}
                </div>
                <div className="text-sm text-gray-600 mt-1">Compétences identifiées</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded">
                <div className="text-3xl font-bold text-purple-600">
                  {donneesBilan.pistesMetiers?.length || 0}
                </div>
                <div className="text-sm text-gray-600 mt-1">Pistes métiers explorées</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded">
                <div className="text-3xl font-bold text-green-600">
                  {donneesBilan.actionsPreconisees?.length || 0}
                </div>
                <div className="text-sm text-gray-600 mt-1">Actions préconisées</div>
              </div>
            </div>
          </div>

          {/* Bouton de génération */}
          <div className="flex justify-end gap-4">
            <button
              onClick={() => router.back()}
              className="px-6 py-2 border rounded hover:bg-gray-100"
            >
              Annuler
            </button>
            <button
              onClick={genererAttestation}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Génération...' : 'Générer l\'Attestation'}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Succès */}
          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded">
            <div className="flex items-center">
              <span className="text-4xl mr-4">✅</span>
              <div>
                <h2 className="text-xl font-bold text-green-800">Attestation Générée avec Succès !</h2>
                <p className="text-green-700 mt-1">
                  L'attestation de fin de formation a été créée et est prête à être téléchargée.
                </p>
              </div>
            </div>
          </div>

          {/* Aperçu */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Aperçu de l'Attestation</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => window.open(`/api/documents/attestation/${attestation.id}/preview`, '_blank')}
                    className="px-4 py-2 border rounded hover:bg-gray-100"
                  >
                    👁️ Plein écran
                  </button>
                  <button
                    onClick={() => window.open(`/api/documents/attestation/${attestation.id}/download`, '_blank')}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    📥 Télécharger PDF
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <iframe
                src={`/api/documents/attestation/${attestation.id}/preview`}
                className="w-full h-[800px] border rounded"
              />
            </div>
          </div>

          {/* Informations */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-bold mb-3">ℹ️ Informations Importantes</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>✓ L'attestation a été envoyée par email au bénéficiaire</li>
              <li>✓ Une copie a été archivée de manière sécurisée</li>
              <li>✓ Le numéro d'attestation est : <strong>{attestation.numeroAttestation}</strong></li>
              <li>✓ L'attestation est valable pour les financements CPF, OPCO et Pôle Emploi</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <button
              onClick={() => router.push('/documents')}
              className="px-6 py-2 border rounded hover:bg-gray-100"
            >
              Retour aux documents
            </button>
            <button
              onClick={() => router.push(`/documents/certificat?bilanId=${bilanId}`)}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Générer le certificat →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

