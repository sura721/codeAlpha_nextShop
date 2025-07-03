'use server';

 import ModelClient, { isUnexpected, ChatRequestMessage, ChatCompletionsToolDefinition } from '@azure-rest/ai-inference';
import { AzureKeyCredential } from '@azure/core-auth';
import { Prisma } from '@prisma/client';
import { getCategories, getProducts } from "./product.actions";
import { aiTeacher } from "@/lib/aiData";
import { ProductWithDetails } from '../types';


if (!process.env.GPT_API_KEY) {
  throw new Error("Missing GPT_API_KEY environment variable.");
}

const endpoint = "https://models.github.ai/inference";
const credential = new AzureKeyCredential(process.env.GPT_API_KEY);
const client = ModelClient(endpoint, credential);
const model = "openai/gpt-4.1";

export async function getAIResponse(
  history: { role: 'user' | 'model'; parts: { text: string }[] }[]
): Promise<string> {
  const categories = await getCategories();
  
   const tools: ChatCompletionsToolDefinition[] = [
    {
      type: "function",
      function: {
        name: "search_products",
        description: "Searches for products based on various criteria like keywords, category, and price.",
        parameters: {
          type: "object",
          properties: {
            query: { type: "string", description: "Keywords to search for in product title or description (e.g., 'smart watch', 'leather')." },
            category: { type: "string", description: `A specific category slug to filter by. Available slugs: ${categories.map(c => c.slug).join(', ')}` },
            priceLessThan: { type: "number", description: "The maximum price for the products." },
            priceGreaterThan: { type: "number", description: "The minimum price for the products." },
          },
          required: [],
        },
      },
    }
  ];

   const messages: ChatRequestMessage[] = [
    { role: 'system', content: aiTeacher },
    ...history.map(msg => ({
        role: msg.role === 'model' ? 'assistant' : 'user',
        content: msg.parts[0].text,
    }))
  ];

  const initialResult = await client.path("/chat/completions").post({
    body: { model, messages, tools, tool_choice: "auto" }
  });

  if (isUnexpected(initialResult)) throw new Error("API Error in initial call");
  const initialResponse = initialResult.body.choices[0].message;

  if (initialResponse.tool_calls && initialResponse.tool_calls[0]) {
    const toolCall = initialResponse.tool_calls[0];
    const functionName = toolCall.function.name;
    const args = JSON.parse(toolCall.function.arguments);

    let toolResponseContent = "";

    if (functionName === 'search_products') {
      const products = await getProducts(args);
      if (products.length > 0) {
        toolResponseContent = "Here are the products I found:\n" + products.map((p: ProductWithDetails) => `- Title: ${p.title}, Price: $${p.variants[0].price}, URL: ${process.env.NEXT_PUBLIC_APP_URL}/product/${p.slug}`).join('\n');
      } else {
        toolResponseContent = "I searched for products with the specified criteria but did not find any matches.";
      }
    }

     messages.push(initialResponse);
    messages.push({ role: 'tool', tool_call_id: toolCall.id, content: toolResponseContent });

    const finalResult = await client.path("/chat/completions").post({
      body: { model, messages }
    });
    
    if (isUnexpected(finalResult)) throw new Error("API Error in final call");
    return finalResult.body.choices[0].message?.content || "I'm sorry, I had trouble processing that.";
  }

  return initialResponse.content || "How can I help you?";
}