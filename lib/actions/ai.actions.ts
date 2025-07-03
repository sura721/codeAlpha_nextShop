// lib/actions/ai.actions.ts
'use server';

import { GoogleGenerativeAI, Content } from '@google/generative-ai';
import { getCategories, getProducts } from "./product.actions";
import { aiTeacher } from "@/lib/aiData";

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- FIX: Switched back to the Flash model to avoid Free Tier rate limits ---
// This model is much faster and has a more generous free quota, ideal for development.
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash-latest',
  systemInstruction: aiTeacher,
});

/**
 * Gets an AI response, now with conversational memory and a crash fix.
 * @param history The entire chat history from the front-end.
 */
export async function getAIResponse(history: Message[]): Promise<string> {
  const latestUserMessage = history[history.length - 1]?.parts[0]?.text || '';
  if (!latestUserMessage) {
    return "I'm sorry, I didn't receive a message. Could you please try again? 😊";
  }

  let chatHistoryForModel = history.slice(0, -1);

  // The Gemini API requires history to start with a 'user' role.
  // This check removes the initial 'model' greeting if it's the first message in the history, preventing a crash.
  if (chatHistoryForModel.length > 0 && chatHistoryForModel[0].role === 'model') {
    chatHistoryForModel = chatHistoryForModel.slice(1);
  }

  const chat = model.startChat({
    history: chatHistoryForModel as Content[],
  });

  try {
    const { categories, products } = await fetchProductAndCategoryData(latestUserMessage);

    const userPromptWithContext = `
      The user's latest message is: "${latestUserMessage}"

      ---
      Here is some real-time data from our store to help you answer. Use this as your primary source of truth for products.

      Available Product Categories:
      ${categories.map((c) => `- ${c.name}`).join('\n') || 'No categories found.'}

      Potentially Relevant Products:
      ${products.length > 0
        ? products.map((p) => `- Title: ${p.title}\n  - Category: ${p.category}\n  - Price: ${p.priceRange}\n  - URL: ${p.url}`).join('\n\n')
        : 'No specific products matched the user query.'
      }
      ---
    `;

    const result = await chat.sendMessage(userPromptWithContext);
    const response = result.response;
    const text = response.text();

    return text;

  } catch (error) {
    console.error('Gemini AI response error:', error);
    if (error instanceof Error && (error.message.includes('429') || error.message.includes('quota'))) {
        return "I'm experiencing a high volume of requests right now. Please wait a moment and try again.";
    }
    return 'I seem to be having some trouble connecting to my knowledge base right now. Please try again in a moment.';
  }
}

// This helper function remains the same
export async function fetchProductAndCategoryData(userQuery: string) {
  const categories = await getCategories();
  let matchedCategorySlug: string | undefined = undefined;
  const lowerQuery = userQuery.toLowerCase();
  for (const cat of categories) {
    if (lowerQuery.includes(cat.name.toLowerCase())) {
      matchedCategorySlug = cat.slug;
      break;
    }
  }
  const products = await getProducts({
    query: userQuery,
    category: matchedCategorySlug ?? undefined,
  });
  const formattedProducts = products.slice(0, 7).map((p) => ({
    title: p.title,
    category: p.category.name,
    priceRange: p.variants.length > 1
      ? `$${p.variants[0].price} - $${p.variants[p.variants.length - 1].price}`
      : (p.variants.length === 1 ? `$${p.variants[0].price}` : "Price not available"),
    url: `https://ping-shop.vercel.app/product/${p.id}`,
  }));
  return { categories, products: formattedProducts };
}