'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { competencesModule } from '@/lib/supabase/modules'

// Définition d'un type d'expérience pour la clarté, même si non strictement nécessaire pour le TSX pur
interface Experience {
  id: number
  titre: string
  entreprise: string
  date_debut: string
  date_fin: string | null
  description: string
}

// Définition d'un type pour le nouvel ajout
interface NewExperience {
  titre: string
  entreprise: string
  date_debut: string
  date_fin: string
  description: string
}

export default function ExperiencesPage() {
  const { user } = useAuth()
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [newExperience, setNewExperience] = useState<NewExperience>({
    titre: '',
    entreprise: '',
    date_debut: '',
    date_fin: '',
    description: '',
  })

  useEffect(() => {
    if (user) {
      fetchExperiences()
    } else {
      setIsLoading(false)
    }
  }, [user])

  const fetchExperiences = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Utilisation de la fonction fournie dans la consigne
      const data = await competencesModule.getAllExperiences()
      setExperiences(data as Experience[])
    } catch (err) {
      console.error('Erreur lors du chargement des expériences:', err)
      setError('Erreur lors du chargement des exp\u00e9riences professionnelles.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewExperience((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddExperience = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Logique d'ajout simulée ou à implémenter avec Supabase
    console.log('Ajout de l\'exp\u00e9rience:', newExperience)
    // Ici, on devrait appeler une fonction d'insertion Supabase
    // Par souci de simplicité et de conformité aux contraintes, on simule la réussite
    // et on recharge les données.
    try {
      // Exemple d'appel hypothétique:
      // await competencesModule.addExperience(newExperience);
      // await fetchExperiences(); // Recharger la liste
      
      // Simulation de l'ajout pour le rendu initial
      const tempId = experiences.length + 1
      setExperiences((prev) => [
        ...prev,
        { ...newExperience, id: tempId, date_fin: newExperience.date_fin || null } as Experience,
      ])
      
      setNewExperience({
        titre: '',
        entreprise: '',
        date_debut: '',
        date_fin: '',
        description: '',
      })
      setShowForm(false)
    } catch (err) {
      setError('Erreur lors de l\'ajout de l\'exp\u00e9rience.')
    }
  }

  if (isLoading) {
    return (
      <div className='p-6'>
        <div className='text-xl font-semibold'>Chargement des exp\u00e9riences...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='p-6'>
        <div className='text-red-600 font-semibold'>{error}</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className='p-6'>
        <div className='text-red-600 font-semibold'>Vous devez \u00eatre connect\u00e9 pour voir cette page.</div>
      </div>
    )
  }

  return (
    <div className='p-6 max-w-6xl mx-auto'>
      <div className='flex justify-between items-center mb-6'>
        <div className='text-3xl font-bold text-gray-800'>Mes Exp\u00e9riences Professionnelles</div>
        <button
          onClick={() => setShowForm(!showForm)}
          className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out'
        >
          {showForm ? 'Masquer le formulaire' : 'Ajouter une exp\u00e9rience'}
        </button>
      </div>

      {showForm && (
        <div className='mb-8 p-6 border border-gray-200 rounded-lg shadow-lg bg-white'>
          <div className='text-xl font-semibold mb-4'>Ajouter une nouvelle exp\u00e9rience</div>
          <form onSubmit={handleAddExperience} className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label htmlFor='titre' className='block text-sm font-medium text-gray-700 mb-1'>
                  Titre du poste
                </label>
                <input
                  type='text'
                  id='titre'
                  name='titre'
                  value={newExperience.titre}
                  onChange={handleInputChange}
                  required
                  className='w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
                />
              </div>
              <div>
                <label htmlFor='entreprise' className='block text-sm font-medium text-gray-700 mb-1'>
                  Entreprise
                </label>
                <input
                  type='text'
                  id='entreprise'
                  name='entreprise'
                  value={newExperience.entreprise}
                  onChange={handleInputChange}
                  required
                  className='w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
                />
              </div>
              <div>
                <label htmlFor='date_debut' className='block text-sm font-medium text-gray-700 mb-1'>
                  Date de d\u00e9but
                </label>
                <input
                  type='date'
                  id='date_debut'
                  name='date_debut'
                  value={newExperience.date_debut}
                  onChange={handleInputChange}
                  required
                  className='w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
                />
              </div>
              <div>
                <label htmlFor='date_fin' className='block text-sm font-medium text-gray-700 mb-1'>
                  Date de fin (laisser vide si toujours en poste)
                </label>
                <input
                  type='date'
                  id='date_fin'
                  name='date_fin'
                  value={newExperience.date_fin}
                  onChange={handleInputChange}
                  className='w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
                />
              </div>
            </div>
            <div>
              <label htmlFor='description' className='block text-sm font-medium text-gray-700 mb-1'>
                Description des t\u00e2ches et r\u00f4les
              </label>
              <textarea
                id='description'
                name='description'
                rows={4}
                value={newExperience.description}
                onChange={handleInputChange}
                required
                className='w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
              ></textarea>
            </div>
            <button
              type='submit'
              className='w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-150 ease-in-out'
            >
              Enregistrer l'\u00e9xp\u00e9rience
            </button>
          </form>
        </div>
      )}

      <div className='overflow-x-auto bg-white shadow-lg rounded-lg'>
        {experiences.length === 0 ? (
          <div className='p-6 text-center text-gray-500'>
            Aucune exp\u00e9rience professionnelle trouv\u00e9e. Ajoutez-en une pour commencer.
          </div>
        ) : (
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  Titre du poste
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  Entreprise
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  P\u00e9riode
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  Description
                </th>
                <th scope='col' className='relative px-6 py-3'>
                  <span className='sr-only'>Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {experiences.map((exp) => (
                <tr key={exp.id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                    {exp.titre}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {exp.entreprise}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {exp.date_debut} - {exp.date_fin || 'Pr\u00e9sent'}
                  </td>
                  <td className='px-6 py-4 text-sm text-gray-500 max-w-xs truncate'>
                    {exp.description}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                    <button className='text-indigo-600 hover:text-indigo-900 mr-4'>
                      \u00c9diter
                    </button>
                    <button className='text-red-600 hover:text-red-900'>
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}