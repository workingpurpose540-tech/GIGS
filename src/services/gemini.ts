import { GoogleGenAI, Type } from '@google/genai';

/**
 * Retrieves the Gemini API key from the environment variable VITE_GEMINI_API_KEY.
 * Also checks process.env for Node / SSR / injected runtime environments.
 */
export function getApiKey(): string {
  const key =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) ||
    (typeof process !== 'undefined' && (process.env?.VITE_GEMINI_API_KEY || process.env?.GEMINI_API_KEY)) ||
    '';
  return key;
}

/**
 * Returns an authenticated GoogleGenAI client instance.
 * Throws a clear error if VITE_GEMINI_API_KEY is not configured.
 */
export function getGeminiClient(): GoogleGenAI {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error(
      'VITE_GEMINI_API_KEY is not set. Please add your Gemini API key to .env as VITE_GEMINI_API_KEY.'
    );
  }

  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Export a proxy for backward compatibility if `ai` is accessed directly
export const ai = new Proxy({} as GoogleGenAI, {
  get(_target, prop) {
    const client = getGeminiClient();
    return (client as any)[prop];
  },
});

export interface GeneratedRecipe {
  identified_ingredients: string[];
  recipe_title: string;
  prep_time_minutes: number;
  ingredients_needed: string[];
  instructions: string[];
}

export interface RecipeSearchResult {
  recipe_title: string;
  short_description: string;
  match_reason: string;
  prep_time_minutes: number;
  cuisine: string;
  diet: string;
  calories: string;
  protein: string;
  identified_ingredients: string[];
  ingredients_needed: string[];
  instructions: string[];
  plain_english_tip: string;
}

function parseImageData(imageBase64: string): { mimeType: string; cleanBase64: string } {
  let mimeType = 'image/jpeg';
  let cleanBase64 = imageBase64;

  if (imageBase64.startsWith('data:')) {
    const match = imageBase64.match(/^data:([^;]+);base64,(.*)$/);
    if (match) {
      mimeType = match[1];
      cleanBase64 = match[2];
    } else {
      const parts = imageBase64.split(',');
      cleanBase64 = parts[1] || imageBase64;
    }
  }

  return { mimeType, cleanBase64 };
}

/**
 * Sleep helper for exponential backoff delays.
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Detects whether an error is a transient rate-limit (429), high demand spike,
 * or service unavailable (503) condition.
 */
