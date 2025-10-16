#!/bin/bash

# Remplacer OpenAI par Gemini dans tous les fichiers
find src/lib/ai -name "*.ts" -type f -exec sed -i \
  -e "s/import OpenAI from 'openai';/import { geminiClient } from '.\/gemini-client';/g" \
  -e "s/const openai = new OpenAI({/\/\/ Utilisation de Gemini au lieu d'OpenAI\n\/\/ const openai = new OpenAI({/g" \
  -e "s/apiKey: process.env.OPENAI_API_KEY,/\/\/ apiKey: process.env.OPENAI_API_KEY,/g" \
  -e "s/});/\/\/ });/g" \
  {} \;

echo "✅ Migration vers Gemini terminée"
