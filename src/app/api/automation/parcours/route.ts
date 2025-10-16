import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { parcoursEngine } from '@/lib/automation/parcours-engine';

/**
 * GET /api/automation/parcours?bilanId=xxx
 * Analyser l'état du parcours et obtenir les actions automatiques
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Vérifier l'authentification
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const bilanId = searchParams.get('bilanId');

    if (!bilanId) {
      return NextResponse.json({ 
        error: 'bilanId requis' 
      }, { status: 400 });
    }

    // Analyser l'état du parcours
    const state = await parcoursEngine.analyzeParcoursState(bilanId);

    // Générer les actions automatiques
    const actions = await parcoursEngine.generateAutomationActions(state);

    return NextResponse.json({ 
      success: true,
      state,
      actions,
      recommendations: {
        should_escalate: actions.some(a => a.type === 'escalation'),
        is_on_track: state.is_on_track,
        next_steps: actions.filter(a => a.action_required).map(a => a.action_required)
      }
    });

  } catch (error) {
    console.error('Erreur analyse parcours:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'analyse du parcours' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/automation/parcours
 * Exécuter les actions automatiques
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Vérifier l'authentification
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { bilanId, executeActions } = await request.json();

    if (!bilanId) {
      return NextResponse.json({ 
        error: 'bilanId requis' 
      }, { status: 400 });
    }

    // Analyser l'état du parcours
    const state = await parcoursEngine.analyzeParcoursState(bilanId);

    // Générer les actions automatiques
    const actions = await parcoursEngine.generateAutomationActions(state);

    // Exécuter les actions si demandé
    if (executeActions) {
      await parcoursEngine.executeAutomationActions(bilanId, actions);
    }

    return NextResponse.json({ 
      success: true,
      state,
      actions_generated: actions.length,
      actions_executed: executeActions ? actions.length : 0
    });

  } catch (error) {
    console.error('Erreur automation parcours:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'automation du parcours' },
      { status: 500 }
    );
  }
}