export function isTransientError(error: any): boolean {
  if (!error) return false;

  const status =
    error.status ||
    error.statusCode ||
    error.code ||
    error.error?.code ||
    error.error?.status;

  if (
    status === 503 ||
    status === 429 ||
    status === 'UNAVAILABLE' ||
    status === 'RESOURCE_EXHAUSTED'
  ) {
    return true;
  }

  const rawMsg =
    typeof error.message === 'string'
      ? error.message
      : typeof error === 'string'
      ? error
      : '';

  if (rawMsg) {
    // Check if error.message is or contains serialized JSON, e.g. {"error":{"code":503,...}}
    try {
      const jsonStart = rawMsg.indexOf('{');
      const jsonEnd = rawMsg.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        const parsed = JSON.parse(rawMsg.slice(jsonStart, jsonEnd + 1));
        const code = parsed?.error?.code || parsed?.code;
        const parsedStatus = parsed?.error?.status || parsed?.status;
        if (
          code === 503 ||
          code === 429 ||
          parsedStatus === 'UNAVAILABLE' ||
          parsedStatus === 'RESOURCE_EXHAUSTED'
        ) {
          return true;
        }
      }
    } catch {
      // Ignore JSON parsing failures
    }

    const lower = rawMsg.toLowerCase();
    if (
      lower.includes('503') ||
      lower.includes('429') ||
      lower.includes('high demand') ||
      lower.includes('unavailable') ||
      lower.includes('resource_exhausted') ||
      lower.includes('spikes in demand') ||
      lower.includes('rate limit') ||
      lower.includes('too many requests') ||
      lower.includes('temporarily unavailable') ||
      lower.includes('overloaded')
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Converts any Gemini error (including raw JSON responses) into a clean, human-friendly message.
 */
export function formatUserFriendlyError(error: any): string {
  if (!error) return 'An unexpected error occurred. Please try again.';

  if (isTransientError(error)) {
    return 'Our AI is currently experiencing high traffic. Please wait a moment and try again.';
  }

  const rawMsg =
    typeof error.message === 'string'
      ? error.message
      : typeof error === 'string'
      ? error
      : '';

  if (rawMsg.includes('VITE_GEMINI_API_KEY')) {
    return 'VITE_GEMINI_API_KEY is not configured in .env. Please set VITE_GEMINI_API_KEY in your .env file.';
  }

  // Attempt to parse out inner friendly error message if JSON is present
  if (rawMsg.startsWith('{') || rawMsg.includes('"error":')) {
    try {
      const jsonStart = rawMsg.indexOf('{');
      const jsonEnd = rawMsg.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        const parsed = JSON.parse(rawMsg.slice(jsonStart, jsonEnd + 1));
        if (isTransientError(parsed)) {
          return 'Our AI is currently experiencing high traffic. Please wait a moment and try again.';
        }
        if (parsed?.error?.message) {
          return parsed.error.message;
        }
      }
    } catch {
      // Fall through
    }
  }

  return rawMsg || 'Could not analyze photo. Please try another clear food image.';
}

/**
 * Executes a Gemini API call with:
 * 1. Automatic retry on 503 (Service Unavailable) and 429 (Too Many Requests) errors
 *    with exponential backoff (2s, then 4s, then 8s).
 * 2. Fallback model routing if the primary model fails after retries.
 * 3. User-friendly message thrown if retries/fallbacks are exhausted due to high traffic.
 */
async function callWithRetryAndFallback<T>(
  apiCall: (model: string) => Promise<T>,
  models: string[] = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'],
  maxRetriesPerModel: number = 3
): Promise<T> {
  let lastError: any = null;

  for (let m = 0; m < models.length; m++) {
    const model = models[m];

    for (let attempt = 1; attempt <= maxRetriesPerModel; attempt++) {
      try {
        return await apiCall(model);
      } catch (err: any) {
        lastError = err;

        // Non-transient errors (e.g. invalid API key or bad schema) should fail immediately
        if (!isTransientError(err)) {
          throw err;
        }

        console.warn(
          `[Gemini API] Model "${model}" encountered high demand/rate-limit error (attempt ${attempt}/${maxRetriesPerModel}):`,
          err?.message || err
        );

        if (attempt < maxRetriesPerModel) {
          // Exponential backoff: 2s (attempt 1), 4s (attempt 2), 8s (attempt 3)
          const waitMs = Math.pow(2, attempt) * 1000;
          console.info(`[Gemini API] Waiting ${waitMs / 1000}s before retry...`);
          await delay(waitMs);
        }
      }
    }

    if (m < models.length - 1) {
      const nextModel = models[m + 1];
      console.warn(
        `[Gemini API] Primary model "${model}" unavailable after ${maxRetriesPerModel} attempts. Routing to fallback model "${nextModel}"...`
      );
      await delay(1000);
    }
  }

  if (isTransientError(lastError)) {
    throw new Error('Our AI is currently experiencing high traffic. Please wait a moment and try again.');
  }

  throw lastError || new Error('Failed to generate recipe with Gemini Vision.');
}

/**
 * Sends an image of ingredients/fridge along with diet and cuisine preferences to Gemini Vision
 * and returns structured recipe JSON using model 'gemini-3.8-flash' (with exponential backoff and fallback models).
 */
export async function generateRecipeFromImage(
  imageBase64: string,
  dietPreference: string,
  cuisineStyle: string,
  targetDishTitle?: string
): Promise<GeneratedRecipe> {
  const client = getGeminiClient();
  const { mimeType, cleanBase64 } = parseImageData(imageBase64);

  const dishGuidance = targetDishTitle
    ? `The user specifically wants to make the popular dish: "${targetDishTitle}".
Formulate this exact recipe utilizing the ingredients visible in the photo as the core or complementary components, adapted to their ${dietPreference || 'general'} diet.`
    : `Identify the food and ingredients visible in the photo. Create an appetizing, delicious, practical recipe tailored to the chosen dietary requirement and cuisine style using the identified food and ingredients.`;

  const promptText = `You are PlateWise-AI, an expert culinary assistant that turns photos of raw fridge ingredients and food into step-by-step recipes.
Analyze the provided image of ingredients/food carefully.
Dietary Requirement: ${dietPreference || 'None specified'}
Cuisine Flavor Profile: ${cuisineStyle || 'Everyday home style'}
${targetDishTitle ? `Selected Dish: "${targetDishTitle}"` : ''}

Requirements:
1. Accurately identify all recognizable food items, produce, vegetables, pantry items, dairy, and proteins from the image.
2. ${dishGuidance}
3. Return strictly structured JSON with:
   - identified_ingredients: string[] (names of food items and ingredients identified in the photo)
   - recipe_title: string (e.g. "${targetDishTitle || 'Bespoke Skillet Creation'}")
   - prep_time_minutes: number
   - ingredients_needed: string[] (with measurements/amounts)
   - instructions: string[] (step-by-step instructions in simple, conversational English without chef jargon)`;

  const imagePart = {
    inlineData: {
      mimeType: mimeType,
      data: cleanBase64,
    },
  };

  const textPart = {
    text: promptText,
  };

  return callWithRetryAndFallback(async (modelName) => {
    const response = await client.models.generateContent({
      model: modelName,
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            identified_ingredients: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of ingredients identified from the photo.',
            },
            recipe_title: {
              type: Type.STRING,
              description: 'Appetizing title of the recipe.',
            },
            prep_time_minutes: {
              type: Type.NUMBER,
              description: 'Preparation and cooking time in minutes.',
            },
            ingredients_needed: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of ingredients with quantities needed for the dish.',
            },
            instructions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Step-by-step cooking instructions in clear, conversational English.',
            },
          },
          required: [
            'identified_ingredients',
            'recipe_title',
            'prep_time_minutes',
            'ingredients_needed',
            'instructions',
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Gemini Vision did not return any text output.');
    }

    const result: GeneratedRecipe = JSON.parse(text);
    return result;
  });
}

