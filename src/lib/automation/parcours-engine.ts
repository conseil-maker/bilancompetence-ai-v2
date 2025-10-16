// ============================================================================
// PARCOURS ENGINE - Automation complète du parcours bilan
// ============================================================================

import { createClient } from '@supabase/supabase-js';

// ============================================================================
// TYPES
// ============================================================================

export type PhaseStatus = 'not_started' | 'in_progress' | 'completed' | 'blocked';
export type PhaseName = 'preliminaire' | 'investigation' | 'conclusion' | 'suivi';

export interface PhaseProgress {
  phase: PhaseName;
  status: PhaseStatus;
  progress_percentage: number; // 0-100
  started_at?: Date;
  completed_at?: Date;
  estimated_completion?: Date;
  blockers?: string[];
}

export interface ParcoursState {
  bilan_id: string;
  current_phase: PhaseName;
  phases: Record<PhaseName, PhaseProgress>;
  total_progress: number; // 0-100
  estimated_end_date?: Date;
  is_on_track: boolean;
  delays_days?: number;
}

export interface AutomationAction {
  type: 'notification' | 'email' | 'task' | 'reminder' | 'escalation';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  recipient: 'beneficiaire' | 'consultant' | 'both';
  message: string;
  action_required?: string;
  due_date?: Date;
}

// ============================================================================
// MOTEUR D'AUTOMATION
// ============================================================================

