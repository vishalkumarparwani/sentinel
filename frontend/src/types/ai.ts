export type AIProvider = "groq";

export interface AIModelCapabilities {
  text: boolean;
  vision: boolean;
  files: boolean;
}

export interface AIModel {
  provider: AIProvider;
  provider_name: string;
  model: string;
  display_name: string;
  status: "available" | "unavailable";
  capabilities: AIModelCapabilities;
}

export interface Message {
  id: number | string;
  conversation_id: number;
  role: "user" | "assistant";
  content: string;
  model?: string | null;
  created_at?: string;
  isStreaming?: boolean;
}

export interface Conversation {
  id: number;
  title: string;
  created_at?: string;
  updated_at?: string;
}