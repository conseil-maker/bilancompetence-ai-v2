'use client'

import { useState } from 'react'
import { Search, Filter, Users, Clock, Calendar, ArrowRight, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function BilansPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPhase, setFilterPhase] = useState('tous')

  const bilans = [
    {
      id: 1,
      beneficiaire: {
        nom: 'Jean Dupont',
        email: 'jean.dupont@example.com',
        photo: null,
      },
      phase: 'Phase 1',
      phaseNom: 'Préliminaire',
      statut: 'en_cours',
      progression: 30,
      dateDebut: '1 Oct 2025',
      prochainRdv: '14 Oct 2025 - 10:00',
      heuresRealisees: 4,
      heuresTotales: 24,
      alertes: 0,
    },
    {
      id: 2,
      beneficiaire: {
        nom: 'Marie Martin',
        email: 'marie.martin@example.com',
        photo: null,
      },
      phase: 'Phase 2',
      phaseNom: 'Investigation',
      statut: 'en_cours',
      progression: 65,
      dateDebut: '15 Sep 2025',
      prochainRdv: '14 Oct 2025 - 14:00',
      heuresRealisees: 16,
      heuresTotales: 24,
      alertes: 1,
    },
    {
      id: 3,
      beneficiaire: {
        nom: 'Pierre Dubois',
        email: 'pierre.dubois@example.com',
        photo: null,
      },
      phase: 'Phase 3',
      phaseNom: 'Conclusion',
      statut: 'en_cours',
      progression: 90,
      dateDebut: '1 Sep 2025',
      prochainRdv: '15 Oct 2025 - 09:00',
      heuresRealisees: 22,
      heuresTotales: 24,
      alertes: 0,
    },
    {
      id: 4,
      beneficiaire: {
        nom: 'Sophie Bernard',
        email: 'sophie.bernard@example.com',
        photo: null,
      },
      phase: 'Phase 2',
      phaseNom: 'Investigation',
      statut: 'en_cours',
      progression: 50,
      dateDebut: '20 Sep 2025',
      prochainRdv: '18 Oct 2025 - 11:00',
      heuresRealisees: 12,
      heuresTotales: 24,
      alertes: 0,
    },
    {
      id: 5,
      beneficiaire: {
        nom: 'Luc Petit',
        email: 'luc.petit@example.com',
        photo: null,
      },
      phase: 'Phase 1',
      phaseNom: 'Préliminaire',
      statut: 'en_pause',
      progression: 20,
      dateDebut: '5 Oct 2025',
      prochainRdv: 'À planifier',
      heuresRealisees: 2,
      heuresTotales: 24,
      alertes: 2,
    },
  ]

  const filteredBilans = bilans.filter(bilan => {
    const matchSearch = bilan.beneficiaire.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       bilan.beneficiaire.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchPhase = filterPhase === 'tous' || bilan.phase === filterPhase
    return matchSearch && matchPhase
  })

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'en_cours':
        return <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">En cours</span>
      case 'en_pause':
        return <span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800">En pause</span>
      case 'termine':
        return <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">Terminé</span>
      default:
        return null
    }
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mes Bilans</h1>
        <p className="mt-2 text-gray-600">
          Gérez et suivez tous vos bilans de compétences en cours
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un bénéficiaire..."
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
                value={filterPhase}
                onChange={(e) => setFilterPhase(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
              >
                <option value="tous">Toutes les phases</option>
                <option value="Phase 1">Phase 1</option>
                <option value="Phase 2">Phase 2</option>
                <option value="Phase 3">Phase 3</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Bilans actifs</p>
              <p className="text-2xl font-bold text-gray-900">{bilans.filter(b => b.statut === 'en_cours').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 bg-orange-100 rounded-md p-3">
              <AlertCircle className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Alertes</p>
              <p className="text-2xl font-bold text-gray-900">
                {bilans.reduce((sum, b) => sum + b.alertes, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Heures ce mois</p>
              <p className="text-2xl font-bold text-gray-900">
                {bilans.reduce((sum, b) => sum + b.heuresRealisees, 0)}h
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des bilans */}
      <div className="space-y-4">
        {filteredBilans.map((bilan) => (
          <div
            key={bilan.id}
            className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-semibold text-primary">
                      {bilan.beneficiaire.nom.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{bilan.beneficiaire.nom}</h3>
                  <p className="text-sm text-gray-500">{bilan.beneficiaire.email}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-gray-500">
                      Début : {bilan.dateDebut}
                    </span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs font-medium text-primary">
                      {bilan.phase} - {bilan.phaseNom}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {bilan.alertes > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                    <AlertCircle className="h-3 w-3" />
                    {bilan.alertes}
                  </span>
                )}
                {getStatutBadge(bilan.statut)}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Progression</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all" 
                      style={{ width: `${bilan.progression}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{bilan.progression}%</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Heures réalisées</p>
                <p className="text-sm font-medium text-gray-900">
                  {bilan.heuresRealisees}h / {bilan.heuresTotales}h
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Prochain RDV</p>
                <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {bilan.prochainRdv}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <Link
                href={`/consultant/bilans/${bilan.id}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
              >
                Voir le détail
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredBilans.length === 0 && (
        <div className="bg-white shadow rounded-lg p-12 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun bilan trouvé</h3>
          <p className="text-sm text-gray-500">
            Essayez de modifier vos critères de recherche ou de filtre
          </p>
        </div>
      )}
    </div>
  )
}

