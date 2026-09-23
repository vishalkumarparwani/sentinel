import { useState, useEffect, useRef, useCallback } from 'react';
import { AIModel, Conversation, Message, Attachment } from '../types/ai';
import { aiApi } from '../services/aiApi';

export function useAIAssistant() {
  const [models, setModels] = useState<AIModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const abortControllerRef = useRef<AbortController | null>(null);

  // Initialize Models and Conversations
  useEffect(() => {
    aiApi.getModels().then((mList) => {
      setModels(mList);
      const defaultModel = mList.find((m) => m.status === 'available') || mList[0];
      setSelectedModel(defaultModel);
    });

    loadConversations();
  }, []);

  const loadConversations = async () => {
    const list = await aiApi.getConversations();
    setConversations(list);
  };

  const selectConversation = async (id: string) => {
    setActiveConvId(id);
    const conv = await aiApi.getConversation(id);
    setMessages(conv.messages);
  };

  const startNewChat = () => {
    setActiveConvId(null);
    setMessages([]);
    setAttachments([]);
  };

  const handleSendMessage = async (prompt: string) => {
    if ((!prompt.trim() && attachments.length === 0) || !selectedModel || isGenerating) return;

    // Use current active ID or create client-side GUID for new conversation
    const targetConvId = activeConvId || crypto.randomUUID();
    const isNewConv = !activeConvId;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: prompt,
      provider: selectedModel.provider,
      model: selectedModel.model,
      attachments: [...attachments],
      created_at: new Date().toISOString(),
    };

    const assistantMessageId = crypto.randomUUID();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      provider: selectedModel.provider,
      model: selectedModel.model,
      status: 'streaming',
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    const attachmentIds = attachments.map((a) => a.id);
    setAttachments([]);
    setIsGenerating(true);

    if (isNewConv) {
      setActiveConvId(targetConvId);
    }

    const controller = aiApi.streamMessage(
      targetConvId,
      {
        content: prompt,
        provider: selectedModel.provider,
        model: selectedModel.model,
        attachment_ids: attachmentIds,
      },
      ({ delta, full_content }) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId ? { ...msg, content: full_content } : msg
          )
        );
      },
      () => {
        setIsGenerating(false);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId ? { ...msg, status: 'completed' } : msg
          )
        );
        loadConversations();
      },
      (err) => {
        setIsGenerating(false);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  status: 'failed',
                  content:
                    msg.content +
                    `\n\n*[Error: ${selectedModel.display_name} is unavailable or rate limited]*`,
                }
              : msg
          )
        );
      }
    );

    abortControllerRef.current = controller;
  };

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsGenerating(false);
    }
  };

  return {
    models,
    selectedModel,
    setSelectedModel,
    conversations,
    activeConvId,
    messages,
    attachments,
    setAttachments,
    isGenerating,
    searchTerm,
    setSearchTerm,
    selectConversation,
    startNewChat,
    handleSendMessage,
    stopGeneration,
    loadConversations,
  };
}