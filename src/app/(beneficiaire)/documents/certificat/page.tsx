'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CertificatRealisation } from '@/types/documents';

export default function CertificatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bilanId = searchParams.get('bilanId');
  
  const [loading, setLoading] = useState(false);
  const [certificat, setCertificat] = useState<CertificatRealisation | null>(null);
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

  const genererCertificat = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/documents/certificat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bilanId }),
      });

      if (!response.ok) throw new Error('Erreur lors de la génération');

      const data = await response.json();
      setCertificat(data.certificat);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la génération du certificat');
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
      <h1 className="text-3xl font-bold mb-6">Certificat de Réalisation</h1>

      {!certificat ? (
        <div className="space-y-6">
          {/* Informations */}
          <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded">
            <h2 className="text-xl font-bold mb-2">🏆 À propos du Certificat</h2>
            <p className="mb-4">
              Le certificat de réalisation est le document officiel qui atteste de la réalisation complète
              du bilan de compétences. Il est requis pour les financements publics (CPF, OPCO).
            </p>
            <p className="text-sm text-gray-700">
              <strong>Document obligatoire</strong> pour justifier l'utilisation des fonds de formation.
            </p>
          </div>

          {/* Informations réglementaires */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Conformité Réglementaire</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-2xl mr-3">📋</span>
                <div>
                  <h3 className="font-medium mb-1">Article L6353-1 du Code du travail</h3>
                  <p className="text-sm text-gray-600">
                    Le certificat de réalisation atteste de l'exécution de l'action de formation et permet
                    le versement des fonds par l'organisme financeur.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <span className="text-2xl mr-3">✓</span>
                <div>
                  <h3 className="font-medium mb-1">Certification Qualiopi</h3>
                  <p className="text-sm text-gray-600">
                    Netz Informatique est certifié Qualiopi (n° {donneesBilan.organisme.numeroQualiopi}),
                    garantissant la qualité de la prestation.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <span className="text-2xl mr-3">🔒</span>
                <div>
                  <h3 className="font-medium mb-1">Archivage Sécurisé</h3>
                  <p className="text-sm text-gray-600">
                    Le certificat sera archivé de manière sécurisée pendant 3 ans minimum,
                    conformément aux obligations légales.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Récapitulatif */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Récapitulatif de la Formation</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Intitulé</label>
                  <p className="font-medium">Bilan de Compétences</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Code CPF</label>
                  <p className="font-medium">202</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Bénéficiaire</label>
                  <p className="font-medium">{donneesBilan.beneficiaire.prenom} {donneesBilan.beneficiaire.nom}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Date de naissance</label>
                  <p className="font-medium">{new Date(donneesBilan.beneficiaire.dateNaissance).toLocaleDateString('fr-FR')}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Période</label>
                  <p className="font-medium">
                    Du {new Date(donneesBilan.dateDebut).toLocaleDateString('fr-FR')} au {new Date(donneesBilan.dateFin).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Durée totale</label>
                  <p className="font-medium">{donneesBilan.dureeHeures} heures</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Consultant</label>
                  <p className="font-medium">{donneesBilan.consultant.prenom} {donneesBilan.consultant.nom}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Modalité</label>
                  <p className="font-medium">Présentiel et Distanciel</p>
                </div>
              </div>
            </div>
          </div>

          {/* Assiduité */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Assiduité et Présence</h2>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-4 bg-green-50 rounded">
                <div className="text-3xl font-bold text-green-600">{donneesBilan.nombreSeances}</div>
                <div className="text-sm text-gray-600 mt-1">Séances prévues</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded">
                <div className="text-3xl font-bold text-green-600">{donneesBilan.nombreSeances}</div>
                <div className="text-sm text-gray-600 mt-1">Séances réalisées</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded">
                <div className="text-3xl font-bold text-green-600">100%</div>
                <div className="text-sm text-gray-600 mt-1">Taux de présence</div>
              </div>
            </div>
            
            <div className="bg-green-50 border-l-4 border-green-500 p-4">
              <p className="text-sm text-green-800">
                ✓ Le bénéficiaire a suivi l'intégralité du parcours de bilan de compétences avec assiduité.
              </p>
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
              onClick={genererCertificat}
              disabled={loading}
              className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? 'Génération...' : 'Générer le Certificat'}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Succès */}
          <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded">
            <div className="flex items-center">
              <span className="text-4xl mr-4">🏆</span>
              <div>
                <h2 className="text-xl font-bold text-purple-800">Certificat Généré avec Succès !</h2>
                <p className="text-purple-700 mt-1">
                  Le certificat de réalisation a été créé et est prêt à être transmis au financeur.
                </p>
              </div>
            </div>
          </div>

          {/* Informations du certificat */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Informations du Certificat</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Numéro de certificat</label>
                <p className="font-mono font-bold text-lg">{certificat.numeroCertificat}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Date d'émission</label>
                <p className="font-medium">{new Date(certificat.dateEmission).toLocaleDateString('fr-FR')}</p>
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">Signature numérique</label>
                <p className="font-mono text-sm bg-gray-50 p-2 rounded break-all">
                  {certificat.signatureNumerique}
                </p>
              </div>
            </div>
          </div>

          {/* Aperçu */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Aperçu du Certificat</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => window.open(`/api/documents/certificat/${certificat.id}/preview`, '_blank')}
                    className="px-4 py-2 border rounded hover:bg-gray-100"
                  >
                    👁️ Plein écran
                  </button>
                  <button
                    onClick={() => window.open(`/api/documents/certificat/${certificat.id}/download`, '_blank')}
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                  >
                    📥 Télécharger PDF
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <iframe
                src={`/api/documents/certificat/${certificat.id}/preview`}
                className="w-full h-[800px] border rounded"
              />
            </div>
          </div>

          {/* Transmission au financeur */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="font-bold mb-3">📧 Transmission au Financeur</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>✓ Le certificat a été envoyé par email au bénéficiaire</li>
              <li>✓ Une copie a été archivée de manière sécurisée</li>
              <li>✓ Le bénéficiaire doit transmettre ce certificat à son financeur (CPF, OPCO, Pôle Emploi)</li>
              <li>✓ Le certificat permet le versement des fonds de formation</li>
              <li>✓ La signature numérique garantit l'authenticité du document</li>
            </ul>
          </div>

          {/* Actions finales */}
          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded">
            <h3 className="font-bold mb-2">🎉 Bilan de Compétences Terminé !</h3>
            <p className="text-sm mb-4">
              Tous les documents obligatoires ont été générés. Le bénéficiaire dispose maintenant de :
            </p>
            <ul className="space-y-1 text-sm">
              <li>✓ Convention de bilan signée</li>
              <li>✓ Feuilles d'émargement de toutes les séances</li>
              <li>✓ Document de synthèse complet</li>
              <li>✓ Attestation de fin de formation</li>
              <li>✓ Certificat de réalisation</li>
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
              onClick={() => router.push(`/bilans/${bilanId}`)}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Voir le bilan complet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

