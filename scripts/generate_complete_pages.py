#!/usr/bin/env python3
"""
Générateur de pages complètes pour BilanCompetence.AI v2
Génère le contenu fonctionnel de toutes les pages frontend
"""

from pathlib import Path

BASE_DIR = Path(__file__).parent.parent
APP_DIR = BASE_DIR / "src" / "app"

# Templates de pages complètes
PAGE_TEMPLATES = {
    # BÉNÉFICIAIRE
    "(beneficiaire)/mes-rdv": """'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import RdvCalendar from '@/components/rdv/RdvCalendar';

export default function MesRendezvousPage() {
  const { user } = useAuth();

  if (!user) {
    return <div className="p-8 text-center">Veuillez vous connecter</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Mes Rendez-vous</h1>
      <RdvCalendar userId={user.id} role="beneficiaire" />
    </div>
  );
}
""",

    "(beneficiaire)/ma-messagerie": """'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { bilansModule } from '@/lib/supabase/modules';
import MessageThread from '@/components/messages/MessageThread';

export default function MaMessagériePage() {
  const { user } = useAuth();
  const [bilanId, setBilanId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadBilan();
    }
  }, [user]);

  const loadBilan = async () => {
    try {
      if (!user) return;
      const bilans = await bilansModule.getBilansByBeneficiaire(user.id);
      if (bilans.length > 0) {
        setBilanId(bilans[0].id);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Chargement...</div>;
  }

  if (!bilanId) {
    return <div className="p-8 text-center">Aucun bilan actif</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Ma Messagerie</h1>
      <div className="bg-white rounded-lg shadow h-[600px]">
        <MessageThread bilanId={bilanId} currentUserId={user!.id} />
      </div>
    </div>
  );
}
""",

    "(beneficiaire)/plan-action": """'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { bilansModule } from '@/lib/supabase/modules';
import KanbanBoard from '@/components/plan-action/KanbanBoard';

export default function MonPlandActionPage() {
  const { user } = useAuth();
  const [bilanId, setBilanId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadBilan();
    }
  }, [user]);

  const loadBilan = async () => {
    try {
      if (!user) return;
      const bilans = await bilansModule.getBilansByBeneficiaire(user.id);
      if (bilans.length > 0) {
        setBilanId(bilans[0].id);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Chargement...</div>;
  }

  if (!bilanId) {
    return <div className="p-8 text-center">Aucun bilan actif</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Mon Plan d'Action</h1>
      <KanbanBoard bilanId={bilanId} />
    </div>
  );
}
""",

    "(beneficiaire)/competences": """'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { competencesModule } from '@/lib/supabase/modules';
import CompetenceCard from '@/components/competences/CompetenceCard';
import { Competence } from '@/types/database.types';

export default function CompetencesPage() {
  const { user } = useAuth();
  const [competences, setCompetences] = useState<Competence[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadCompetences();
    }
  }, [user]);

  const loadCompetences = async () => {
    try {
      if (!user) return;
      const data = await competencesModule.getCompetencesByUser(user.id);
      setCompetences(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Chargement...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Mes Compétences</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          ➕ Ajouter une compétence
        </button>
      </div>

      {competences.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {competences.map((competence) => (
            <CompetenceCard key={competence.id} competence={competence} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-600">Aucune compétence enregistrée</p>
        </div>
      )}
    </div>
  );
}
""",

    # CONSULTANT
    "(consultant)/bilans/[id]": """'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { bilansModule } from '@/lib/supabase/modules';
import { Bilan } from '@/types/database.types';
import BilanStatusBadge from '@/components/bilans/BilanStatusBadge';

export default function BilanDetailPage() {
  const params = useParams();
  const bilanId = params.id as string;
  const [bilan, setBilan] = useState<Bilan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bilanId) {
      loadBilan();
    }
  }, [bilanId]);

  const loadBilan = async () => {
    try {
      const data = await bilansModule.getBilan(bilanId);
      setBilan(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Chargement...</div>;
  }

  if (!bilan) {
    return <div className="p-8 text-center">Bilan non trouvé</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{bilan.titre}</h1>
            <p className="text-gray-600 mt-2">{bilan.description}</p>
          </div>
          <BilanStatusBadge status={bilan.status} size="lg" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Date de début</p>
            <p className="text-lg font-semibold">
              {bilan.date_debut ? new Date(bilan.date_debut).toLocaleDateString('fr-FR') : '-'}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Progression</p>
            <p className="text-lg font-semibold">{calculateProgress(bilan)}%</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Engagement</p>
            <p className="text-lg font-semibold">{bilan.engagement_score || 0}%</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex gap-4">
            <button className="px-4 py-2 border-b-2 border-blue-600 text-blue-600 font-medium">
              Informations
            </button>
            <button className="px-4 py-2 text-gray-600 hover:text-gray-900">
              Compétences
            </button>
            <button className="px-4 py-2 text-gray-600 hover:text-gray-900">
              Pistes métiers
            </button>
            <button className="px-4 py-2 text-gray-600 hover:text-gray-900">
              Plan d'action
            </button>
            <button className="px-4 py-2 text-gray-600 hover:text-gray-900">
              Documents
            </button>
          </nav>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Informations du bilan</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Bénéficiaire</p>
              <p className="font-medium">{bilan.beneficiaire_id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Consultant</p>
              <p className="font-medium">{bilan.consultant_id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function calculateProgress(bilan: Bilan): number {
  let progress = 0;
  if (bilan.preliminaire_completed_at) progress += 33;
  if (bilan.investigation_completed_at) progress += 33;
  if (bilan.conclusion_completed_at) progress += 34;
  return Math.round(progress);
}
""",

    # ADMIN
    "(admin)/tous-bilans": """'use client';

import { useEffect, useState } from 'react';
import { bilansModule } from '@/lib/supabase/modules';
import BilanCard from '@/components/bilans/BilanCard';
import { Bilan } from '@/types/database.types';

export default function TousBilansPage() {
  const [bilans, setBilans] = useState<Bilan[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadBilans();
  }, []);

  const loadBilans = async () => {
    try {
      const data = await bilansModule.getAllBilans();
      setBilans(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBilans = filter === 'all' 
    ? bilans 
    : bilans.filter(b => b.status === filter);

  if (loading) {
    return <div className="p-8 text-center">Chargement...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Tous les Bilans</h1>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="all">Tous</option>
            <option value="en_attente">En attente</option>
            <option value="en_cours">En cours</option>
            <option value="termine">Terminés</option>
            <option value="abandonne">Abandonnés</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBilans.map((bilan) => (
          <BilanCard key={bilan.id} bilan={bilan} role="admin" />
        ))}
      </div>

      {filteredBilans.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-600">Aucun bilan trouvé</p>
        </div>
      )}
    </div>
  );
}
""",
}

def generate_pages():
    """Génère toutes les pages définies dans PAGE_TEMPLATES"""
    print("🚀 Génération des pages complètes...")
    print("=" * 80)
    
    generated_count = 0
    
    for route, template in PAGE_TEMPLATES.items():
        page_dir = APP_DIR / route
        page_dir.mkdir(parents=True, exist_ok=True)
        
        page_file = page_dir / "page.tsx"
        
        with open(page_file, 'w') as f:
            f.write(template)
        
        print(f"✓ {route}/page.tsx")
        generated_count += 1
    
    print("=" * 80)
    print(f"✅ {generated_count} pages générées avec succès !")

if __name__ == "__main__":
    generate_pages()

