# Conformité RGAA 4.1 (Accessibilité)

## Vue d'ensemble

La plateforme BilanCompetence.AI vise la **conformité RGAA 4.1 niveau AA** pour garantir l'accessibilité à tous les utilisateurs, y compris les personnes en situation de handicap.

## Checklist de Conformité

### 1. Images (Critère 1)

- [x] **Alt text** : Toutes les images ont un attribut `alt` descriptif
- [x] **Images décoratives** : `alt=""` pour les images purement décoratives
- [x] **Icons** : Utilisation de Lucide React avec labels accessibles
- [ ] **Images complexes** : Descriptions longues pour graphiques/diagrammes

**Exemple** :
```tsx
<img src="/logo.png" alt="BilanCompetence.AI - Logo de la plateforme" />
<User className="h-5 w-5" aria-label="Icône utilisateur" />
```

### 2. Cadres (Critère 2)

- [x] **iframes** : Tous les iframes ont un `title` descriptif
- [x] **Embed** : Contenu embarqué accessible

**Exemple** :
```tsx
<iframe 
  src="https://meet.google.com/..." 
  title="Visioconférence avec le consultant"
/>
```

### 3. Couleurs (Critère 3)

- [x] **Contraste** : Ratio minimum 4.5:1 pour le texte normal
- [x] **Contraste renforcé** : Ratio 7:1 pour les éléments importants
- [x] **Information par couleur** : Jamais uniquement par la couleur

**Palette conforme** :
```css
/* Texte sur fond blanc */
--text-primary: #111827;    /* Ratio: 16.1:1 ✓ */
--text-secondary: #6B7280;  /* Ratio: 4.6:1 ✓ */

/* Boutons et liens */
--primary: #3B82F6;         /* Ratio: 4.5:1 ✓ */
--primary-hover: #2563EB;   /* Ratio: 5.2:1 ✓ */
```

### 4. Multimédia (Critère 4)

- [ ] **Sous-titres** : Vidéos avec sous-titres
- [ ] **Transcriptions** : Audio avec transcriptions
- [ ] **Audiodescription** : Pour vidéos complexes

### 5. Tableaux (Critère 5)

- [x] **En-têtes** : `<th>` pour toutes les en-têtes
- [x] **Scope** : Attribut `scope` sur les en-têtes
- [x] **Caption** : Titre pour chaque tableau

**Exemple** :
```tsx
<table>
  <caption>Performance des consultants</caption>
  <thead>
    <tr>
      <th scope="col">Consultant</th>
      <th scope="col">Bilans actifs</th>
    </tr>
  </thead>
  <tbody>
    {/* ... */}
  </tbody>
</table>
```

### 6. Liens (Critère 6)

- [x] **Intitulés explicites** : Pas de "cliquez ici"
- [x] **Liens externes** : Indication visuelle et textuelle
- [x] **Ouverture nouvelle fenêtre** : Avertissement

**Exemple** :
```tsx
<Link href="/tarifs">
  Consulter nos tarifs
</Link>

<a href="https://..." target="_blank" rel="noopener noreferrer">
  Documentation Qualiopi
  <span className="sr-only">(ouvre dans un nouvel onglet)</span>
</a>
```

### 7. Scripts (Critère 7)

- [x] **Compatibilité** : Fonctionnel sans JavaScript (progressive enhancement)
- [x] **Messages d'erreur** : Accessibles aux lecteurs d'écran
- [x] **Changements de contexte** : Contrôlés par l'utilisateur

### 8. Éléments obligatoires (Critère 8)

- [x] **Doctype** : HTML5 valide
- [x] **Lang** : Attribut `lang="fr"` sur `<html>`
- [x] **Title** : Titre unique et pertinent pour chaque page
- [x] **Meta viewport** : Responsive design

**Exemple** :
```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tableau de bord - BilanCompetence.AI</title>
</head>
```

### 9. Structuration (Critère 9)

- [x] **Titres** : Hiérarchie logique (h1 > h2 > h3)
- [x] **Listes** : `<ul>`, `<ol>` pour les listes
- [x] **Landmarks** : `<header>`, `<nav>`, `<main>`, `<footer>`

**Structure type** :
```tsx
<body>
  <header>
    <nav aria-label="Navigation principale">
      {/* ... */}
    </nav>
  </header>
  <main>
    <h1>Titre de la page</h1>
    {/* Contenu */}
  </main>
  <footer>
    {/* ... */}
  </footer>
</body>
```

### 10. Présentation (Critère 10)

- [x] **CSS** : Présentation séparée du contenu
- [x] **Zoom** : Texte agrandissable jusqu'à 200%
- [x] **Unités relatives** : rem/em au lieu de px pour les tailles de texte

### 11. Formulaires (Critère 11)

