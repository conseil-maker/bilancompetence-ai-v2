#!/usr/bin/env python3
"""
Générateur automatique de composants et pages frontend
Génère tous les composants et pages manquants de manière cohérente
"""

import os
from pathlib import Path

# Chemins de base
BASE_DIR = Path(__file__).parent.parent
COMPONENTS_DIR = BASE_DIR / "src" / "components"
APP_DIR = BASE_DIR / "src" / "app"

# Templates de composants
COMPONENT_TEMPLATES = {
    "MessageThread": """'use client';

import { useState, useEffect } from 'react';
import { Message } from '@/types/database.types';
import { messagesModule } from '@/lib/supabase/modules';

interface MessageThreadProps {
  bilanId: string;
  currentUserId: string;
}

export default function MessageThread({ bilanId, currentUserId }: MessageThreadProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, [bilanId]);

  const loadMessages = async () => {
    try {
      const data = await messagesModule.getMessagesByBilan(bilanId);
      setMessages(data);
    } catch (error) {
      console.error('Erreur chargement messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await messagesModule.createMessage({
        bilan_id: bilanId,
        sender_id: currentUserId,
        contenu: newMessage,
      });
      setNewMessage('');
      loadMessages();
    } catch (error) {
      console.error('Erreur envoi message:', error);
    }
  };

  if (loading) return <div className="p-4">Chargement...</div>;

  return (
    <div className="flex flex-col h-full">
      {/* Liste des messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender_id === currentUserId ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender_id === currentUserId
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              <p className="text-sm">{message.contenu}</p>
              <span className="text-xs opacity-75 mt-1 block">
                {new Date(message.created_at).toLocaleString('fr-FR')}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Zone de saisie */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Écrivez votre message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}
""",

    "RdvCalendar": """'use client';

import { useState, useEffect } from 'react';
import { Rdv } from '@/types/database.types';
import { rdvModule } from '@/lib/supabase/modules';

interface RdvCalendarProps {
  userId: string;
  role: 'beneficiaire' | 'consultant';
}

export default function RdvCalendar({ userId, role }: RdvCalendarProps) {
  const [rdvs, setRdvs] = useState<Rdv[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    loadRdvs();
  }, [userId, selectedDate]);

  const loadRdvs = async () => {
    try {
      const data = await rdvModule.getRdvsByUser(userId);
      setRdvs(data);
    } catch (error) {
      console.error('Erreur chargement RDV:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4">Chargement...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Mes Rendez-vous</h2>

      {/* Liste des RDV */}
      <div className="space-y-4">
        {rdvs.map((rdv) => (
          <div
            key={rdv.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900">{rdv.titre}</h3>
                <p className="text-sm text-gray-600 mt-1">{rdv.description}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  rdv.statut === 'confirme'
                    ? 'bg-green-100 text-green-800'
                    : rdv.statut === 'annule'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {rdv.statut}
              </span>
            </div>

            <div className="mt-3 flex gap-4 text-sm text-gray-600">
              <div>
                📅 {new Date(rdv.date_heure).toLocaleDateString('fr-FR')}
              </div>
              <div>
                🕐 {new Date(rdv.date_heure).toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
              <div>⏱️ {rdv.duree_minutes} min</div>
              {rdv.modalite && <div>📍 {rdv.modalite}</div>}
            </div>

            {rdv.lien_visio && (
              <a
                href={rdv.lien_visio}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-blue-600 hover:underline text-sm"
              >
                🔗 Rejoindre la visioconférence
              </a>
            )}
          </div>
        ))}

        {rdvs.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            Aucun rendez-vous prévu
          </p>
        )}
      </div>
    </div>
  );
}
""",

    "KanbanBoard": """'use client';

import { useState, useEffect } from 'react';
import { PlanAction } from '@/types/database.types';
import { planActionModule } from '@/lib/supabase/modules';

interface KanbanBoardProps {
  bilanId: string;
}

const columns = [
  { id: 'a_faire', label: 'À faire', color: 'bg-gray-100' },
  { id: 'en_cours', label: 'En cours', color: 'bg-blue-100' },
  { id: 'termine', label: 'Terminé', color: 'bg-green-100' },
];

export default function KanbanBoard({ bilanId }: KanbanBoardProps) {
  const [actions, setActions] = useState<PlanAction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActions();
  }, [bilanId]);

  const loadActions = async () => {
    try {
      const data = await planActionModule.getActionsByBilan(bilanId);
      setActions(data);
    } catch (error) {
      console.error('Erreur chargement actions:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateActionStatus = async (actionId: string, newStatus: string) => {
    try {
      await planActionModule.updateAction(actionId, { statut: newStatus });
      loadActions();
    } catch (error) {
      console.error('Erreur mise à jour action:', error);
    }
  };

  if (loading) return <div className="p-4">Chargement...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map((column) => (
        <div key={column.id} className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-gray-900 mb-4">{column.label}</h3>
          
          <div className="space-y-3">
            {actions
              .filter((action) => action.statut === column.id)
              .map((action) => (
                <div
                  key={action.id}
                  className={`${column.color} rounded-lg p-3 cursor-move`}
                  draggable
                  onDragEnd={() => {}}
                >
                  <h4 className="font-medium text-gray-900">{action.titre}</h4>
                  {action.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {action.description}
                    </p>
                  )}
                  
                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                    <span className="px-2 py-0.5 bg-white rounded-full">
                      {action.type}
                    </span>
                    {action.date_echeance && (
                      <span>
                        📅 {new Date(action.date_echeance).toLocaleDateString('fr-FR')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
""",
}

