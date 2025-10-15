import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * API endpoint pour collecter les événements analytics
 * POST /api/analytics
 */
export async function POST(request: NextRequest) {
  try {
    const event = await request.json();
    
    // Valider l'événement
    if (!event.name || !event.category) {
      return NextResponse.json(
        { error: 'Nom et catégorie de l\'événement requis' },
        { status: 400 }
      );
    }

    // Obtenir le client Supabase
    const supabase = await createClient();

    // Stocker l'événement dans la base de données
    const { error: dbError } = await supabase
      .from('analytics_events')
      .insert({
        name: event.name,
        category: event.category,
        properties: event.properties || {},
        timestamp: event.timestamp || Date.now(),
        user_id: event.properties?.userId || null,
        session_id: event.properties?.sessionId || null,
      });

    if (dbError) {
      console.error('Erreur lors de l\'enregistrement de l\'événement:', dbError);
      // Ne pas échouer si l'enregistrement échoue
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur dans l\'API analytics:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

/**
 * Obtenir les statistiques analytics
 * GET /api/analytics?period=7d
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Vérifier l'authentification
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Vérifier les permissions (admin uniquement)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    // Obtenir les paramètres de requête
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || '7d';
    
    // Calculer la date de début
    const daysAgo = parseInt(period.replace('d', ''));
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);

    // Récupérer les événements
    const { data: events, error } = await supabase
      .from('analytics_events')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Agréger les statistiques
    const stats = {
      totalEvents: events?.length || 0,
      eventsByCategory: {} as Record<string, number>,
      eventsByName: {} as Record<string, number>,
      uniqueUsers: new Set(events?.map(e => e.user_id).filter(Boolean)).size,
      uniqueSessions: new Set(events?.map(e => e.session_id).filter(Boolean)).size,
    };

    events?.forEach(event => {
      // Par catégorie
      stats.eventsByCategory[event.category] = 
        (stats.eventsByCategory[event.category] || 0) + 1;
      
      // Par nom
      stats.eventsByName[event.name] = 
        (stats.eventsByName[event.name] || 0) + 1;
    });

    return NextResponse.json({
      period,
      stats,
      events: events?.slice(0, 100), // Limiter à 100 événements récents
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des analytics:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

