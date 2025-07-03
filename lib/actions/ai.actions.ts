// ai.actions.ts

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
    // const { categories, products } = await fetchProductAndCategoryData(userMessage);

    const userPromptWithContext = aiTeacher
 
    const result = await model.generateContent(userPromptWithContext);
    const response = result.response;
    const text = response.text();

    return text;

  } catch (error) {
    console.error('Gemini AI response error:', error);
    return 'I seem to be having some trouble right now. Please try again in a moment.';
  }
}