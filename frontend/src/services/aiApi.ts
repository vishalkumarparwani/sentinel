import { AIModel, Conversation, Message, Attachment } from '../types/ai';

const API_BASE = '/api/ai';

export const aiApi = {
  async getModels(): Promise<AIModel[]> {
    const res = await fetch(`${API_BASE}/models`);
    return res.json();
  },

  async getConversations(): Promise<Conversation[]> {
    const res = await fetch(`${API_BASE}/conversations`);
    return res.json();
  },

  async getConversation(id: string): Promise<{ id: string; title: string; messages: Message[] }> {
    const res = await fetch(`${API_BASE}/conversations/${id}`);
    return res.json();
  },

  async deleteConversation(id: string): Promise<void> {
    await fetch(`${API_BASE}/conversations/${id}`, { method: 'DELETE' });
  },

  async renameConversation(id: string, title: string): Promise<void> {
    await fetch(`${API_BASE}/conversations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
  },

  async uploadAttachment(file: File): Promise<Attachment> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/attachments`, {
      method: 'POST',
      body: formData,
    });
    return res.json();
  },

  streamMessage(
    conversationId: string,
    payload: { content: string; provider: string; model: string; attachment_ids: string[] },
    onChunk: (data: { delta: string; full_content: string }) => void,
    onComplete: () => void,
    onError: (err: any) => void
  ): AbortController {
    const controller = new AbortController();

    fetch(`${API_BASE}/conversations/${conversationId}/messages/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.body) throw new Error('ReadableStream not supported');
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split('\n\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const raw = line.replace('data: ', '').trim();
              if (!raw) continue;
              const json = JSON.parse(raw);
              if (json.event === 'DONE') {
                onComplete();
                return;
              }
              if (json.error) {
                onError(json.error);
                return;
              }
              onChunk(json);
            }
          }
        }
        onComplete();
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          onError(err);
        }
      });

    return controller;
  },
};