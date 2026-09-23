import type { AIModel, Conversation, Message } from "../types/ai";

const API_ROOT =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

const API_BASE = `${API_ROOT.replace(/\/$/, "")}/ai`;

function getToken(): string | null {
  return (
    localStorage.getItem("access_token") ||
    localStorage.getItem("token")
  );
}

function getHeaders(): HeadersInit {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = "Request failed.";

    try {
      const data = await response.json();
      message = data.detail || message;
    } catch {
      // Ignore JSON parsing errors.
    }

    throw new Error(message);
  }

  return response.json();
}

export async function getModels(): Promise<AIModel[]> {
  const response = await fetch(`${API_BASE}/models`, {
    headers: getHeaders(),
  });

  return handleResponse<AIModel[]>(response);
}

export async function getConversations(): Promise<Conversation[]> {
  const response = await fetch(`${API_BASE}/conversations`, {
    headers: getHeaders(),
  });

  return handleResponse<Conversation[]>(response);
}

export async function createConversation(
  title = "New Chat"
): Promise<Conversation> {
  const response = await fetch(`${API_BASE}/conversations`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ title }),
  });

  return handleResponse<Conversation>(response);
}

export async function getConversation(
  conversationId: number
): Promise<{
  conversation: Conversation;
  messages: Message[];
}> {
  const response = await fetch(
    `${API_BASE}/conversations/${conversationId}`,
    {
      headers: getHeaders(),
    }
  );

  return handleResponse(response);
}

export async function renameConversation(
  conversationId: number,
  title: string
): Promise<Conversation> {
  const response = await fetch(
    `${API_BASE}/conversations/${conversationId}`,
    {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ title }),
    }
  );

  return handleResponse<Conversation>(response);
}

export async function deleteConversation(
  conversationId: number
): Promise<void> {
  const response = await fetch(
    `${API_BASE}/conversations/${conversationId}`,
    {
      method: "DELETE",
      headers: getHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete conversation.");
  }
}

export interface StreamMessagePayload {
  content: string;
  model: string;
}

export interface StreamChunk {
  type:
    | "message_start"
    | "content"
    | "message_end"
    | "error";

  message_id?: number;
  content?: string;
  error?: string;
}

export async function streamMessage(
  conversationId: number,
  payload: StreamMessagePayload,
  onChunk: (chunk: StreamChunk) => void,
  signal?: AbortSignal
): Promise<void> {
  const token = getToken();

  const response = await fetch(
    `${API_BASE}/conversations/${conversationId}/messages/stream`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
      signal,
    }
  );

  if (!response.ok) {
    let message = "Failed to start AI response.";

    try {
      const data = await response.json();
      message = data.detail || message;
    } catch {
      // Ignore parsing errors.
    }

    throw new Error(message);
  }

  if (!response.body) {
    throw new Error("Streaming is not supported by this response.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const events = buffer.split("\n\n");
    buffer = events.pop() || "";

    for (const event of events) {
      const lines = event.split(/\r?\n/);

      for (const line of lines) {
        if (!line.startsWith("data:")) continue;

        const data = line.slice(5).trim();

        if (!data || data === "[DONE]") continue;

        try {
          const parsed = JSON.parse(data) as StreamChunk;
          onChunk(parsed);
        } catch {
          // Ignore malformed SSE chunks.
        }
      }
    }
  }
}