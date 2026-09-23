export interface ModelCapabilities {
  text: boolean;
  vision: boolean;
  files: boolean;
}

export interface AIModel {
  provider: string;
  provider_name: string;
  model: string;
  display_name: string;
  status: 'available' | 'api_key_required' | 'rate_limited' | 'unavailable';
  capabilities: ModelCapabilities;
}

export interface Attachment {
  id: string;
  filename: string;
  file_type: string;
  file_size?: number;
  previewUrl?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  provider?: string;
  model?: string;
  status?: 'pending' | 'streaming' | 'completed' | 'failed';
  created_at?: string;
  attachments?: Attachment[];
}

export interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  last_message_preview?: string;
}