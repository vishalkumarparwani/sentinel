import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

import { useAIAssistant } from '../../hooks/useAIAssistant';
import { RecentChatsSidebar } from './RecentChatsSidebar';
import { ModelSelector } from './ModelSelector';
import { MessageItem } from './MessageItem';
import { ChatComposer } from './ChatComposer';
import { aiApi } from '../../services/aiApi';

export const AIAssistantPage: React.FC = () => {
  const {
    models,
    selectedModel,
    setSelectedModel,
    conversations,
    activeConvId,
    messages,
    isGenerating,
    searchTerm,
    setSearchTerm,
    error,
    selectConversation,
    startNewChat,
    handleSendMessage,
    stopGeneration,
    loadConversations,
  } = useAIAssistant();

  const [
    mobileSidebarOpen,
    setMobileSidebarOpen,
  ] = useState(false);

  const messagesEndRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages]);

  const handleDelete = async (id: number) => {
    try {
      await aiApi.deleteConversation(id);

      if (activeConvId === id) {
        startNewChat();
      }

      await loadConversations();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRename = async (
    id: number,
    title: string
  ) => {
    try {
      await aiApi.renameConversation(
        id,
        title
      );

      await loadConversations();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      <div className="hidden md:block h-full">
        <RecentChatsSidebar
          conversations={conversations}
          activeId={activeConvId}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSelect={selectConversation}
          onNewChat={startNewChat}
          onDelete={handleDelete}
          onRename={handleRename}
        />
      </div>

      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-slate-950/80 backdrop-blur-sm">
          <div className="w-72 h-full bg-slate-900 border-r border-slate-800">
            <div className="flex justify-between items-center p-3 border-b border-slate-800">
              <span className="text-xs font-semibold text-slate-300">
                Chats
              </span>

              <button
                onClick={() =>
                  setMobileSidebarOpen(false)
                }
                className="text-slate-400"
              >
                <X size={16} />
              </button>
            </div>

            <RecentChatsSidebar
              conversations={conversations}
              activeId={activeConvId}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onSelect={(id) => {
                selectConversation(id);
                setMobileSidebarOpen(false);
              }}
              onNewChat={() => {
                startNewChat();
                setMobileSidebarOpen(false);
              }}
              onDelete={handleDelete}
              onRename={handleRename}
            />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col h-full relative min-w-0">
        <header className="h-14 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                setMobileSidebarOpen(true)
              }
              className="md:hidden text-slate-400 hover:text-slate-200"
            >
              <Menu size={18} />
            </button>

            <div className="flex items-center gap-2">
              <Sparkles
                size={16}
                className="text-indigo-400"
              />

              <h1 className="text-sm font-semibold text-slate-200">
                Sentinel AI Assistant
              </h1>
            </div>
          </div>

          <ModelSelector
            models={models}
            selectedModel={selectedModel}
            onSelect={setSelectedModel}
          />
        </header>

        {error && (
          <div className="px-4 py-2 bg-red-950/40 border-b border-red-900/50 text-xs text-red-300">
            {error}
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                <Sparkles size={24} />
              </div>

              <h2 className="text-base font-medium text-slate-200 mb-1">
                Sentinel AI Assistant
              </h2>

              <p className="text-xs text-slate-500 max-w-sm">
                Ask about bugs, debugging, APIs,
                backend development, or anything
                related to your Sentinel workspace.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <MessageItem
                key={message.id}
                message={message}
              />
            ))
          )}

          <div ref={messagesEndRef} />
        </div>

        <ChatComposer
          isGenerating={isGenerating}
          onSend={handleSendMessage}
          onStop={stopGeneration}
        />
      </div>
    </div>
  );
};