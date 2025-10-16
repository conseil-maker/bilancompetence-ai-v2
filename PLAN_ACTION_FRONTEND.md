# 🎯 Plan d'Action Frontend - Développement Priorisé

**Date** : 17 octobre 2025
**Objectif** : Développer les 44 pages et composants manquants de manière structurée

## Stratégie de Développement

### Approche : Bottom-Up (Composants → Pages)

1. **Créer les composants réutilisables** d'abord
2. **Assembler les pages** en utilisant ces composants
3. **Tester et optimiser** au fur et à mesure

### Priorisation : 3 Vagues

- **Vague 1 (Critique)** : Fonctionnalités essentielles pour l'utilisation de base
- **Vague 2 (Important)** : Fonctionnalités pour une expérience complète
- **Vague 3 (Moyen)** : Fonctionnalités d'amélioration et de confort

---

## 🔴 VAGUE 1 : FONCTIONNALITÉS CRITIQUES (Priorité Maximale)

### Phase 1.1 : Composants de Base (6 composants)

| # | Composant | Fichier | Estimation |
|---|-----------|---------|:----------:|
| 1 | `BilanCard` | `/src/components/bilans/BilanCard.tsx` | 2h |
| 2 | `MessageThread` | `/src/components/messages/MessageThread.tsx` | 3h |
| 3 | `RdvCalendar` | `/src/components/rdv/RdvCalendar.tsx` | 4h |
| 4 | `PlanActionCard` | `/src/components/plan-action/PlanActionCard.tsx` | 2h |
| 5 | `KanbanBoard` | `/src/components/plan-action/KanbanBoard.tsx` | 4h |
| 6 | `FileUploader` | `/src/components/common/FileUploader.tsx` | 2h |

**Total Phase 1.1 : 17h**

### Phase 1.2 : Pages Bénéficiaire Critiques (4 pages)

| # | Page | Route | Estimation |
|---|------|-------|:----------:|
| 1 | Profil | `/profil/page.tsx` | 2h |
| 2 | Messages | `/messages/page.tsx` | 3h |
| 3 | RDV | `/rdv/page.tsx` | 3h |
| 4 | Plan d'Action | `/plan-action/page.tsx` | 3h |

**Total Phase 1.2 : 11h**

### Phase 1.3 : Pages Consultant Critiques (5 pages)

| # | Page | Route | Estimation |
|---|------|-------|:----------:|
| 1 | Détail Bilan | `/bilans/[id]/page.tsx` | 4h |
| 2 | Messages | `/messages/page.tsx` | 2h |
| 3 | RDV | `/rdv/page.tsx` | 2h |
| 4 | Plan d'Action Bilan | `/bilans/[id]/plan-action/page.tsx` | 3h |
| 5 | Génération Synthèse | `/bilans/[id]/synthese/page.tsx` | 3h |

**Total Phase 1.3 : 14h**

### Phase 1.4 : Pages Administrateur Critiques (2 pages)

| # | Page | Route | Estimation |
|---|------|-------|:----------:|
| 1 | Liste Bilans | `/bilans/page.tsx` | 3h |
| 2 | Qualiopi Dashboard | `/qualiopi/page.tsx` | 4h |

**Total Phase 1.4 : 7h**

**🔴 TOTAL VAGUE 1 : 49h (≈ 6 jours)**

---

## 🟠 VAGUE 2 : FONCTIONNALITÉS IMPORTANTES (Priorité Haute)

### Phase 2.1 : Composants Métier (6 composants)

| # | Composant | Fichier | Estimation |
|---|-----------|---------|:----------:|
| 1 | `CompetenceCard` | `/src/components/competences/CompetenceCard.tsx` | 2h |
| 2 | `ExperienceCard` | `/src/components/experiences/ExperienceCard.tsx` | 2h |
| 3 | `PisteMetierCard` | `/src/components/pistes-metiers/PisteMetierCard.tsx` | 2h |
| 4 | `FormationCard` | `/src/components/formations/FormationCard.tsx` | 2h |
| 5 | `TestCard` | `/src/components/tests/TestCard.tsx` | 2h |
| 6 | `StatsCard` | `/src/components/stats/StatsCard.tsx` | 2h |

**Total Phase 2.1 : 12h**

