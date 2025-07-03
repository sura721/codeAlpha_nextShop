// components/layout/AIHelper.tsx
'use client';

// Make sure this path points to your actual chat widget component
import { getAIResponse } from '@/lib/actions/ai.actions';
import AIChatWidget from '../ai-chat-widget';

export default function AIHelper() {
  return <AIChatWidget onSendMessage={getAIResponse} />;
}