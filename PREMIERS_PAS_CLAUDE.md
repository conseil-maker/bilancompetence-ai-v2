# 🚀 Premiers Pas - Claude Haiku 4.5

Bienvenue sur le projet **BilanCompetence.AI v2** !

## 📖 Commencer

### 1. Lire le Rapport de Transfert
👉 **`RAPPORT_TRANSFERT_CLAUDE.md`** - Contient toutes les informations essentielles

### 2. Cloner le Projet
```bash
git clone https://github.com/conseil-maker/bilancompetence-ai-v2.git
cd bilancompetence-ai-v2
```

### 3. Installer les Dépendances
```bash
pnpm install
```

### 4. Configurer les Variables d'Environnement
Créer un fichier `.env.local` :
```env
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[SERVICE_ROLE_KEY]
GOOGLE_GENERATIVE_AI_API_KEY=[GEMINI_API_KEY]
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

⚠️ **Demander ces clés à l'utilisateur**

### 5. Lancer le Serveur de Développement
```bash
pnpm dev
```

L'application sera accessible sur http://localhost:3000

---

## 🎯 Prochaines Étapes Recommandées

### Étape 1 : Déploiement Supabase
1. Créer un projet Supabase (si pas déjà fait)
2. Exécuter les migrations :
   ```bash
   supabase migration up
   ```
3. Vérifier que les 22 tables sont créées

### Étape 2 : Déploiement Vercel
1. Connecter le dépôt GitHub à Vercel
2. Configurer les variables d'environnement
3. Déployer

Voir **`GUIDE_DEPLOIEMENT.md`** pour les détails complets.

---

## 📚 Documentation Clé

| Document | Description |
|----------|-------------|
| `RAPPORT_TRANSFERT_CLAUDE.md` | **Rapport complet de transfert** |
| `GUIDE_DEPLOIEMENT.md` | Guide de déploiement Vercel + Supabase |
| `DATABASE_UPDATED.md` | Documentation de la base de données |
| `FLUX_BDD_BACKEND.md` | Architecture des flux de données |

---

## 🛠️ Commandes Utiles

```bash
# Développement
pnpm dev              # Lancer le serveur de dev
pnpm build            # Builder l'application
pnpm start            # Lancer en mode production

# Git
git status            # Voir l'état
git add .             # Ajouter tous les fichiers
git commit -m "msg"   # Commiter
git push              # Pousser sur GitHub

# Supabase
supabase migration up # Exécuter les migrations
```

---

## ✅ État Actuel

- ✅ Build réussi (48 pages + 28 API routes)
- ✅ Base de données complète (22 tables)
- ✅ Backend 100% fonctionnel
- ✅ Frontend 95% complet
- ⏳ Déploiement en attente

---

**Bon courage ! Le projet est en excellent état. 🎉**