export class ParcoursEngine {
  private supabase;

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }

  /**
   * Analyser l'état actuel du parcours
   */
  async analyzeParcoursState(bilanId: string): Promise<ParcoursState> {
    // Récupérer le bilan
    const { data: bilan } = await this.supabase
      .from('bilans')
      .select('*')
      .eq('id', bilanId)
      .single();

    if (!bilan) {
      throw new Error('Bilan non trouvé');
    }

    // Analyser chaque phase
    const phases: Record<PhaseName, PhaseProgress> = {
      preliminaire: await this.analyzePhase(bilanId, 'preliminaire'),
      investigation: await this.analyzePhase(bilanId, 'investigation'),
      conclusion: await this.analyzePhase(bilanId, 'conclusion'),
      suivi: await this.analyzePhase(bilanId, 'suivi')
    };

    // Déterminer la phase actuelle
    const current_phase = this.determineCurrentPhase(phases);

    // Calculer la progression totale
    const total_progress = this.calculateTotalProgress(phases);

    // Vérifier si le parcours est dans les temps
    const { is_on_track, delays_days, estimated_end_date } = 
      this.checkTimeline(bilan, phases);

    return {
      bilan_id: bilanId,
      current_phase,
      phases,
      total_progress,
      estimated_end_date,
      is_on_track,
      delays_days
    };
  }

  /**
   * Analyser une phase spécifique
   */
  private async analyzePhase(bilanId: string, phase: PhaseName): Promise<PhaseProgress> {
    // Récupérer les données de la phase
    const { data: phaseData } = await this.supabase
      .from('parcours_phases')
      .select('*')
      .eq('bilan_id', bilanId)
      .eq('phase', phase)
      .single();

    if (!phaseData) {
      return {
        phase,
        status: 'not_started',
        progress_percentage: 0
      };
    }

    // Calculer le pourcentage de progression
    const progress_percentage = this.calculatePhaseProgress(phase, phaseData);

    // Déterminer le statut
    let status: PhaseStatus = 'not_started';
    if (progress_percentage === 100) {
      status = 'completed';
    } else if (progress_percentage > 0) {
      status = 'in_progress';
    }

    // Détecter les blocages
    const blockers = await this.detectBlockers(bilanId, phase, phaseData);
    if (blockers.length > 0) {
      status = 'blocked';
    }

    // Estimer la date de complétion
    const estimated_completion = this.estimateCompletion(phase, progress_percentage);

    return {
      phase,
      status,
      progress_percentage,
      started_at: phaseData.started_at ? new Date(phaseData.started_at) : undefined,
      completed_at: phaseData.completed_at ? new Date(phaseData.completed_at) : undefined,
      estimated_completion,
      blockers: blockers.length > 0 ? blockers : undefined
    };
  }

  /**
   * Calculer la progression d'une phase
   */
  private calculatePhaseProgress(phase: PhaseName, phaseData: any): number {
    const criteria: Record<PhaseName, string[]> = {
      preliminaire: ['motivations', 'attentes', 'objectifs', 'contexte'],
      investigation: ['tests_completed', 'competences_evaluated', 'pistes_identified'],
      conclusion: ['synthese_generated', 'projet_defined', 'plan_action_created'],
      suivi: ['entretien_completed', 'enquete_completed']
    };

    const phaseCriteria = criteria[phase];
    let completed = 0;

    phaseCriteria.forEach(criterion => {
      if (phaseData[criterion]) {
        completed++;
      }
    });

    return Math.round((completed / phaseCriteria.length) * 100);
  }

  /**
   * Détecter les blocages
   */
  private async detectBlockers(
    bilanId: string,
    phase: PhaseName,
    phaseData: any
  ): Promise<string[]> {
    const blockers: string[] = [];

    // Vérifier l'inactivité (pas d'activité depuis 7 jours)
    if (phaseData.last_activity) {
      const daysSinceActivity = this.daysBetween(
        new Date(phaseData.last_activity),
        new Date()
      );
      if (daysSinceActivity > 7) {
        blockers.push(`Aucune activité depuis ${daysSinceActivity} jours`);
      }
    }

    // Vérifier les dépendances
    if (phase === 'investigation') {
      // La phase préliminaire doit être complétée
      const { data: prelim } = await this.supabase
        .from('parcours_phases')
        .select('*')
        .eq('bilan_id', bilanId)
        .eq('phase', 'preliminaire')
        .single();

      if (!prelim || !prelim.completed_at) {
        blockers.push('Phase préliminaire non complétée');
      }
    }

    // Vérifier les documents manquants
    if (phase === 'conclusion') {
      const { data: documents } = await this.supabase
        .from('documents')
        .select('*')
        .eq('bilan_id', bilanId);

      if (!documents || documents.length === 0) {
        blockers.push('Documents obligatoires manquants');
      }
    }

    return blockers;
  }

  /**
   * Déterminer la phase actuelle
   */
  private determineCurrentPhase(phases: Record<PhaseName, PhaseProgress>): PhaseName {
    // Ordre des phases
    const phaseOrder: PhaseName[] = ['preliminaire', 'investigation', 'conclusion', 'suivi'];

    // Trouver la première phase non complétée
    for (const phaseName of phaseOrder) {
      if (phases[phaseName].status !== 'completed') {
        return phaseName;
      }
    }

    // Si toutes complétées, retourner la dernière
    return 'suivi';
  }

  /**
   * Calculer la progression totale
   */
  private calculateTotalProgress(phases: Record<PhaseName, PhaseProgress>): number {
    // Pondération des phases
    const weights = {
      preliminaire: 0.15,
      investigation: 0.50,
      conclusion: 0.25,
      suivi: 0.10
    };

    let totalProgress = 0;
    Object.entries(phases).forEach(([phase, progress]) => {
      totalProgress += progress.progress_percentage * weights[phase as PhaseName];
    });

    return Math.round(totalProgress);
  }

  /**
   * Vérifier si le parcours est dans les temps
   */
  private checkTimeline(bilan: any, phases: Record<PhaseName, PhaseProgress>): {
    is_on_track: boolean;
    delays_days?: number;
    estimated_end_date?: Date;
  } {
    const start_date = new Date(bilan.created_at);
    const today = new Date();
    const days_elapsed = this.daysBetween(start_date, today);

    // Durée standard d'un bilan : 24 heures réparties sur 8-12 semaines
    const standard_duration_days = 70; // 10 semaines
    const total_progress = this.calculateTotalProgress(phases);

    // Progression attendue
    const expected_progress = Math.min(100, (days_elapsed / standard_duration_days) * 100);

    // Calculer le retard
    const progress_gap = expected_progress - total_progress;
    const delays_days = Math.round((progress_gap / 100) * standard_duration_days);

    // Estimer la date de fin
    const remaining_progress = 100 - total_progress;
    const days_per_percent = days_elapsed / total_progress;
    const estimated_remaining_days = Math.round(remaining_progress * days_per_percent);
    const estimated_end_date = new Date(today);
    estimated_end_date.setDate(estimated_end_date.getDate() + estimated_remaining_days);

    return {
      is_on_track: delays_days <= 7, // Tolérance de 7 jours
      delays_days: delays_days > 0 ? delays_days : undefined,
      estimated_end_date
    };
  }

  /**
   * Générer des actions automatiques
   */
  async generateAutomationActions(state: ParcoursState): Promise<AutomationAction[]> {
    const actions: AutomationAction[] = [];

    // 1. Notifications de progression
    const currentPhase = state.phases[state.current_phase];
    if (currentPhase.status === 'in_progress' && currentPhase.progress_percentage >= 80) {
      actions.push({
        type: 'notification',
        priority: 'medium',
        recipient: 'beneficiaire',
        message: `Vous avez presque terminé la phase ${state.current_phase}. Plus que ${100 - currentPhase.progress_percentage}% !`,
        action_required: `Complétez les dernières étapes de la phase ${state.current_phase}`
      });
    }

    // 2. Rappels d'inactivité
    if (currentPhase.blockers?.some(b => b.includes('Aucune activité'))) {
      actions.push({
        type: 'reminder',
        priority: 'high',
        recipient: 'both',
        message: `Aucune activité détectée depuis plusieurs jours sur la phase ${state.current_phase}.`,
        action_required: 'Planifier un point avec le consultant'
      });
    }

    // 3. Escalation des blocages
    if (currentPhase.status === 'blocked') {
      actions.push({
        type: 'escalation',
        priority: 'urgent',
        recipient: 'consultant',
        message: `La phase ${state.current_phase} est bloquée : ${currentPhase.blockers?.join(', ')}`,
        action_required: 'Débloquer la situation'
      });
    }

    // 4. Alertes de retard
    if (!state.is_on_track && state.delays_days && state.delays_days > 14) {
      actions.push({
        type: 'email',
        priority: 'high',
        recipient: 'consultant',
        message: `Le bilan accuse un retard de ${state.delays_days} jours.`,
        action_required: 'Revoir le planning avec le bénéficiaire'
      });
    }

    // 5. Félicitations de complétion
    if (currentPhase.status === 'completed') {
      const nextPhase = this.getNextPhase(state.current_phase);
      if (nextPhase) {
        actions.push({
          type: 'notification',
          priority: 'medium',
          recipient: 'beneficiaire',
          message: `Félicitations ! Vous avez terminé la phase ${state.current_phase}. Vous pouvez maintenant passer à la phase ${nextPhase}.`,
          action_required: `Commencer la phase ${nextPhase}`
        });
      }
    }

    // 6. Rappel de suivi à 6 mois
    if (state.phases.conclusion.status === 'completed' && state.phases.suivi.status === 'not_started') {
      const conclusionDate = state.phases.conclusion.completed_at;
      if (conclusionDate) {
        const monthsSince = this.monthsBetween(conclusionDate, new Date());
        if (monthsSince >= 6) {
          actions.push({
            type: 'email',
            priority: 'high',
            recipient: 'both',
            message: `Il est temps de réaliser l'entretien de suivi à 6 mois.`,
            action_required: 'Planifier l\'entretien de suivi',
            due_date: new Date()
          });
        }
      }
    }

    return actions;
  }

  /**
   * Exécuter les actions automatiques
   */
  async executeAutomationActions(bilanId: string, actions: AutomationAction[]): Promise<void> {
    for (const action of actions) {
      // Enregistrer l'action en base de données
      await this.supabase
        .from('automation_actions')
        .insert({
          bilan_id: bilanId,
          type: action.type,
          priority: action.priority,
          recipient: action.recipient,
          message: action.message,
          action_required: action.action_required,
          due_date: action.due_date,
          status: 'pending',
          created_at: new Date().toISOString()
        });

      // Exécuter l'action selon son type
      switch (action.type) {
        case 'notification':
          await this.sendNotification(bilanId, action);
          break;
        case 'email':
          await this.sendEmail(bilanId, action);
          break;
        case 'reminder':
          await this.sendReminder(bilanId, action);
          break;
        case 'escalation':
          await this.escalate(bilanId, action);
          break;
        case 'task':
          await this.createTask(bilanId, action);
          break;
      }
    }
  }

  /**
   * Envoyer une notification
   */
  private async sendNotification(bilanId: string, action: AutomationAction): Promise<void> {
    // Créer une notification dans la table notifications
    await this.supabase
      .from('notifications')
      .insert({
        bilan_id: bilanId,
        recipient: action.recipient,
        title: 'Notification de parcours',
        message: action.message,
        priority: action.priority,
        read: false,
        created_at: new Date().toISOString()
      });
  }

  /**
   * Envoyer un email
   */
  private async sendEmail(bilanId: string, action: AutomationAction): Promise<void> {
    // TODO: Intégrer avec un service d'email (SendGrid, Mailgun, etc.)
    console.log(`Email à envoyer pour bilan ${bilanId}:`, action.message);
  }

  /**
   * Envoyer un rappel
   */
  private async sendReminder(bilanId: string, action: AutomationAction): Promise<void> {
    await this.sendNotification(bilanId, { ...action, type: 'notification' });
  }

  /**
   * Escalader un problème
   */
  private async escalate(bilanId: string, action: AutomationAction): Promise<void> {
    await this.sendEmail(bilanId, action);
    await this.sendNotification(bilanId, { ...action, type: 'notification' });
  }

  /**
   * Créer une tâche
   */
  private async createTask(bilanId: string, action: AutomationAction): Promise<void> {
    await this.supabase
      .from('tasks')
      .insert({
        bilan_id: bilanId,
        title: action.action_required || 'Tâche',
        description: action.message,
        priority: action.priority,
        due_date: action.due_date,
        status: 'pending',
        created_at: new Date().toISOString()
      });
  }

  // ============================================================================
  // HELPERS
  // ============================================================================

  private getNextPhase(current: PhaseName): PhaseName | null {
    const order: PhaseName[] = ['preliminaire', 'investigation', 'conclusion', 'suivi'];
    const currentIndex = order.indexOf(current);
    return currentIndex < order.length - 1 ? order[currentIndex + 1] : null;
  }

  private daysBetween(date1: Date, date2: Date): number {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private monthsBetween(date1: Date, date2: Date): number {
    return (
      (date2.getFullYear() - date1.getFullYear()) * 12 +
      (date2.getMonth() - date1.getMonth())
    );
  }

  private estimateCompletion(phase: PhaseName, progress: number): Date {
    const durations: Record<PhaseName, number> = {
      preliminaire: 7,    // 1 semaine
      investigation: 42,  // 6 semaines
      conclusion: 14,     // 2 semaines
      suivi: 1            // 1 jour
    };

    const totalDays = durations[phase];
    const remainingProgress = 100 - progress;
    const remainingDays = Math.round((remainingProgress / 100) * totalDays);

    const estimated = new Date();
    estimated.setDate(estimated.getDate() + remainingDays);
    return estimated;
  }
}

// ============================================================================
// EXPORT DE L'INSTANCE SINGLETON
// ============================================================================

export const parcoursEngine = new ParcoursEngine();

