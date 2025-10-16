import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialiser le client Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Client Gemini compatible avec l'interface OpenAI
 * Permet de remplacer OpenAI par Gemini sans changer le code existant
 */
export class GeminiClient {
  private model: string;

  constructor(model: string = 'gemini-1.5-flash') {
    this.model = model;
  }

  /**
   * Générer du contenu avec Gemini (compatible avec OpenAI chat.completions.create)
   */
  async generateContent(params: {
    messages: Array<{ role: string; content: string }>;
    temperature?: number;
    maxTokens?: number;
  }): Promise<{
    content: string;
    usage?: {
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
    };
  }> {
    try {
      const model = genAI.getGenerativeModel({ model: this.model });

      // Convertir les messages OpenAI en format Gemini
      const prompt = this.convertMessagesToPrompt(params.messages);

      // Générer le contenu
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: params.temperature || 0.7,
          maxOutputTokens: params.maxTokens || 2048,
        },
      });

      const response = result.response;
      const text = response.text();

      // Estimer l'usage des tokens (Gemini ne fournit pas toujours ces infos)
      const usage = {
        promptTokens: this.estimateTokens(prompt),
        completionTokens: this.estimateTokens(text),
        totalTokens: this.estimateTokens(prompt) + this.estimateTokens(text),
      };

      return {
        content: text,
        usage,
      };
    } catch (error) {
      console.error('Erreur Gemini:', error);
      throw new Error(`Erreur lors de la génération avec Gemini: ${error}`);
    }
  }

  /**
   * Convertir les messages OpenAI en un prompt Gemini
   */
  private convertMessagesToPrompt(
    messages: Array<{ role: string; content: string }>
  ): string {
    return messages
      .map((msg) => {
        if (msg.role === 'system') {
          return `Instructions système:\n${msg.content}\n`;
        } else if (msg.role === 'user') {
          return `Utilisateur:\n${msg.content}\n`;
        } else if (msg.role === 'assistant') {
          return `Assistant:\n${msg.content}\n`;
        }
        return msg.content;
      })
      .join('\n');
  }

  /**
   * Estimer le nombre de tokens (approximation)
   * Gemini utilise ~4 caractères par token en moyenne
   */
  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }

  /**
   * Générer du contenu en streaming (pour les futures implémentations)
   */
  async *generateContentStream(params: {
    messages: Array<{ role: string; content: string }>;
    temperature?: number;
    maxTokens?: number;
  }): AsyncGenerator<string> {
    try {
      const model = genAI.getGenerativeModel({ model: this.model });
      const prompt = this.convertMessagesToPrompt(params.messages);

      const result = await model.generateContentStream({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: params.temperature || 0.7,
          maxOutputTokens: params.maxTokens || 2048,
        },
      });

      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) {
          yield text;
        }
      }
    } catch (error) {
      console.error('Erreur Gemini streaming:', error);
      throw new Error(`Erreur lors du streaming avec Gemini: ${error}`);
    }
  }
}

/**
 * Instance par défaut du client Gemini
 */
export const geminiClient = new GeminiClient('gemini-1.5-flash');

/**
 * Instance Gemini Pro pour les tâches complexes
 */
export const geminiProClient = new GeminiClient('gemini-1.5-pro');

/**
 * Fonction helper pour générer du contenu rapidement
 */
export async function generateWithGemini(
  prompt: string,
  options?: {
    temperature?: number;
    maxTokens?: number;
    model?: 'flash' | 'pro';
  }
): Promise<string> {
  const client = options?.model === 'pro' ? geminiProClient : geminiClient;

  const result = await client.generateContent({
    messages: [{ role: 'user', content: prompt }],
    temperature: options?.temperature,
    maxTokens: options?.maxTokens,
  });

  return result.content;
}

