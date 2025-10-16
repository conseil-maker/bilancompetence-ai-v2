'use client';

import { useState, useEffect } from 'react';
import { useDocuments } from '@/hooks/api/useDocuments';
import { useRouter, useSearchParams } from 'next/navigation';
import { FeuilleEmargement, StatutDocument } from '@/types/documents';

export default function EmargementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const seanceId = searchParams.get('seanceId');
  
  const [loading, setLoading] = useState(false);
  const [emargement, setEmargement] = useState<FeuilleEmargement | null>(null);
  const [mode, setMode] = useState<'creation' | 'signature' | 'termine'>('creation');

  const [formData, setFormData] = useState({
    // Informations de la séance
    seance: {
      numero: 1,
      date: new Date().toISOString().split('T')[0],
      heureDebut: '09:00',
      heureFin: '11:00',
      theme: '',
      phase: 'PRELIMINAIRE' as const,
      modalite: 'Présentiel' as const,
      lieu: '',
    },
    
    // Contenu de la séance
    contenu: {
      objectifs: [''],
      activitesRealisees: [''],
      documentsRemis: [''],
      observations: '',
    },
  });

  useEffect(() => {
    if (seanceId) {
      chargerSeance(seanceId);
    }
  }, [seanceId]);

  const chargerSeance = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/seances/${id}`);
      if (!response.ok) throw new Error('Erreur lors du chargement');

      const data = await response.json();
      // Pré-remplir le formulaire avec les données de la séance
      setFormData({
        seance: {
          numero: data.numero,
          date: data.date,
          heureDebut: data.heureDebut,
          heureFin: data.heureFin,
          theme: data.theme,
          phase: data.phase,
          modalite: data.modalite,
          lieu: data.lieu || '',
        },
        contenu: {
          objectifs: data.objectifs || [''],
          activitesRealisees: [''],
          documentsRemis: [''],
          observations: '',
        },
      });
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du chargement de la séance');
    } finally {
      setLoading(false);
    }
  };

  const calculerDuree = () => {
    const [hDebut, mDebut] = formData.seance.heureDebut.split(':').map(Number);
    const [hFin, mFin] = formData.seance.heureFin.split(':').map(Number);
    const debut = hDebut * 60 + mDebut;
    const fin = hFin * 60 + mFin;
    return fin - debut;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dureeMinutes = calculerDuree();
      
      const response = await fetch('/api/documents/emargement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          seance: {
            ...formData.seance,
            dureeMinutes,
          },
        }),
      });

      if (!response.ok) throw new Error('Erreur lors de la génération');

      const data = await response.json();
      setEmargement(data.emargement);
      setMode('signature');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la génération de la feuille d\'émargement');
    } finally {
      setLoading(false);
    }
  };

  const signerArrivee = async (role: 'beneficiaire' | 'consultant') => {
    if (!emargement) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/documents/emargement/${emargement.id}/signature`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          type: 'arrivee',
        }),
      });

      if (!response.ok) throw new Error('Erreur lors de la signature');

      const data = await response.json();
      setEmargement(data.emargement);
      alert('Signature d\'arrivée enregistrée !');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la signature');
    } finally {
      setLoading(false);
    }
  };

  const signerDepart = async (role: 'beneficiaire' | 'consultant') => {
    if (!emargement) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/documents/emargement/${emargement.id}/signature`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          type: 'depart',
        }),
      });

      if (!response.ok) throw new Error('Erreur lors de la signature');

      const data = await response.json();
      setEmargement(data.emargement);
      
      // Vérifier si toutes les signatures sont complètes
      if (data.emargement.beneficiaire.signatureDepart && data.emargement.consultant.signatureDepart) {
        setMode('termine');
      } else {
        alert('Signature de départ enregistrée !');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la signature');
    } finally {
      setLoading(false);
    }
  };

  const ajouterItem = (field: 'objectifs' | 'activitesRealisees' | 'documentsRemis') => {
    setFormData({
      ...formData,
      contenu: {
        ...formData.contenu,
        [field]: [...formData.contenu[field], ''],
      },
    });
  };

  const retirerItem = (field: 'objectifs' | 'activitesRealisees' | 'documentsRemis', index: number) => {
    setFormData({
      ...formData,
      contenu: {
        ...formData.contenu,
        [field]: formData.contenu[field].filter((_, i) => i !== index),
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Feuille d'Émargement</h1>

      {/* Mode Création */}
      {mode === 'creation' && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de la séance */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Informations de la Séance</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Numéro de séance *</label>
                <input
                  type="number"
                  required
                  min="1"
                  className="w-full border rounded px-3 py-2"
                  value={formData.seance.numero}
                  onChange={(e) => setFormData({
                    ...formData,
                    seance: { ...formData.seance, numero: parseInt(e.target.value) }
                  })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Date *</label>
                <input
                  type="date"
                  required
                  className="w-full border rounded px-3 py-2"
                  value={formData.seance.date}
                  onChange={(e) => setFormData({
                    ...formData,
                    seance: { ...formData.seance, date: e.target.value }
                  })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Heure de début *</label>
                <input
                  type="time"
                  required
                  className="w-full border rounded px-3 py-2"
                  value={formData.seance.heureDebut}
                  onChange={(e) => setFormData({
                    ...formData,
                    seance: { ...formData.seance, heureDebut: e.target.value }
                  })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Heure de fin *</label>
                <input
                  type="time"
                  required
                  className="w-full border rounded px-3 py-2"
                  value={formData.seance.heureFin}
                  onChange={(e) => setFormData({
                    ...formData,
                    seance: { ...formData.seance, heureFin: e.target.value }
                  })}
                />
              </div>
              
              <div className="col-span-2">
                <p className="text-sm text-gray-600">
                  Durée calculée : <strong>{calculerDuree()} minutes</strong>
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Phase *</label>
                <select
                  required
                  className="w-full border rounded px-3 py-2"
                  value={formData.seance.phase}
                  onChange={(e) => setFormData({
                    ...formData,
                    seance: { ...formData.seance, phase: e.target.value as any }
                  })}
                >
                  <option value="PRELIMINAIRE">Phase Préliminaire</option>
                  <option value="INVESTIGATION">Phase d'Investigation</option>
                  <option value="CONCLUSION">Phase de Conclusion</option>
                  <option value="SUIVI">Suivi à 6 mois</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Modalité *</label>
                <select
                  required
                  className="w-full border rounded px-3 py-2"
                  value={formData.seance.modalite}
                  onChange={(e) => setFormData({
                    ...formData,
                    seance: { ...formData.seance, modalite: e.target.value as any }
                  })}
                >
                  <option value="Présentiel">Présentiel</option>
                  <option value="Distanciel">Distanciel</option>
                  <option value="Téléphone">Téléphone</option>
                </select>
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Thème de la séance *</label>
                <input
                  type="text"
                  required
                  className="w-full border rounded px-3 py-2"
                  value={formData.seance.theme}
                  onChange={(e) => setFormData({
                    ...formData,
                    seance: { ...formData.seance, theme: e.target.value }
                  })}
                  placeholder="Ex: Entretien préliminaire - Définition des objectifs"
                />
              </div>
              
              {formData.seance.modalite === 'Présentiel' && (
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Lieu</label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={formData.seance.lieu}
                    onChange={(e) => setFormData({
                      ...formData,
                      seance: { ...formData.seance, lieu: e.target.value }
                    })}
                    placeholder="Ex: Bureau 201, 123 Rue de la Paix, Paris"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Contenu de la séance */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Contenu de la Séance</h2>
            
            <div className="space-y-4">
              {/* Objectifs */}
              <div>
                <label className="block text-sm font-medium mb-2">Objectifs de la séance</label>
                {formData.contenu.objectifs.map((obj, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      className="flex-1 border rounded px-3 py-2"
                      value={obj}
                      onChange={(e) => {
                        const newObjectifs = [...formData.contenu.objectifs];
                        newObjectifs[index] = e.target.value;
                        setFormData({
                          ...formData,
                          contenu: { ...formData.contenu, objectifs: newObjectifs }
                        });
                      }}
                      placeholder="Ex: Analyser le parcours professionnel"
                    />
                    {formData.contenu.objectifs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => retirerItem('objectifs', index)}
                        className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => ajouterItem('objectifs')}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  + Ajouter un objectif
                </button>
              </div>

              {/* Activités réalisées */}
              <div>
                <label className="block text-sm font-medium mb-2">Activités réalisées</label>
                {formData.contenu.activitesRealisees.map((act, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      className="flex-1 border rounded px-3 py-2"
                      value={act}
                      onChange={(e) => {
                        const newActivites = [...formData.contenu.activitesRealisees];
                        newActivites[index] = e.target.value;
                        setFormData({
                          ...formData,
                          contenu: { ...formData.contenu, activitesRealisees: newActivites }
                        });
                      }}
                      placeholder="Ex: Passation du test MBTI"
                    />
                    {formData.contenu.activitesRealisees.length > 1 && (
                      <button
                        type="button"
                        onClick={() => retirerItem('activitesRealisees', index)}
                        className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => ajouterItem('activitesRealisees')}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  + Ajouter une activité
                </button>
              </div>

              {/* Documents remis */}
              <div>
                <label className="block text-sm font-medium mb-2">Documents remis</label>
                {formData.contenu.documentsRemis.map((doc, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      className="flex-1 border rounded px-3 py-2"
                      value={doc}
                      onChange={(e) => {
                        const newDocs = [...formData.contenu.documentsRemis];
                        newDocs[index] = e.target.value;
                        setFormData({
                          ...formData,
                          contenu: { ...formData.contenu, documentsRemis: newDocs }
                        });
                      }}
                      placeholder="Ex: Livret d'accueil"
                    />
                    {formData.contenu.documentsRemis.length > 1 && (
                      <button
                        type="button"
                        onClick={() => retirerItem('documentsRemis', index)}
                        className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => ajouterItem('documentsRemis')}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  + Ajouter un document
                </button>
              </div>

              {/* Observations */}
              <div>
                <label className="block text-sm font-medium mb-2">Observations (optionnel)</label>
                <textarea
                  className="w-full border rounded px-3 py-2"
                  rows={4}
                  value={formData.contenu.observations}
                  onChange={(e) => setFormData({
                    ...formData,
                    contenu: { ...formData.contenu, observations: e.target.value }
                  })}
                  placeholder="Remarques particulières sur la séance..."
                />
              </div>
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
              {loading ? 'Génération...' : 'Créer la feuille d\'émargement'}
            </button>
          </div>
        </form>
      )}

      {/* Mode Signature */}
      {mode === 'signature' && emargement && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Signatures</h2>
            
            <div className="grid grid-cols-2 gap-6">
              {/* Bénéficiaire */}
              <div className="border rounded p-4">
                <h3 className="font-bold mb-3">Bénéficiaire</h3>
                <p className="text-sm mb-4">{emargement.beneficiaire.prenom} {emargement.beneficiaire.nom}</p>
                
                <div className="space-y-2">
                  <button
                    onClick={() => signerArrivee('beneficiaire')}
                    disabled={!!emargement.beneficiaire.signatureArrivee}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {emargement.beneficiaire.signatureArrivee ? '✓ Arrivée signée' : 'Signer l\'arrivée'}
                  </button>
                  
                  <button
                    onClick={() => signerDepart('beneficiaire')}
                    disabled={!emargement.beneficiaire.signatureArrivee || !!emargement.beneficiaire.signatureDepart}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {emargement.beneficiaire.signatureDepart ? '✓ Départ signé' : 'Signer le départ'}
                  </button>
                </div>
              </div>

              {/* Consultant */}
              <div className="border rounded p-4">
                <h3 className="font-bold mb-3">Consultant</h3>
                <p className="text-sm mb-4">{emargement.consultant.prenom} {emargement.consultant.nom}</p>
                
                <div className="space-y-2">
                  <button
                    onClick={() => signerArrivee('consultant')}
                    disabled={!!emargement.consultant.signatureArrivee}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {emargement.consultant.signatureArrivee ? '✓ Arrivée signée' : 'Signer l\'arrivée'}
                  </button>
                  
                  <button
                    onClick={() => signerDepart('consultant')}
                    disabled={!emargement.consultant.signatureArrivee || !!emargement.consultant.signatureDepart}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {emargement.consultant.signatureDepart ? '✓ Départ signé' : 'Signer le départ'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Aperçu */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Aperçu de la Feuille d'Émargement</h2>
            <iframe
              src={`/api/documents/emargement/${emargement.id}/preview`}
              className="w-full h-[600px] border rounded"
            />
          </div>
        </div>
      )}

      {/* Mode Terminé */}
      {mode === 'termine' && (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold mb-2">Feuille d'émargement complète !</h2>
          <p className="text-gray-600 mb-6">
            Toutes les signatures ont été enregistrées.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => router.push('/documents')}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retour aux documents
            </button>
            <button
              onClick={() => window.open(`/api/documents/emargement/${emargement?.id}/download`, '_blank')}
              className="px-6 py-2 border rounded hover:bg-gray-100"
            >
              Télécharger le PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