### Phase 2.2 : Pages Bénéficiaire Importantes (4 pages)

| # | Page | Route | Estimation |
|---|------|-------|:----------:|
| 1 | Compétences | `/competences/page.tsx` | 3h |
| 2 | Expériences | `/experiences/page.tsx` | 3h |
| 3 | Pistes Métiers | `/pistes-metiers/page.tsx` | 3h |
| 4 | Formations | `/formations/page.tsx` | 3h |

**Total Phase 2.2 : 12h**

### Phase 2.3 : Pages Consultant Importantes (4 pages)

| # | Page | Route | Estimation |
|---|------|-------|:----------:|
| 1 | Profil | `/profil/page.tsx` | 2h |
| 2 | Compétences Bilan | `/bilans/[id]/competences/page.tsx` | 3h |
| 3 | Pistes Métiers Bilan | `/bilans/[id]/pistes-metiers/page.tsx` | 3h |
| 4 | Enquêtes | `/enquetes/page.tsx` | 3h |

**Total Phase 2.3 : 11h**

### Phase 2.4 : Pages Administrateur Importantes (5 pages)

| # | Page | Route | Estimation |
|---|------|-------|:----------:|
| 1 | Statistiques | `/statistiques/page.tsx` | 4h |
| 2 | Resources | `/resources/page.tsx` | 3h |
| 3 | Enquêtes Qualiopi | `/qualiopi/enquetes/page.tsx` | 3h |
| 4 | Réclamations | `/qualiopi/reclamations/page.tsx` | 3h |
| 5 | Veille | `/qualiopi/veille/page.tsx` | 3h |

**Total Phase 2.4 : 16h**

**🟠 TOTAL VAGUE 2 : 51h (≈ 6 jours)**

---

## 🟡 VAGUE 3 : FONCTIONNALITÉS MOYENNES (Priorité Normale)

### Phase 3.1 : Composants Complémentaires (3 composants)

| # | Composant | Fichier | Estimation |
|---|-----------|---------|:----------:|
| 1 | `NotificationList` | `/src/components/notifications/NotificationList.tsx` | 2h |
| 2 | `BilanStatusBadge` | `/src/components/bilans/BilanStatusBadge.tsx` | 1h |
| 3 | `DocumentViewer` | `/src/components/documents/DocumentViewer.tsx` | 3h |

**Total Phase 3.1 : 6h**

### Phase 3.2 : Pages Complémentaires (4 pages)

| # | Page | Route | Estimation |
|---|------|-------|:----------:|
| 1 | Resources Bénéficiaire | `/resources/page.tsx` | 2h |
| 2 | Notifications | `/notifications/page.tsx` | 2h |
| 3 | Réclamations Consultant | `/reclamations/page.tsx` | 2h |
| 4 | Formations Consultants | `/qualiopi/formations-consultants/page.tsx` | 3h |

**Total Phase 3.2 : 9h**

### Phase 3.3 : Pages Audit (1 page)

| # | Page | Route | Estimation |
|---|------|-------|:----------:|
| 1 | Journal d'Audit | `/audit/page.tsx` | 3h |

**Total Phase 3.3 : 3h**

**🟡 TOTAL VAGUE 3 : 18h (≈ 2 jours)**

---

## 📊 RÉCAPITULATIF GLOBAL

| Vague | Composants | Pages | Temps Total | Durée |
|-------|:----------:|:-----:|:-----------:|:-----:|
| **🔴 Vague 1 (Critique)** | 6 | 11 | **49h** | **6 jours** |
| **🟠 Vague 2 (Important)** | 6 | 13 | **51h** | **6 jours** |
| **🟡 Vague 3 (Moyen)** | 3 | 5 | **18h** | **2 jours** |
| **TOTAL** | **15** | **29** | **118h** | **≈ 15 jours** |

---

## 🚀 RECOMMANDATION

**Commencer par la Vague 1** qui permettra d'avoir une application fonctionnelle avec les fonctionnalités essentielles :
- Gestion des bilans
- Messagerie
- RDV
- Plan d'action
- Conformité Qualiopi de base

Une fois la Vague 1 terminée, l'application sera **utilisable en production** pour les 3 types d'utilisateurs, même si certaines fonctionnalités avancées manquent encore.

**Souhaitez-vous que je commence le développement de la Vague 1 ?**

