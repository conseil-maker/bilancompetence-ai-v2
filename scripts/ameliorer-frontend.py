#!/usr/bin/env python3
"""
Script d'amélioration automatique du frontend
Enrichit les pages incomplètes avec du contenu professionnel
"""

import os
from pathlib import Path

# Pages à améliorer avec leur contenu enrichi
PAGES_A_AMELIORER = {
    "src/app/(beneficiaire)/mes-rdv/page.tsx": """'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, Video, MapPin, Plus, Filter } from 'lucide-react'

interface Rdv {
  id: string
  title: string
  date: string
  time: string
  type: 'presentiel' | 'visio'
  location?: string
  consultant: string
  status: 'confirme' | 'en_attente' | 'annule'
}

export default function MesRdvPage() {
  const [rdvs, setRdvs] = useState<Rdv[]>([])
  const [filter, setFilter] = useState<'tous' | 'a_venir' | 'passes'>('a_venir')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simuler le chargement des RDV
    setTimeout(() => {
      setRdvs([
        {
          id: '1',
          title: 'Entretien préliminaire',
          date: '2025-10-20',
          time: '14:00',
          type: 'visio',
          consultant: 'Marie Dupont',
          status: 'confirme'
        },
        {
          id: '2',
          title: 'Phase d\'investigation',
          date: '2025-10-25',
          time: '10:00',
          type: 'presentiel',
          location: 'Cabinet Paris 15ème',
          consultant: 'Marie Dupont',
          status: 'confirme'
        }
      ])
      setLoading(false)
    }, 500)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirme': return 'bg-green-100 text-green-800'
      case 'en_attente': return 'bg-yellow-100 text-yellow-800'
      case 'annule': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirme': return 'Confirmé'
      case 'en_attente': return 'En attente'
      case 'annule': return 'Annulé'
      default: return status
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes rendez-vous</h1>
        <p className="text-gray-600">
          Gérez vos rendez-vous avec votre consultant
        </p>
      </div>

      {/* Filtres et actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('tous')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'tous'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setFilter('a_venir')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'a_venir'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            À venir
          </button>
          <button
            onClick={() => setFilter('passes')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'passes'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Passés
          </button>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
          <Plus className="h-5 w-5" />
          Demander un RDV
        </button>
      </div>

      {/* Liste des RDV */}
      <div className="space-y-4">
        {rdvs.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun rendez-vous
            </h3>
            <p className="text-gray-600 mb-6">
              Vous n'avez pas encore de rendez-vous planifié
            </p>
            <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
              Prendre un premier rendez-vous
            </button>
          </div>
        ) : (
          rdvs.map((rdv) => (
            <div
              key={rdv.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {rdv.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(rdv.date).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {rdv.time}
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(rdv.status)}`}>
                  {getStatusLabel(rdv.status)}
                </span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    {rdv.type === 'visio' ? (
                      <>
                        <Video className="h-4 w-4" />
                        Visioconférence
                      </>
                    ) : (
                      <>
                        <MapPin className="h-4 w-4" />
                        {rdv.location}
                      </>
                    )}
                  </div>
                  <div>
                    Consultant: <span className="font-medium">{rdv.consultant}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {rdv.type === 'visio' && (
                    <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm">
                      Rejoindre
                    </button>
                  )}
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                    Modifier
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
""",
}

def main():
    base_dir = Path(__file__).parent.parent
    
    print("🚀 Amélioration automatique du frontend")
    print("=" * 50)
    
    for file_path, content in PAGES_A_AMELIORER.items():
        full_path = base_dir / file_path
        print(f"\n📝 Amélioration de: {file_path}")
        
        # Créer le dossier parent si nécessaire
        full_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Écrire le contenu
        full_path.write_text(content)
        print(f"   ✅ Fichier mis à jour ({len(content)} caractères)")
    
    print("\n" + "=" * 50)
    print("✨ Amélioration terminée!")

if __name__ == "__main__":
    main()

