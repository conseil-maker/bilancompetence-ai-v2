'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { getConsultantProfile, updateConsultantProfile } from '@/lib/supabase/modules';
import { ConsultantProfile, Specialty, Availability, Experience } from '@/lib/types'; // Assumer l'existence de ces types

// Composants fictifs pour l'exemple (à remplacer par les composants existants du projet)
const Button = ({ children, onClick, disabled, className, variant = 'primary', type = 'button' }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
      variant === 'primary' ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
  >
    {children}
  </button>
);

const Input = ({ label, id, type = 'text', value, onChange, disabled = false, className = '' }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 ${className}`}
    />
  </div>
);

const Textarea = ({ label, id, value, onChange, disabled = false, className = '' }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <textarea
      id={id}
      rows={3}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 ${className}`}
    />
  </div>
);

const Card = ({ title, children, className = '' }) => (
  <div className={`bg-white shadow-lg rounded-xl p-6 ${className}`}>
    <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">{title}</h2>
    {children}
  </div>
);

// --- Définition des types (pour l'autonomie du code) ---
// Dans un vrai projet, ces types seraient importés de '@/lib/types'
type ConsultantProfile = {
  id: string;
  user_id: string;
  full_name: string;
  bio: string;
  hourly_rate: number;
  specialties: Specialty[];
  availabilities: Availability[];
  experience: Experience[];
};

type Specialty = {
  id: string;
  name: string;
};

type Availability = {
  id: string;
  day: 'Lundi' | 'Mardi' | 'Mercredi' | 'Jeudi' | 'Vendredi' | 'Samedi' | 'Dimanche';
  start_time: string;
  end_time: string;
};

type Experience = {
  id: string;
  title: string;
  company: string;
  start_date: string;
  end_date: string | null;
  description: string;
};

// --- Composants de section spécifiques ---

