// components/layout/AIHelper.tsx
'use client';

import { getAIResponse } from '@/lib/actions/ai.actions';
import AIChatWidget from '../ai-chat-widget';

export default function AIHelper() {
  return <AIChatWidget onSendMessage={getAIResponse} />;
}