# Pages à générer
PAGES_TO_GENERATE = [
    # Bénéficiaire
    ("(beneficiaire)/profil", "Profil Bénéficiaire"),
    ("(beneficiaire)/messages", "Messagerie"),
    ("(beneficiaire)/rdv", "Mes Rendez-vous"),
    ("(beneficiaire)/plan-action", "Mon Plan d'Action"),
    ("(beneficiaire)/competences", "Mes Compétences"),
    ("(beneficiaire)/experiences", "Mes Expériences"),
    ("(beneficiaire)/pistes-metiers", "Pistes Métiers"),
    ("(beneficiaire)/formations", "Formations"),
    ("(beneficiaire)/resources", "Ressources"),
    ("(beneficiaire)/notifications", "Notifications"),
    
    # Consultant
    ("(consultant)/bilans/[id]", "Détail du Bilan"),
    ("(consultant)/messages", "Messagerie"),
    ("(consultant)/rdv", "Mes Rendez-vous"),
    ("(consultant)/profil", "Mon Profil"),
    ("(consultant)/enquetes", "Enquêtes de Satisfaction"),
    ("(consultant)/reclamations", "Réclamations"),
    
    # Admin
    ("(admin)/bilans", "Tous les Bilans"),
    ("(admin)/statistiques", "Statistiques"),
    ("(admin)/resources", "Ressources Pédagogiques"),
    ("(admin)/qualiopi", "Conformité Qualiopi"),
    ("(admin)/audit", "Journal d'Audit"),
]

def generate_simple_page(route: str, title: str) -> str:
    """Génère une page simple avec layout de base"""
    return f"""'use client';

import {{ useEffect, useState }} from 'react';

export default function {title.replace(' ', '')}Page() {{
  const [loading, setLoading] = useState(true);

  useEffect(() => {{
    // Charger les données
    setLoading(false);
  }}, []);

  if (loading) {{
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }}

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{title}</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">
          Contenu de la page {title}
        </p>
      </div>
    </div>
  );
}}
"""

def main():
    print("🚀 Génération des composants et pages frontend...")
    print("=" * 80)
    
    # Générer les composants depuis les templates
    print("\n📦 Génération des composants...")
    for component_name, template in COMPONENT_TEMPLATES.items():
        # Déterminer le dossier basé sur le nom
        if "Message" in component_name:
            folder = "messages"
        elif "Rdv" in component_name or "Calendar" in component_name:
            folder = "rdv"
        elif "Kanban" in component_name or "PlanAction" in component_name:
            folder = "plan-action"
        else:
            folder = "common"
        
        file_path = COMPONENTS_DIR / folder / f"{component_name}.tsx"
        file_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(file_path, 'w') as f:
            f.write(template)
        
        print(f"  ✓ {component_name} créé")
    
    # Générer les pages
    print("\n📄 Génération des pages...")
    for route, title in PAGES_TO_GENERATE:
        page_dir = APP_DIR / route
        page_dir.mkdir(parents=True, exist_ok=True)
        
        page_file = page_dir / "page.tsx"
        
        with open(page_file, 'w') as f:
            f.write(generate_simple_page(route, title))
        
        print(f"  ✓ {route}/page.tsx créé")
    
    print("\n" + "=" * 80)
    print("✅ Génération terminée !")
    print(f"   - {len(COMPONENT_TEMPLATES)} composants créés")
    print(f"   - {len(PAGES_TO_GENERATE)} pages créées")

if __name__ == "__main__":
    main()

