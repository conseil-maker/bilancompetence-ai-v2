'use client'

import { useState } from 'react'
import { Search, Filter, UserPlus, Edit, Trash2, Shield, User, Users } from 'lucide-react'

export default function UtilisateursPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('tous')

  const utilisateurs = [
    {
      id: 1,
      nom: 'Marie Martin',
      email: 'marie.martin@example.com',
      role: 'consultant',
      statut: 'actif',
      dateInscription: '15 Jan 2024',
      dernierAcces: '14 Oct 2025',
      bilansActifs: 12,
    },
    {
      id: 2,
      nom: 'Pierre Dubois',
      email: 'pierre.dubois@example.com',
      role: 'consultant',
      statut: 'actif',
      dateInscription: '20 Fév 2024',
      dernierAcces: '13 Oct 2025',
      bilansActifs: 10,
    },
    {
      id: 3,
      nom: 'Jean Dupont',
      email: 'jean.dupont@example.com',
      role: 'beneficiaire',
      statut: 'actif',
      dateInscription: '1 Oct 2025',
      dernierAcces: '14 Oct 2025',
      bilansActifs: 1,
    },
    {
      id: 4,
      nom: 'Sophie Bernard',
      email: 'sophie.bernard@example.com',
      role: 'beneficiaire',
      statut: 'actif',
      dateInscription: '20 Sep 2025',
      dernierAcces: '12 Oct 2025',
      bilansActifs: 1,
    },
    {
      id: 5,
      nom: 'Admin Principal',
      email: 'admin@netz-informatique.fr',
      role: 'admin',
      statut: 'actif',
      dateInscription: '1 Jan 2024',
      dernierAcces: '14 Oct 2025',
      bilansActifs: 0,
    },
    {
      id: 6,
      nom: 'Luc Petit',
      email: 'luc.petit@example.com',
      role: 'beneficiaire',
      statut: 'inactif',
      dateInscription: '5 Oct 2025',
      dernierAcces: '7 Oct 2025',
      bilansActifs: 0,
    },
  ]

  const filteredUtilisateurs = utilisateurs.filter(user => {
    const matchSearch = user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchRole = filterRole === 'tous' || user.role === filterRole
    return matchSearch && matchRole
  })

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800">
            <Shield className="h-3 w-3" />
            Admin
          </span>
        )
      case 'consultant':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
            <Users className="h-3 w-3" />
            Consultant
          </span>
        )
      case 'beneficiaire':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
            <User className="h-3 w-3" />
            Bénéficiaire
          </span>
        )
      default:
        return null
    }
  }

  const getStatutBadge = (statut: string) => {
    return statut === 'actif' ? (
      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
        Actif
      </span>
    ) : (
      <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
        Inactif
      </span>
    )
  }

  const stats = [
    {
      label: 'Total utilisateurs',
      value: utilisateurs.length,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Consultants',
      value: utilisateurs.filter(u => u.role === 'consultant').length,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Bénéficiaires',
      value: utilisateurs.filter(u => u.role === 'beneficiaire').length,
      icon: User,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Administrateurs',
      value: utilisateurs.filter(u => u.role === 'admin').length,
      icon: Shield,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ]

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
          <p className="mt-2 text-gray-600">
            Gérez tous les utilisateurs de la plateforme
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors">
          <UserPlus className="h-4 w-4" />
          Nouvel utilisateur
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white shadow rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className={`flex-shrink-0 ${stat.bgColor} rounded-md p-3`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
              >
                <option value="tous">Tous les rôles</option>
                <option value="admin">Administrateurs</option>
                <option value="consultant">Consultants</option>
                <option value="beneficiaire">Bénéficiaires</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inscription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernier accès
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bilans actifs
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUtilisateurs.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {user.nom.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.nom}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatutBadge(user.statut)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.dateInscription}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.dernierAcces}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.bilansActifs}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-primary hover:text-primary/80 mr-3">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUtilisateurs.length === 0 && (
        <div className="bg-white shadow rounded-lg p-12 text-center mt-6">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun utilisateur trouvé</h3>
          <p className="text-sm text-gray-500">
            Essayez de modifier vos critères de recherche ou de filtre
          </p>
        </div>
      )}
    </div>
  )
}

