'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Convention, StatutDocument } from '@/types/documents';

export default function ConventionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [convention, setConvention] = useState<Convention | null>(null);
  const [etape, setEtape] = useState<'formulaire' | 'apercu' | 'signature'>('formulaire');

  const [formData, setFormData] = useState({
    // Bénéficiaire
    beneficiaire: {
      nom: '',
      prenom: '',
      adresse: {
        rue: '',
        codePostal: '',
        ville: '',
        pays: 'France',
      },
      email: '',
      telephone: '',
    },
    
    // Entreprise (optionnel)
    avecEntreprise: false,
    entreprise: {
      raisonSociale: '',
      siret: '',
      adresse: {
        rue: '',
        codePostal: '',
        ville: '',
        pays: 'France',
      },
      email: '',
      telephone: '',
      representantLegal: {
        nom: '',
        prenom: '',
        fonction: '',
      },
    },
    
    // Informations du bilan
    titre: 'Bilan de compétences',
    objectifs: [''],
    dureeHeures: 24,
    dateDebut: '',
    dateFinPrevue: '',
    
    // Modalités
    modalites: {
      lieu: '',
      horaires: 'Sur rendez-vous',
      distanciel: true,
      presentiel: true,
      mixte: true,
    },
    
    // Tarification
    tarif: {
      montantTotal: 1800,
      montantPrisEnCharge: 0,
      montantRestant: 1800,
      financeur: 'Personnel' as const,
      detailsFinancement: '',
    },
    
    // Mentions légales
    accepteRGPD: false,
    accepteDroitRetractation: false,
    accepteConfidentialite: false,
    accepteProprieteSynthese: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Générer la convention
      const response = await fetch('/api/documents/convention', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Erreur lors de la génération');

      const data = await response.json();
      setConvention(data.convention);
      setEtape('apercu');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la génération de la convention');
    } finally {
      setLoading(false);
    }
  };

  const envoyerPourSignature = async () => {
    if (!convention) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/documents/convention/${convention.id}/signature`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Erreur lors de l\'envoi');

      setEtape('signature');
      alert('Convention envoyée pour signature électronique !');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'envoi pour signature');
    } finally {
      setLoading(false);
    }
  };

  const ajouterObjectif = () => {
    setFormData({
      ...formData,
      objectifs: [...formData.objectifs, ''],
    });
  };

  const retirerObjectif = (index: number) => {
    setFormData({
      ...formData,
      objectifs: formData.objectifs.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Convention de Bilan de Compétences</h1>

      {/* Étapes */}
      <div className="flex items-center justify-between mb-8">
        <div className={`flex items-center ${etape === 'formulaire' ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>
          <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2">1</div>
          <span>Formulaire</span>
        </div>
        <div className="flex-1 h-1 bg-gray-300 mx-4"></div>
        <div className={`flex items-center ${etape === 'apercu' ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>
          <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2">2</div>
          <span>Aperçu</span>
        </div>
        <div className="flex-1 h-1 bg-gray-300 mx-4"></div>
        <div className={`flex items-center ${etape === 'signature' ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>
          <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2">3</div>
          <span>Signature</span>
        </div>
      </div>

      {/* Formulaire */}
      {etape === 'formulaire' && (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Bénéficiaire */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Informations du Bénéficiaire</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nom *</label>
                <input
                  type="text"
                  required
                  className="w-full border rounded px-3 py-2"
                  value={formData.beneficiaire.nom}
                  onChange={(e) => setFormData({
                    ...formData,
                    beneficiaire: { ...formData.beneficiaire, nom: e.target.value }
                  })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Prénom *</label>
                <input
                  type="text"
                  required
                  className="w-full border rounded px-3 py-2"
                  value={formData.beneficiaire.prenom}
                  onChange={(e) => setFormData({
                    ...formData,
                    beneficiaire: { ...formData.beneficiaire, prenom: e.target.value }
                  })}
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Adresse *</label>
                <input
                  type="text"
                  required
                  className="w-full border rounded px-3 py-2"
                  value={formData.beneficiaire.adresse.rue}
                  onChange={(e) => setFormData({
                    ...formData,
                    beneficiaire: {
                      ...formData.beneficiaire,
                      adresse: { ...formData.beneficiaire.adresse, rue: e.target.value }
                    }
                  })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Code Postal *</label>
                <input
                  type="text"
                  required
                  className="w-full border rounded px-3 py-2"
                  value={formData.beneficiaire.adresse.codePostal}
                  onChange={(e) => setFormData({
                    ...formData,
                    beneficiaire: {
                      ...formData.beneficiaire,
                      adresse: { ...formData.beneficiaire.adresse, codePostal: e.target.value }
                    }
                  })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Ville *</label>
                <input
                  type="text"
                  required
                  className="w-full border rounded px-3 py-2"
                  value={formData.beneficiaire.adresse.ville}
                  onChange={(e) => setFormData({
                    ...formData,
                    beneficiaire: {
                      ...formData.beneficiaire,
                      adresse: { ...formData.beneficiaire.adresse, ville: e.target.value }
                    }
                  })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  required
                  className="w-full border rounded px-3 py-2"
                  value={formData.beneficiaire.email}
                  onChange={(e) => setFormData({
                    ...formData,
                    beneficiaire: { ...formData.beneficiaire, email: e.target.value }
                  })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Téléphone *</label>
                <input
                  type="tel"
                  required
                  className="w-full border rounded px-3 py-2"
                  value={formData.beneficiaire.telephone}
                  onChange={(e) => setFormData({
                    ...formData,
                    beneficiaire: { ...formData.beneficiaire, telephone: e.target.value }
                  })}
                />
              </div>
            </div>
          </div>

          {/* Informations du Bilan */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Informations du Bilan</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Objectifs du bilan</label>
                {formData.objectifs.map((obj, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      className="flex-1 border rounded px-3 py-2"
                      value={obj}
                      onChange={(e) => {
                        const newObjectifs = [...formData.objectifs];
                        newObjectifs[index] = e.target.value;
                        setFormData({ ...formData, objectifs: newObjectifs });
                      }}
                      placeholder="Ex: Identifier mes compétences transférables"
                    />
                    {formData.objectifs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => retirerObjectif(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={ajouterObjectif}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  + Ajouter un objectif
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Durée (heures) *</label>
                  <input
                    type="number"
                    required
                    min="12"
                    max="40"
                    className="w-full border rounded px-3 py-2"
                    value={formData.dureeHeures}
                    onChange={(e) => setFormData({ ...formData, dureeHeures: parseInt(e.target.value) })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Date de début *</label>
                  <input
                    type="date"
                    required
                    className="w-full border rounded px-3 py-2"
                    value={formData.dateDebut}
                    onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Date de fin prévue *</label>
                  <input
                    type="date"
                    required
                    className="w-full border rounded px-3 py-2"
                    value={formData.dateFinPrevue}
                    onChange={(e) => setFormData({ ...formData, dateFinPrevue: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tarification */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Tarification</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Montant total *</label>
                <input
                  type="number"
                  required
                  className="w-full border rounded px-3 py-2"
                  value={formData.tarif.montantTotal}
                  onChange={(e) => setFormData({
                    ...formData,
                    tarif: { ...formData.tarif, montantTotal: parseFloat(e.target.value) }
                  })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Financeur</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={formData.tarif.financeur}
                  onChange={(e) => setFormData({
                    ...formData,
                    tarif: { ...formData.tarif, financeur: e.target.value as any }
                  })}
                >
                  <option value="CPF">CPF</option>
                  <option value="OPCO">OPCO</option>
                  <option value="Entreprise">Entreprise</option>
                  <option value="Personnel">Personnel</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Montant pris en charge</label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2"
                  value={formData.tarif.montantPrisEnCharge}
                  onChange={(e) => {
                    const montantPrisEnCharge = parseFloat(e.target.value) || 0;
                    setFormData({
                      ...formData,
                      tarif: {
                        ...formData.tarif,
                        montantPrisEnCharge,
                        montantRestant: formData.tarif.montantTotal - montantPrisEnCharge,
                      }
                    });
                  }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Reste à charge</label>
                <input
                  type="number"
                  disabled
                  className="w-full border rounded px-3 py-2 bg-gray-100"
                  value={formData.tarif.montantRestant}
                />
              </div>
            </div>
          </div>

          {/* Mentions légales */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Mentions Légales</h2>
            
            <div className="space-y-3">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  required
                  className="mt-1 mr-2"
                  checked={formData.accepteRGPD}
                  onChange={(e) => setFormData({ ...formData, accepteRGPD: e.target.checked })}
                />
                <span className="text-sm">
                  J'accepte que mes données personnelles soient traitées conformément au RGPD *
                </span>
              </label>
              
              <label className="flex items-start">
                <input
                  type="checkbox"
                  required
                  className="mt-1 mr-2"
                  checked={formData.accepteDroitRetractation}
                  onChange={(e) => setFormData({ ...formData, accepteDroitRetractation: e.target.checked })}
                />
                <span className="text-sm">
                  Je reconnais disposer d'un droit de rétractation de 14 jours *
                </span>
              </label>
              
              <label className="flex items-start">
                <input
                  type="checkbox"
                  required
                  className="mt-1 mr-2"
                  checked={formData.accepteConfidentialite}
                  onChange={(e) => setFormData({ ...formData, accepteConfidentialite: e.target.checked })}
                />
                <span className="text-sm">
                  Je comprends que les échanges sont confidentiels *
                </span>
              </label>
              
              <label className="flex items-start">
                <input
                  type="checkbox"
                  required
                  className="mt-1 mr-2"
                  checked={formData.accepteProprieteSynthese}
                  onChange={(e) => setFormData({ ...formData, accepteProprieteSynthese: e.target.checked })}
                />
                <span className="text-sm">
                  Je comprends que la synthèse du bilan m'appartient *
                </span>
              </label>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border rounded hover:bg-gray-100"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Génération...' : 'Générer la convention'}
            </button>
          </div>
        </form>
      )}

      {/* Aperçu */}
      {etape === 'apercu' && convention && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Aperçu de la Convention</h2>
            <iframe
              src={`/api/documents/convention/${convention.id}/preview`}
              className="w-full h-[600px] border rounded"
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={() => setEtape('formulaire')}
              className="px-6 py-2 border rounded hover:bg-gray-100"
            >
              Modifier
            </button>
            <button
              onClick={envoyerPourSignature}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Envoi...' : 'Envoyer pour signature'}
            </button>
          </div>
        </div>
      )}

      {/* Signature */}
      {etape === 'signature' && (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold mb-2">Convention envoyée !</h2>
          <p className="text-gray-600 mb-6">
            Un email a été envoyé au bénéficiaire pour signature électronique.
          </p>
          <button
            onClick={() => router.push('/documents')}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retour aux documents
          </button>
        </div>
      )}
    </div>
  );
}