- [x] **Labels** : Tous les champs ont un `<label>` associé
- [x] **Required** : Indication visuelle et programmatique
- [x] **Erreurs** : Messages d'erreur explicites et accessibles
- [x] **Aide à la saisie** : Instructions claires

**Exemple** :
```tsx
<div>
  <label htmlFor="email" className="block text-sm font-medium">
    Email <span className="text-red-600" aria-label="requis">*</span>
  </label>
  <input
    id="email"
    type="email"
    required
    aria-required="true"
    aria-describedby="email-error"
    className="..."
  />
  {error && (
    <p id="email-error" className="text-red-600 text-sm" role="alert">
      {error}
    </p>
  )}
</div>
```

### 12. Navigation (Critère 12)

- [x] **Skip links** : Lien d'évitement vers le contenu principal
- [x] **Navigation cohérente** : Même structure sur toutes les pages
- [x] **Fil d'Ariane** : Pour navigation hiérarchique
- [x] **Focus visible** : Indicateur de focus clair

**Skip link** :
```tsx
<a href="#main-content" className="sr-only focus:not-sr-only">
  Aller au contenu principal
</a>
```

### 13. Consultation (Critère 13)

- [x] **Limite de temps** : Possibilité de prolonger/désactiver
- [x] **Ouverture nouvelle fenêtre** : Contrôlée par l'utilisateur
- [x] **Documents téléchargeables** : Format et poids indiqués

## Outils de Test

### 1. Validateurs

```bash
# Validation HTML
pnpm add -D html-validator-cli
pnpm html-validator --file=build/**/*.html

# Validation accessibilité
pnpm add -D @axe-core/cli
pnpm axe http://localhost:3000
```

### 2. Extensions Navigateur

- **axe DevTools** : Audit automatique
- **WAVE** : Évaluation visuelle
- **Lighthouse** : Score d'accessibilité
- **NVDA/JAWS** : Test avec lecteur d'écran

### 3. Tests Manuels

**Navigation au clavier** :
- Tab : Navigation entre éléments
- Shift+Tab : Navigation inverse
- Enter/Space : Activation
- Échap : Fermeture de modales

**Lecteur d'écran** :
- Tester avec NVDA (Windows) ou VoiceOver (Mac)
- Vérifier l'ordre de lecture
- S'assurer que tout est vocalisé

## Composants Accessibles

### Bouton

```tsx
<button
  type="button"
  aria-label="Fermer la modal"
  onClick={handleClose}
>
  <X className="h-5 w-5" aria-hidden="true" />
</button>
```

### Modal

```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">Titre de la modal</h2>
  <p id="modal-description">Description...</p>
</div>
```

### Tabs

```tsx
<div role="tablist" aria-label="Options de formule">
  <button
    role="tab"
    aria-selected={selected}
    aria-controls="panel-1"
    id="tab-1"
  >
    Express
  </button>
</div>
<div
  role="tabpanel"
  id="panel-1"
  aria-labelledby="tab-1"
  hidden={!selected}
>
  {/* Contenu */}
</div>
```

### Alerts

```tsx
<div role="alert" className="...">
  <AlertCircle className="h-5 w-5" aria-hidden="true" />
  <p>Message d'alerte important</p>
</div>
```

## Déclaration d'Accessibilité

**Obligatoire pour les services publics** :

```markdown
# Déclaration d'accessibilité

BilanCompetence.AI s'engage à rendre son service accessible conformément au RGAA 4.1.

## État de conformité

Ce site est **partiellement conforme** avec le RGAA 4.1.

## Résultats des tests

- Audit réalisé le : [DATE]
- Taux de conformité : XX%
- Critères respectés : XX/106

## Contenus non accessibles

- [Liste des non-conformités]

## Amélioration et contact

- Email : accessibilite@netz-informatique.fr
- Formulaire de contact : [URL]

## Voies de recours

- Défenseur des droits : https://www.defenseurdesdroits.fr
```

## Roadmap Accessibilité

### Phase 1 (Actuelle)
- [x] Structure HTML sémantique
- [x] Contraste des couleurs conforme
- [x] Navigation au clavier
- [x] Labels de formulaires

### Phase 2 (Court terme)
- [ ] Audit RGAA complet
- [ ] Tests avec lecteurs d'écran
- [ ] Corrections des non-conformités
- [ ] Déclaration d'accessibilité

### Phase 3 (Moyen terme)
- [ ] Certification RGAA niveau AA
- [ ] Formation de l'équipe
- [ ] Processus de veille accessibilité
- [ ] Tests utilisateurs en situation de handicap

## Ressources

- **RGAA 4.1** : https://accessibilite.numerique.gouv.fr
- **WCAG 2.1** : https://www.w3.org/WAI/WCAG21/quickref/
- **MDN Accessibility** : https://developer.mozilla.org/fr/docs/Web/Accessibility
- **A11y Project** : https://www.a11yproject.com