/**
 * Searches and generates tailored recipes from an uploaded photo according to a search query
 * (e.g., 'pasta', 'spicy curry', 'crispy breakfast', 'quick 10-minute snack', 'comfort soup')
 * using model 'gemini-3.8-flash' (with exponential backoff and fallback models).
 */
export async function searchRecipesFromImage(
  imageBase64: string,
  searchQuery: string,
  dietPreference: string,
  cuisineStyle: string
): Promise<RecipeSearchResult[]> {
  const client = getGeminiClient();
  const { mimeType, cleanBase64 } = parseImageData(imageBase64);

  const promptText = `You are PlateWise-AI, an intelligent culinary search engine that searches and creates bespoke recipes based on the user's uploaded photo of ingredients.
User's Search Query: "${searchQuery}"
Diet Preference: ${dietPreference || 'Flexible'}
Cuisine Style: ${cuisineStyle || 'Global / Flexible'}

Instructions:
1. Examine the items in the uploaded photo.
2. Search and curate 2 to 3 distinct, creative, and delicious recipes that directly satisfy the user's search query ("${searchQuery}") while maximizing use of the ingredients visible in the photo.
3. If the query specifies a cuisine (e.g. "Mexican", "Italian", "Thai"), prioritize that style.
4. For each recipe, provide practical home-cook friendly ingredients and clear step-by-step instructions.`;

  const imagePart = {
    inlineData: {
      mimeType: mimeType,
      data: cleanBase64,
    },
  };

  const textPart = {
    text: promptText,
  };

  return callWithRetryAndFallback(async (modelName) => {
    const response = await client.models.generateContent({
      model: modelName,
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          description: 'List of matching recipes found for the photo and search query.',
          items: {
            type: Type.OBJECT,
            properties: {
              recipe_title: {
                type: Type.STRING,
                description: 'Clear, enticing title of the recipe.',
              },
              short_description: {
                type: Type.STRING,
                description: 'One to two sentence summary of the dish.',
              },
              match_reason: {
                type: Type.STRING,
                description: 'Explanation of how this recipe matches the search query and the uploaded photo.',
              },
              prep_time_minutes: {
                type: Type.NUMBER,
                description: 'Total prep and cooking time in minutes.',
              },
              cuisine: {
                type: Type.STRING,
                description: 'Cuisine style of this dish.',
              },
              diet: {
                type: Type.STRING,
                description: 'Dietary classification (e.g., Pure Veg, High Protein, Low Carb, Vegan, Keto).',
              },
              calories: {
                type: Type.STRING,
                description: 'Estimated calories, e.g. "360 kcal".',
              },
              protein: {
                type: Type.STRING,
                description: 'Estimated protein, e.g. "22g".',
              },
              identified_ingredients: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Key ingredients spotted from the user photo used in this recipe.',
              },
              ingredients_needed: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Complete list of ingredients with quantities.',
              },
              instructions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Step-by-step cooking directions in plain English.',
              },
              plain_english_tip: {
                type: Type.STRING,
                description: 'A helpful no-nonsense home cook tip.',
              },
            },
            required: [
              'recipe_title',
              'short_description',
              'match_reason',
              'prep_time_minutes',
              'cuisine',
              'diet',
              'calories',
              'protein',
              'identified_ingredients',
              'ingredients_needed',
              'instructions',
              'plain_english_tip',
            ],
          },
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Gemini Vision did not return search results.');
    }

    const results: RecipeSearchResult[] = JSON.parse(text);
    return results;
  });
}
