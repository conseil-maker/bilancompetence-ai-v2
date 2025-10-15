'use client'

import { useAuthContext } from '@/components/providers/AuthProvider'
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  FileText,
  MessageSquare,
  ArrowRight,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'

export default function BeneficiaireDashboard() {
  const { user } = useAuthContext()

  // Données mockées - à remplacer par de vraies données Supabase
  const stats = [
    {
      name: 'Progression',
      value: '45%',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: 'Heures réalisées',
      value: '12h / 24h',
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Tests complétés',
      value: '3 / 5',
      icon: CheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      name: 'Messages',
      value: '2 non lus',
      icon: MessageSquare,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ]

  const prochainRdv = {
    date: '25 Octobre 2025',
    heure: '14:00',
    consultant: 'Marie Dupont',
    type: 'Entretien d\'investigation',
  }

  const dernieresActivites = [
    {
      id: 1,
      type: 'test',
      titre: 'Test MBTI complété',
      date: '20 Oct 2025',
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      id: 2,
      type: 'message',
      titre: 'Nouveau message de votre consultant',
      date: '19 Oct 2025',
      icon: MessageSquare,
      color: 'text-blue-600',
    },
    {
      id: 3,
      type: 'document',
      titre: 'Document de synthèse Phase 1 disponible',
      date: '18 Oct 2025',
      icon: FileText,
      color: 'text-purple-600',
    },
  ]

  const tachesEnCours = [
    {
      id: 1,
      titre: 'Compléter le test RIASEC',
      deadline: '22 Oct 2025',
      priorite: 'haute',
    },
    {
      id: 2,
      titre: 'Préparer les questions pour le prochain entretien',
      deadline: '25 Oct 2025',
      priorite: 'moyenne',
    },
    {
      id: 3,
      titre: 'Explorer les fiches métiers recommandées',
      deadline: '28 Oct 2025',
      priorite: 'basse',
    },
  ]

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Bonjour {user?.full_name?.split(' ')[0]} 👋
        </h1>
        <p className="mt-2 text-gray-600">
          Voici un aperçu de votre progression dans votre bilan de compétences
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
                      <dd className="text-2xl font-semibold text-gray-900">
                        {stat.value}
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
        {/* Prochain rendez-vous */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Prochain rendez-vous</h2>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <div className="bg-primary/5 rounded-lg p-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                  <Calendar className="h-6 w-6" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">{prochainRdv.type}</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {prochainRdv.date} à {prochainRdv.heure}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  avec {prochainRdv.consultant}
                </p>
                <Link
                  href="/beneficiaire/parcours"
                  className="inline-flex items-center gap-2 mt-3 text-sm font-medium text-primary hover:text-primary/80"
                >
                  Voir les détails
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Tâches en cours */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Tâches en cours</h2>
            <Link
              href="/beneficiaire/parcours"
              className="text-sm font-medium text-primary hover:text-primary/80"
            >
              Tout voir
            </Link>
          </div>
          <div className="space-y-3">
            {tachesEnCours.map((tache) => (
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

        {/* Dernières activités */}
        <div className="bg-white shadow rounded-lg p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Activité récente</h2>
          </div>
          <div className="space-y-4">
            {dernieresActivites.map((activite) => {
              const Icon = activite.icon
              return (
                <div key={activite.id} className="flex items-start gap-4">
                  <div className={`flex-shrink-0 ${activite.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activite.titre}</p>
                    <p className="text-xs text-gray-500 mt-1">{activite.date}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Alert si inactivité */}
      <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-orange-900">
              N'oubliez pas de compléter vos tests
            </h3>
            <p className="text-sm text-orange-700 mt-1">
              Vous avez 2 tests en attente. Complétez-les avant votre prochain rendez-vous
              pour optimiser votre accompagnement.
            </p>
            <Link
              href="/beneficiaire/tests"
              className="inline-flex items-center gap-2 mt-2 text-sm font-medium text-orange-900 hover:text-orange-800"
            >
              Accéder aux tests
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

