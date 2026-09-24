import { useCallback, useEffect, useRef, useState } from "react";

import type {
  AIModel,
  Conversation,
  Message,
} from "../types/ai";

import {
  createConversation,
  deleteConversation as deleteConversationApi,
  getConversation,
  getConversations,
  getModels,
  renameConversation as renameConversationApi,
  streamMessage,
} from "../services/aiApi";

const DEFAULT_MODEL: AIModel = {
  provider: "groq",
  provider_name: "Groq",
  model: "openai/gpt-oss-120b",
  display_name: "GPT-OSS 120B",
  status: "available",
  capabilities: {
    text: true,
    vision: false,
    files: false,
  },
};

export function useAIAssistant() {
  const [models, setModels] = useState<AIModel[]>([
    DEFAULT_MODEL,
  ]);

  // Store only the model ID/string as the selected model.
  const [selectedModel, setSelectedModel] = useState<string>(
    DEFAULT_MODEL.model
  );

  const [conversations, setConversations] = useState<
    Conversation[]
  >([]);

  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] =
    useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);

  const abortControllerRef =
    useRef<AbortController | null>(null);

  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [conversationData, modelData] =
        await Promise.all([
          getConversations(),
          getModels().catch(() => [DEFAULT_MODEL]),
        ]);

      setConversations(conversationData);

      if (modelData.length > 0) {
        setModels(modelData);
        setSelectedModel(modelData[0].model);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load AI Assistant."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [loadInitialData]);

  const createNewChat = useCallback(() => {
    abortControllerRef.current?.abort();

    setIsGenerating(false);
    setError(null);
    setActiveConversation(null);
    setMessages([]);
  }, []);

  const selectConversation = useCallback(
    async (conversationId: number) => {
      if (isGenerating) return;

      setError(null);

      const conversation = conversations.find(
        (item) => item.id === conversationId
      );

      if (!conversation) return;

      setActiveConversation(conversation);
      setMessages([]);

      try {
        const data = await getConversation(conversationId);
        setMessages(data.messages);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load conversation."
        );
      }
    },
    [conversations, isGenerating]
  );

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();

      if (!trimmed || isGenerating) return;

      setError(null);

      let conversation = activeConversation;

      try {
        if (!conversation) {
          conversation = await createConversation(
            trimmed.length > 40
              ? `${trimmed.slice(0, 40)}...`
              : trimmed
          );

          setActiveConversation(conversation);

          setConversations((prev) => [
            conversation!,
            ...prev,
          ]);
        }

        const userMessage: Message = {
          id: `user-${Date.now()}`,
          conversation_id: conversation.id,
          role: "user",
          content: trimmed,
          created_at: new Date().toISOString(),
        };

        const assistantMessageId = `assistant-${Date.now()}`;

        const assistantMessage: Message = {
          id: assistantMessageId,
          conversation_id: conversation.id,
          role: "assistant",
          content: "",
          model: selectedModel,
          created_at: new Date().toISOString(),
          isStreaming: true,
        };

        setMessages((prev) => [
          ...prev,
          userMessage,
          assistantMessage,
        ]);

        setIsGenerating(true);

        const controller = new AbortController();
        abortControllerRef.current = controller;

        await streamMessage(
          conversation.id,
          {
            content: trimmed,
            model: selectedModel,
          },
          (chunk) => {
            if (chunk.type === "content" && chunk.content) {
              setMessages((prev) =>
                prev.map((message) =>
                  message.id === assistantMessageId
                    ? {
                        ...message,
                        content:
                          message.content + chunk.content,
                      }
                    : message
                )
              );
            }

            if (chunk.type === "error") {
              setError(
                chunk.error || "AI generation failed."
              );
            }

            if (chunk.type === "message_end") {
              setMessages((prev) =>
                prev.map((message) =>
                  message.id === assistantMessageId
                    ? {
                        ...message,
                        isStreaming: false,
                      }
                    : message
                )
              );
            }
          },
          controller.signal
        );

        setMessages((prev) =>
          prev.map((message) =>
            message.id === assistantMessageId
              ? {
                  ...message,
                  isStreaming: false,
                }
              : message
          )
        );

        const updatedConversations =
          await getConversations().catch(
            () => conversations
          );

        setConversations(updatedConversations);
      } catch (err) {
        if (
          err instanceof DOMException &&
          err.name === "AbortError"
        ) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Failed to generate response."
        );
      } finally {
        setIsGenerating(false);
        abortControllerRef.current = null;
      }
    },
    [
      activeConversation,
      conversations,
      isGenerating,
      selectedModel,
    ]
  );

  const stopGeneration = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;

    setIsGenerating(false);

    setMessages((prev) =>
      prev.map((message) =>
        message.isStreaming
          ? {
              ...message,
              isStreaming: false,
            }
          : message
      )
    );
  }, []);

  const renameConversation = useCallback(
    async (conversationId: number, title: string) => {
      try {
        const updated =
          await renameConversationApi(
            conversationId,
            title
          );

        setConversations((prev) =>
          prev.map((conversation) =>
            conversation.id === conversationId
              ? updated
              : conversation
          )
        );

        setActiveConversation((current) =>
          current?.id === conversationId
            ? updated
            : current
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to rename conversation."
        );
      }
    },
    []
  );

  const deleteConversation = useCallback(
    async (conversationId: number) => {
      try {
        await deleteConversationApi(conversationId);

        setConversations((prev) =>
          prev.filter(
            (conversation) =>
              conversation.id !== conversationId
          )
        );

        if (activeConversation?.id === conversationId) {
          setActiveConversation(null);
          setMessages([]);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to delete conversation."
        );
      }
    },
    [activeConversation]
  );

  return {
    models,
    selectedModel,
    conversations,
    activeConversation,
    messages,
    isLoading,
    isGenerating,
    error,

    setSelectedModel,
    createNewChat,
    selectConversation,
    sendMessage,
    stopGeneration,
    renameConversation,
    deleteConversation,
  };
}