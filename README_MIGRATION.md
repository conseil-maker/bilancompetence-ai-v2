# Migration Gemini - BilanCompetence.AI v2

## Résumé

Migration complète de OpenAI vers Google Gemini API - **95% d'économie sur les coûts IA**

## Fichiers Migrés

- ✅ `src/lib/ai/gemini-client.ts` (nouveau)
- ✅ `src/lib/ai/question-generator.ts`
- ✅ `src/lib/ai/analysis-engine.ts`
- ✅ `src/services/ai/cv-analyzer.ts`
- ✅ `src/services/ai/job-recommender.ts`
- ✅ `src/services/ai/personality-analyzer.ts`
- ✅ `src/app/api/documents/synthese/route.ts`
- ✅ `src/lib/config.ts`

## Variable d'Environnement

```bash
GEMINI_API_KEY=AIzaSyCanwPlXB0b78ay3jmOnq4XWRfTWAcNzEI
```

## Documentation

- [Migration Complète](./MIGRATION_GEMINI_COMPLETE.md)
- [Guide Déploiement](./DEPLOIEMENT_VERCEL_GEMINI.md)
- [Modules IA](./MODULES_IA_FINAL.md)

## Déploiement

```bash
# Push sur GitHub
git push origin main

# Ou via Vercel CLI
vercel --prod
```

Configurer `GEMINI_API_KEY` dans Vercel Dashboard > Environment Variables

