import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { SupabaseClient } from '@supabase/supabase-js';

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Vérifie que l'utilisateur est authentifié
 */
export async function requireAuth(supabase: SupabaseClient) {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    throw new APIError('Non autorisé', 401, 'UNAUTHORIZED');
  }
  
  return user;
}

/**
 * Vérifie que l'utilisateur a l'un des rôles autorisés
 */
export async function requireRole(
  supabase: SupabaseClient,
  userId: string,
  allowedRoles: string[]
): Promise<{ id: string; role: string; first_name: string; last_name: string; email: string }> {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, role, first_name, last_name, email')
    .eq('id', userId)
    .single();

  if (error || !profile) {
    throw new APIError('Profil non trouvé', 404, 'PROFILE_NOT_FOUND');
  }

  if (!allowedRoles.includes(profile.role)) {
    throw new APIError(
      `Accès refusé. Rôles autorisés : ${allowedRoles.join(', ')}`,
      403,
      'FORBIDDEN'
    );
  }

  return profile;
}

/**
 * Vérifie que l'utilisateur a accès à un bilan spécifique
 */
export async function requireBilanAccess(
  supabase: SupabaseClient,
  bilanId: string,
  userId: string,
  allowedRoles: string[] = ['beneficiaire', 'consultant', 'admin']
): Promise<{
  bilan: any;
  profile: { id: string; role: string; first_name: string; last_name: string; email: string };
}> {
  // Récupérer le profil
  const profile = await requireRole(supabase, userId, allowedRoles);

  // Récupérer le bilan avec les relations
  const { data: bilan, error } = await supabase
    .from('bilans')
    .select(`
      *,
      beneficiaire:profiles!beneficiaire_id(id, first_name, last_name, email, role),
      consultant:profiles!consultant_id(id, first_name, last_name, email, role)
    `)
    .eq('id', bilanId)
    .single();

  if (error || !bilan) {
    throw new APIError('Bilan non trouvé', 404, 'BILAN_NOT_FOUND');
  }

  // Vérifier les permissions selon le rôle
  const hasAccess =
    profile.role === 'admin' ||
    (profile.role === 'beneficiaire' && bilan.beneficiaire_id === userId) ||
    (profile.role === 'consultant' && bilan.consultant_id === userId);

  if (!hasAccess) {
    throw new APIError('Accès refusé à ce bilan', 403, 'BILAN_ACCESS_DENIED');
  }

  return { bilan, profile };
}

/**
 * Wrapper pour gérer les erreurs des routes API
 */
export function withErrorHandling(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: any) => {
    try {
      return await handler(request, context);
    } catch (error) {
      console.error('API Error:', error);

      if (error instanceof APIError) {
        return NextResponse.json(
          {
            error: error.message,
            code: error.code,
          },
          { status: error.statusCode }
        );
      }

      // Erreur inconnue
      return NextResponse.json(
        {
          error: 'Erreur interne du serveur',
          code: 'INTERNAL_SERVER_ERROR',
        },
        { status: 500 }
      );
    }
  };
}

/**
 * Wrapper pour les routes nécessitant une authentification
 */
export function withAuth(
  handler: (
    request: NextRequest,
    context: {
      user: any;
      supabase: SupabaseClient;
      params?: any;
    }
  ) => Promise<NextResponse>
) {
  return withErrorHandling(async (request: NextRequest, routeContext?: any) => {
    const supabase = await createClient();
    const user = await requireAuth(supabase);

    return handler(request, {
      user,
      supabase,
      params: routeContext?.params,
    });
  });
}

/**
 * Wrapper pour les routes nécessitant un rôle spécifique
 */
export function withRole(
  allowedRoles: string[],
  handler: (
    request: NextRequest,
    context: {
      user: any;
      profile: { id: string; role: string; first_name: string; last_name: string; email: string };
      supabase: SupabaseClient;
      params?: any;
    }
  ) => Promise<NextResponse>
) {
  return withAuth(async (request, { user, supabase, params }) => {
    const profile = await requireRole(supabase, user.id, allowedRoles);

    return handler(request, {
      user,
      profile,
      supabase,
      params,
    });
  });
}

/**
 * Wrapper pour les routes nécessitant un accès à un bilan
 */
export function withBilanAccess(
  handler: (
    request: NextRequest,
    context: {
      user: any;
      profile: { id: string; role: string; first_name: string; last_name: string; email: string };
      bilan: any;
      supabase: SupabaseClient;
      params: any;
    }
  ) => Promise<NextResponse>
) {
  return withAuth(async (request, { user, supabase, params }) => {
    const resolvedParams = await params;
    const bilanId = resolvedParams?.id;

    if (!bilanId) {
      throw new APIError('ID du bilan manquant', 400, 'MISSING_BILAN_ID');
    }

    const { bilan, profile } = await requireBilanAccess(supabase, bilanId, user.id);

    return handler(request, {
      user,
      profile,
      bilan,
      supabase,
      params: resolvedParams,
    });
  });
}

/**
 * Parse et valide les paramètres de pagination
 */
export function parsePagination(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

/**
 * Formate la réponse avec pagination
 */
export function paginatedResponse(data: any[], count: number, page: number, limit: number) {
  return {
    data,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit),
      hasNext: page * limit < count,
      hasPrev: page > 1,
    },
  };
}

