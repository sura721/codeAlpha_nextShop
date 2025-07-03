'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { fetchProductAndCategoryData } from "@/lib/aiData";
import { aiTeacher } from '../mock-data'; // Your system instruction should live here

// A good practice to fail early if the key is missing
if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash-latest',
  // The system instruction contains ALL static rules and persona.
  systemInstruction: aiTeacher, 
});

export async function getAIResponse(userMessage: string): Promise<string> {
  if (!userMessage) {
    return "I'm sorry, I didn't receive a message. Please try again.";
  }

  try {
    // 🪐 Fetch live products & categories from your DB
    const { categories, products } = await fetchProductAndCategoryData(userMessage);

    // ✅ Create a CONCISE prompt containing only the DYNAMIC data for this request.
    //    All instructions are already in the systemInstruction.
    const userPromptWithContext = `
      The user's message is: "${userMessage}"

      Here is some real-time data from our store to help you answer:

      Available Categories:
      ${categories.map((c) => `- ${c.name}`).join('\n') || 'N/A'}

      Potentially Matching Products:
      ${products.length > 0
        ? products.map((p) => `- ${p.title} (${p.category}): ${p.priceRange}. Link: ${p.url}`).join('\n')
        : 'No specific products matched the query.'
      }
    `;
 
    // ✅ Pass ONLY the user's dynamic prompt. The model already knows its persona.
    const result = await model.generateContent(userPromptWithContext);
    const response = result.response;
    const text = response.text();

    return text;

  } catch (error) {
    console.error('Gemini AI response error:', error);
    return 'I seem to be having some trouble right now. Please try again in a moment.';
  }
}