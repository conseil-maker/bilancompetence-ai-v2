'use client'

import { 
  Users, 
  FileText, 
  TrendingUp, 
  DollarSign,
  ArrowUp,
  ArrowDown,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'

export default function AdminDashboard() {
  // Données mockées
  const stats = [
    {
      name: 'Utilisateurs totaux',
      value: '248',
      change: '+12%',
      changeType: 'increase',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Bilans actifs',
      value: '45',
      change: '+8%',
      changeType: 'increase',
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: 'Revenus ce mois',
      value: '81 000€',
      change: '+15%',
      changeType: 'increase',
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      name: 'Taux de satisfaction',
      value: '4.7/5',
      change: '+0.2',
      changeType: 'increase',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ]

  const bilansByPhase = [
    { phase: 'Phase 1 - Préliminaire', count: 12, color: 'bg-blue-500' },
    { phase: 'Phase 2 - Investigation', count: 23, color: 'bg-purple-500' },
    { phase: 'Phase 3 - Conclusion', count: 10, color: 'bg-green-500' },
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'nouveau_bilan',
      message: 'Nouveau bilan créé pour Jean Dupont',
      consultant: 'Marie Martin',
      time: 'Il y a 2h',
      icon: FileText,
      color: 'text-blue-600',
    },
    {
      id: 2,
      type: 'bilan_termine',
      message: 'Bilan terminé pour Sophie Bernard',
      consultant: 'Pierre Dubois',
      time: 'Il y a 5h',
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      id: 3,
      type: 'nouvel_utilisateur',
      message: 'Nouveau consultant inscrit : Luc Petit',
      time: 'Il y a 1j',
      icon: Users,
      color: 'text-purple-600',
    },
    {
      id: 4,
      type: 'alerte',
      message: 'Bilan en retard - Emma Rousseau',
      consultant: 'Marie Martin',
      time: 'Il y a 2j',
      icon: AlertCircle,
      color: 'text-red-600',
    },
  ]

  const consultantsPerformance = [
    {
      id: 1,
      nom: 'Marie Martin',
      bilansActifs: 12,
      bilansTermines: 45,
      satisfaction: 4.9,
      heuresMois: 156,
    },
    {
      id: 2,
      nom: 'Pierre Dubois',
      bilansActifs: 10,
      bilansTermines: 38,
      satisfaction: 4.7,
      heuresMois: 142,
    },
    {
      id: 3,
      nom: 'Sophie Rousseau',
      bilansActifs: 8,
      bilansTermines: 32,
      satisfaction: 4.8,
      heuresMois: 128,
    },
  ]

  const alertes = [
    {
      id: 1,
      type: 'retard',
      message: '3 bilans en retard nécessitent une attention',
      priorite: 'haute',
    },
    {
      id: 2,
      type: 'expiration',
      message: '5 certifications Qualiopi à renouveler ce mois',
      priorite: 'moyenne',
    },
    {
      id: 3,
      type: 'paiement',
      message: '2 paiements en attente de validation',
      priorite: 'basse',
    },
  ]

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Administrateur</h1>
        <p className="mt-2 text-gray-600">
          Vue d'ensemble de l'activité de la plateforme
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
                        <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                          stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.changeType === 'increase' ? (
                            <ArrowUp className="h-4 w-4 flex-shrink-0 self-center" />
                          ) : (
                            <ArrowDown className="h-4 w-4 flex-shrink-0 self-center" />
                          )}
                          <span className="ml-1">{stat.change}</span>
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Alertes */}
      {alertes.length > 0 && (
        <div className="mb-8 space-y-3">
          {alertes.map((alerte) => (
            <div
              key={alerte.id}
              className={`rounded-lg p-4 ${
                alerte.priorite === 'haute' ? 'bg-red-50 border border-red-200' :
                alerte.priorite === 'moyenne' ? 'bg-orange-50 border border-orange-200' :
                'bg-blue-50 border border-blue-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <AlertCircle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                  alerte.priorite === 'haute' ? 'text-red-600' :
                  alerte.priorite === 'moyenne' ? 'text-orange-600' :
                  'text-blue-600'
                }`} />
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    alerte.priorite === 'haute' ? 'text-red-900' :
                    alerte.priorite === 'moyenne' ? 'text-orange-900' :
                    'text-blue-900'
                  }`}>
                    {alerte.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
        {/* Répartition des bilans */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Répartition des bilans par phase</h2>
          <div className="space-y-4">
            {bilansByPhase.map((item) => (
              <div key={item.phase}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.phase}</span>
                  <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`${item.color} h-2 rounded-full transition-all`}
                    style={{ width: `${(item.count / 45) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Total</span>
              <span className="text-lg font-bold text-gray-900">45 bilans</span>
            </div>
          </div>
        </div>

        {/* Activité récente */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Activité récente</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const Icon = activity.icon
              return (
                <div key={activity.id} className="flex items-start gap-4">
                  <div className={`flex-shrink-0 ${activity.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    {activity.consultant && (
                      <p className="text-xs text-gray-500 mt-1">Consultant : {activity.consultant}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Performance des consultants */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Performance des consultants</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Consultant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bilans actifs
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bilans terminés
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Satisfaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Heures ce mois
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {consultantsPerformance.map((consultant) => (
                <tr key={consultant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{consultant.nom}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{consultant.bilansActifs}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{consultant.bilansTermines}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900">{consultant.satisfaction}</span>
                      <span className="text-sm text-gray-500 ml-1">/5</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{consultant.heuresMois}h</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

