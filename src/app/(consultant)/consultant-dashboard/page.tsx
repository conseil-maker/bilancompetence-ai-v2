'use client'

import { useAuthContext } from '@/components/providers/AuthProvider'
import { 
  Users, 
  Calendar, 
  Clock, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  ArrowRight,
  MessageSquare
} from 'lucide-react'
import Link from 'next/link'

export default function ConsultantDashboard() {
  const { user } = useAuthContext()

  // Données mockées
  const stats = [
    {
      name: 'Bilans actifs',
      value: '12',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+2 ce mois',
    },
    {
      name: 'RDV cette semaine',
      value: '8',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: 'Heures réalisées',
      value: '156h',
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: 'ce mois',
    },
    {
      name: 'Taux de satisfaction',
      value: '4.8/5',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ]

  const prochainsRdv = [
    {
      id: 1,
      beneficiaire: 'Jean Dupont',
      date: '14 Oct 2025',
      heure: '10:00',
      type: 'Entretien préliminaire',
      phase: 'Phase 1',
      statut: 'confirme',
    },
    {
      id: 2,
      beneficiaire: 'Marie Martin',
      date: '14 Oct 2025',
      heure: '14:00',
      type: 'Investigation',
      phase: 'Phase 2',
      statut: 'confirme',
    },
    {
      id: 3,
      beneficiaire: 'Pierre Dubois',
      date: '15 Oct 2025',
      heure: '09:00',
      type: 'Restitution finale',
      phase: 'Phase 3',
      statut: 'a_confirmer',
    },
  ]

  const bilansEnCours = [
    {
      id: 1,
      beneficiaire: 'Sophie Bernard',
      phase: 'Phase 2 - Investigation',
      progression: 65,
      prochainRdv: '18 Oct 2025',
      alertes: 1,
    },
    {
      id: 2,
      beneficiaire: 'Luc Petit',
      phase: 'Phase 1 - Préliminaire',
      progression: 30,
      prochainRdv: '20 Oct 2025',
      alertes: 0,
    },
    {
      id: 3,
      beneficiaire: 'Emma Rousseau',
      phase: 'Phase 3 - Conclusion',
      progression: 90,
      prochainRdv: '22 Oct 2025',
      alertes: 0,
    },
  ]

  const tachesUrgentes = [
    {
      id: 1,
      titre: 'Préparer synthèse Phase 1 - Jean Dupont',
      deadline: 'Aujourd\'hui',
      priorite: 'haute',
    },
    {
      id: 2,
      titre: 'Valider tests MBTI - Marie Martin',
      deadline: 'Demain',
      priorite: 'haute',
    },
    {
      id: 3,
      titre: 'Planifier RDV Phase 3 - Pierre Dubois',
      deadline: '16 Oct',
      priorite: 'moyenne',
    },
  ]

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Bonjour {user?.first_name} 👋
        </h1>
        <p className="mt-2 text-gray-600">
          Voici un aperçu de votre activité et de vos bilans en cours
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.name}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 ${stat.bgColor} rounded-md p-3`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </div>
                        {stat.change && (
                          <div className="ml-2 text-sm text-gray-500">
                            {stat.change}
                          </div>
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Prochains rendez-vous */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Prochains rendez-vous</h2>
            <Link
              href="/consultant/calendrier"
              className="text-sm font-medium text-primary hover:text-primary/80"
            >
              Voir tout
            </Link>
          </div>
          <div className="space-y-3">
            {prochainsRdv.map((rdv) => (
              <div
                key={rdv.id}
                className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-primary/50 transition-colors"
              >
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{rdv.beneficiaire}</p>
                  <p className="text-xs text-gray-500 mt-1">{rdv.type} • {rdv.phase}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    <Clock className="h-3 w-3 inline mr-1" />
                    {rdv.date} à {rdv.heure}
                  </p>
                </div>
                {rdv.statut === 'a_confirmer' && (
                  <span className="flex-shrink-0 inline-flex items-center rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800">
                    À confirmer
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tâches urgentes */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Tâches urgentes</h2>
          </div>
          <div className="space-y-3">
            {tachesUrgentes.map((tache) => (
              <div
                key={tache.id}
                className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-primary/50 transition-colors"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <div className={`h-2 w-2 rounded-full ${
                    tache.priorite === 'haute' ? 'bg-red-500' :
                    tache.priorite === 'moyenne' ? 'bg-orange-500' :
                    'bg-green-500'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{tache.titre}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    <Clock className="h-3 w-3 inline mr-1" />
                    {tache.deadline}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bilans en cours */}
        <div className="bg-white shadow rounded-lg p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Bilans en cours</h2>
            <Link
              href="/consultant/bilans"
              className="text-sm font-medium text-primary hover:text-primary/80"
            >
              Voir tous les bilans
            </Link>
          </div>
          <div className="space-y-4">
            {bilansEnCours.map((bilan) => (
              <div
                key={bilan.id}
                className="p-4 rounded-lg border border-gray-200 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{bilan.beneficiaire}</h3>
                    <p className="text-xs text-gray-500 mt-1">{bilan.phase}</p>
                  </div>
                  {bilan.alertes > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                      <AlertCircle className="h-3 w-3" />
                      {bilan.alertes}
                    </span>
                  )}
                </div>
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700">Progression</span>
                    <span className="text-xs font-medium text-gray-900">{bilan.progression}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all" 
                      style={{ width: `${bilan.progression}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Prochain RDV : {bilan.prochainRdv}
                  </span>
                  <Link
                    href={`/consultant/bilans/${bilan.id}`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80"
                  >
                    Voir détails
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Messages non lus */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <MessageSquare className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-blue-900">
              Vous avez 3 nouveaux messages
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              Des bénéficiaires attendent votre réponse
            </p>
            <Link
              href="/consultant/messages"
              className="inline-flex items-center gap-2 mt-2 text-sm font-medium text-blue-900 hover:text-blue-800"
            >
              Voir les messages
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