const ProfileDisplay = ({ profile, onEdit }) => (
  <Card title="Mon Profil Consultant">
    <div className="space-y-4">
      <p>
        <strong className="font-medium text-gray-700">Nom Complet:</strong> {profile.full_name}
      </p>
      <p>
        <strong className="font-medium text-gray-700">Bio:</strong> {profile.bio || 'Non renseignée'}
      </p>
      <p>
        <strong className="font-medium text-gray-700">Taux Horaire:</strong> {profile.hourly_rate ? `${profile.hourly_rate} €` : 'Non renseigné'}
      </p>

      <h3 className="text-lg font-semibold mt-6 mb-2">Spécialités</h3>
      <div className="flex flex-wrap gap-2">
        {profile.specialties.length > 0 ? (
          profile.specialties.map((s) => (
            <span key={s.id} className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full">
              {s.name}
            </span>
          ))
        ) : (
          <p className="text-gray-500">Aucune spécialité ajoutée.</p>
        )}
      </div>

      <h3 className="text-lg font-semibold mt-6 mb-2">Disponibilités</h3>
      <div className="space-y-2">
        {profile.availabilities.length > 0 ? (
          profile.availabilities.map((a) => (
            <p key={a.id} className="text-sm text-gray-600">
              {a.day}: {a.start_time} - {a.end_time}
            </p>
          ))
        ) : (
          <p className="text-gray-500">Aucune disponibilité ajoutée.</p>
        )}
      </div>

      <h3 className="text-lg font-semibold mt-6 mb-2">Expérience Professionnelle</h3>
      <div className="space-y-4">
        {profile.experience.length > 0 ? (
          profile.experience.map((e) => (
            <div key={e.id} className="border-l-4 border-indigo-500 pl-4">
              <p className="font-medium text-gray-800">{e.title} chez {e.company}</p>
              <p className="text-sm text-gray-500">
                {e.start_date} - {e.end_date || 'Présent'}
              </p>
              <p className="text-sm mt-1">{e.description}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Aucune expérience ajoutée.</p>
        )}
      </div>
    </div>
    <div className="mt-6 flex justify-end">
      <Button onClick={onEdit}>Modifier le Profil</Button>
    </div>
  </Card>
);

const ProfileEdit = ({ profile, onSave, onCancel, isSaving }) => {
  const [formData, setFormData] = useState(profile);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Logique simplifiée pour l'édition des listes (spécialités, disponibilités, expérience)
  // Dans un vrai scénario, il faudrait des composants dédiés pour gérer l'ajout/suppression/modification des éléments de liste.
  // Ici, on se concentre sur les champs principaux pour l'exemple.

  const handleSave = (e) => {
    e.preventDefault();
    // Ici, on pourrait ajouter une validation
    onSave(formData);
  };

  return (
    <Card title="Modifier Mon Profil Consultant">
      <form onSubmit={handleSave}>
        <Input
          label="Nom Complet"
          id="full_name"
          value={formData.full_name}
          onChange={handleChange}
          disabled={isSaving}
        />
        <Textarea
          label="Biographie"
          id="bio"
          value={formData.bio}
          onChange={handleChange}
          disabled={isSaving}
        />
        <Input
          label="Taux Horaire (€)"
          id="hourly_rate"
          type="number"
          value={formData.hourly_rate}
          onChange={handleChange}
          disabled={isSaving}
        />

        {/* Placeholder pour l'édition des listes complexes */}
        <div className="mb-4 p-4 border rounded-md bg-yellow-50">
          <p className="text-sm font-medium text-yellow-800">
            Note: L'édition des Spécialités, Disponibilités et Expérience nécessite des composants d'édition de liste dédiés qui ne sont pas inclus dans cet exemple.
            Les données affichées ci-dessous sont celles du profil initial.
          </p>
          <pre className="text-xs mt-2 overflow-auto max-h-32">
            {JSON.stringify({ specialties: formData.specialties, availabilities: formData.availabilities, experience: formData.experience }, null, 2)}
          </pre>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <Button type="button" variant="secondary" onClick={onCancel} disabled={isSaving}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Sauvegarde en cours...' : 'Enregistrer les modifications'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

// --- Composant principal de la page ---

const initialProfileState: ConsultantProfile = {
  id: '',
  user_id: '',
  full_name: '',
  bio: '',
  hourly_rate: 0,
  specialties: [],
  availabilities: [],
  experience: [],
};

export default function MonProfilConsultantPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [profile, setProfile] = useState<ConsultantProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchProfile = useCallback(async (userId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Assumer que getConsultantProfile(userId) retourne ConsultantProfile | null
      const data = await getConsultantProfile(userId);
      setProfile(data || initialProfileState);
    } catch (err) {
      console.error('Erreur lors du chargement du profil:', err);
      setError('Impossible de charger le profil. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthLoading && user) {
      fetchProfile(user.id);
    } else if (!isAuthLoading && !user) {
      // Redirection ou affichage d'un message si l'utilisateur n'est pas connecté
      setError('Vous devez être connecté pour accéder à cette page.');
      setIsLoading(false);
    }
  }, [user, isAuthLoading, fetchProfile]);

  const handleSaveProfile = async (updatedProfile: ConsultantProfile) => {
    if (!user || !profile) return;

    setIsSaving(true);
    setError(null);
    try {
      // Assumer que updateConsultantProfile(profileId, data) met à jour et retourne le profil mis à jour
      const updatedData = await updateConsultantProfile(profile.id, updatedProfile);
      setProfile(updatedData);
      setIsEditing(false);
    } catch (err) {
      console.error('Erreur lors de la sauvegarde du profil:', err);
      setError('Impossible de sauvegarder les modifications. Veuillez réessayer.');
    } finally {
      setIsSaving(false);
    }
  };

  // --- États de chargement et d'erreur ---

  if (isAuthLoading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-lg font-medium text-indigo-600">Chargement du profil...</div>
        {/* Un spinner ou un squelette serait préférable ici */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-4xl mx-auto bg-red-50 border-l-4 border-red-400 text-red-700 mt-10 rounded-lg shadow-md">
        <p className="font-bold">Erreur</p>
        <p>{error}</p>
        <Button onClick={() => user && fetchProfile(user.id)} className="mt-4">
          Réessayer
        </Button>
      </div>
    );
  }

  if (!profile) {
    // Cas où l'utilisateur est connecté mais n'a pas de profil consultant (première connexion)
    return (
      <div className="p-8 max-w-4xl mx-auto bg-white rounded-xl shadow-lg mt-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Créer votre Profil Consultant</h1>
        <p className="text-gray-600 mb-6">
          Bienvenue ! Il semble que vous n'ayez pas encore de profil consultant. Veuillez en créer un pour commencer.
        </p>
        {/* Ici, on pourrait afficher un formulaire de création initial, mais pour l'instant, on affiche le formulaire d'édition */}
        <ProfileEdit
          profile={initialProfileState}
          onSave={handleSaveProfile}
          onCancel={() => {}} // Pas d'annulation possible lors de la création
          isSaving={isSaving}
        />
      </div>
    );
  }

  // --- Affichage principal ---

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
          {isEditing ? 'Édition du Profil' : 'Mon Profil Consultant'}
        </h1>

        {isEditing ? (
          <ProfileEdit
            profile={profile}
            onSave={handleSaveProfile}
            onCancel={() => setIsEditing(false)}
            isSaving={isSaving}
          />
        ) : (
          <ProfileDisplay
            profile={profile}
            onEdit={() => setIsEditing(true)}
          />
        )}

        {isSaving && (
          <div className="mt-4 p-3 bg-blue-100 text-blue-800 rounded-lg text-center font-medium">
            Sauvegarde en cours...
          </div>
        )}
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-lg text-center font-medium">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}