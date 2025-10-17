'use client';

import { useEffect, useState } from 'react';
import { useAuthContext as useAuth } from '@/components/providers/AuthProvider';
import { profiles } from '@/lib/supabase/modules';
import { Profile } from '@/types/database.types';

export default function ProfilBénéficiairePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    date_naissance: '',
    adresse: '',
    ville: '',
    code_postal: '',
    situation_professionnelle: '',
    niveau_etudes: '',
    objectifs: '',
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      if (!user) return;
      const data = await profiles.getProfile(user.id);
      if (data) {
        setProfile(data);
        setFormData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          phone: data.phone || '',
          date_naissance: data.date_naissance || '',
          adresse: data.adresse || '',
          ville: data.ville || '',
          code_postal: data.code_postal || '',
          situation_professionnelle: data.situation_professionnelle || '',
          niveau_etudes: data.niveau_etudes || '',
          objectifs: data.objectifs || '',
        });
      }
    } catch (error) {
      console.error('Erreur chargement profil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await profiles.updateProfile(user.id, formData);
      setEditing(false);
      loadProfile();
      alert('Profil mis à jour avec succès !');
    } catch (error) {
      console.error('Erreur mise à jour profil:', error);
      alert('Erreur lors de la mise à jour du profil');
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            ✏️ Modifier
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {!editing ? (
          // Mode Affichage
          <div className="space-y-6">
            {/* Informations personnelles */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
                Informations personnelles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Prénom</label>
                  <p className="text-gray-900">{profile?.first_name || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Nom</label>
                  <p className="text-gray-900">{profile?.last_name || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{user?.email || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Téléphone</label>
                  <p className="text-gray-900">{profile?.phone || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date de naissance</label>
                  <p className="text-gray-900">
                    {profile?.date_naissance
                      ? new Date(profile.date_naissance).toLocaleDateString('fr-FR')
                      : '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* Adresse */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
                Adresse
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500">Adresse</label>
                  <p className="text-gray-900">{profile?.adresse || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Ville</label>
                  <p className="text-gray-900">{profile?.ville || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Code postal</label>
                  <p className="text-gray-900">{profile?.code_postal || '-'}</p>
                </div>
              </div>
            </div>

            {/* Situation professionnelle */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
                Situation professionnelle
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Situation actuelle</label>
                  <p className="text-gray-900">{profile?.situation_professionnelle || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Niveau d'études</label>
                  <p className="text-gray-900">{profile?.niveau_etudes || '-'}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500">Objectifs</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{profile?.objectifs || '-'}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Mode Édition
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations personnelles */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
                Informations personnelles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom *
                  </label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de naissance
                  </label>
                  <input
                    type="date"
                    value={formData.date_naissance}
                    onChange={(e) => setFormData({ ...formData, date_naissance: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Adresse */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
                Adresse
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse
                  </label>
                  <input
                    type="text"
                    value={formData.adresse}
                    onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ville
                  </label>
                  <input
                    type="text"
                    value={formData.ville}
                    onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Code postal
                  </label>
                  <input
                    type="text"
                    value={formData.code_postal}
                    onChange={(e) => setFormData({ ...formData, code_postal: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Situation professionnelle */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
                Situation professionnelle
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Situation actuelle
                  </label>
                  <select
                    value={formData.situation_professionnelle}
                    onChange={(e) => setFormData({ ...formData, situation_professionnelle: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner...</option>
                    <option value="emploi">En emploi</option>
                    <option value="recherche">En recherche d'emploi</option>
                    <option value="formation">En formation</option>
                    <option value="reconversion">En reconversion</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Niveau d'études
                  </label>
                  <select
                    value={formData.niveau_etudes}
                    onChange={(e) => setFormData({ ...formData, niveau_etudes: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner...</option>
                    <option value="cap_bep">CAP/BEP</option>
                    <option value="bac">Baccalauréat</option>
                    <option value="bac_2">Bac+2</option>
                    <option value="bac_3">Bac+3</option>
                    <option value="bac_5">Bac+5 et plus</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Objectifs
                  </label>
                  <textarea
                    value={formData.objectifs}
                    onChange={(e) => setFormData({ ...formData, objectifs: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Décrivez vos objectifs professionnels..."
                  />
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-3 justify-end pt-4 border-t">
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  loadProfile();
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Enregistrer
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

