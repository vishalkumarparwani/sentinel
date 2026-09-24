import React, { useState } from "react";
import { useAIAssistant } from "../../hooks/useAIAssistant";
import AISidebar from "../../components/AISidebar";
import MessageItem from "../../components/ai/MessageItem";
import ChatComposer from "../../components/ai/ChatComposer";
import {
  Sparkles,
  PanelLeft,
  Trash2,
  Bot,
  AlertCircle,
} from "lucide-react";

export default function AIAssistantPage(): React.ReactElement {
  const {
    conversations,
    activeConversation,
    messages,
    selectedModel,
    models,
    isLoading,
    isGenerating,
    error,
    setSelectedModel,
    createNewChat,
    selectConversation,
    renameConversation,
    deleteConversation,
    sendMessage,
    stopGeneration,
  } = useAIAssistant();

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  const currentModelInfo = models.find(
    (model) => model.model === selectedModel
  ) ?? {
    model: selectedModel || "openai/gpt-oss-120b",
    display_name: selectedModel
      ? selectedModel.split("/").pop() || selectedModel
      : "GPT OSS 120B",
    provider: "groq",
    provider_name: "Groq",
  };

  return (
      <div className="flex h-full w-full overflow-hidden bg-zinc-950 font-sans text-zinc-100 antialiased">
      <AISidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((previous) => !previous)}
        conversations={conversations}
        activeConversationId={activeConversation?.id ?? null}
        isLoading={isLoading}
        models={models}
        selectedModel={selectedModel}
        onSelectModel={setSelectedModel}
        onNewChat={createNewChat}
        onSelectConversation={selectConversation}
        onRenameConversation={renameConversation}
        onDeleteConversation={deleteConversation}
      />

      {/* MAIN CHAT AREA */}
      <div className="flex min-w-0 flex-1 flex-col bg-zinc-900/60 backdrop-blur-sm">
        {/* HEADER */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-800/80 px-4 py-2">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                title="Open Sidebar"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
              >
                <PanelLeft className="h-5 w-5" />
              </button>
            )}

            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
                <Bot className="h-4 w-4" />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-zinc-100">
                    {currentModelInfo.display_name ||
                      currentModelInfo.model}
                  </span>

                  <span className="rounded border border-zinc-700/50 bg-zinc-800 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400">
                    {currentModelInfo.provider_name ||
                      currentModelInfo.provider}
                  </span>
                </div>

                <span className="text-[10px] text-zinc-500">
                  {currentModelInfo.model}
                </span>
              </div>
            </div>
          </div>

          {/* DELETE CHAT */}
          <div className="flex items-center gap-2">
            {activeConversation && (
              <button
                type="button"
                onClick={() =>
                  deleteConversation(activeConversation.id)
                }
                className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 px-2.5 py-1.5 text-xs text-zinc-400 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                title="Delete current conversation"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">
                  Delete Chat
                </span>
              </button>
            )}
          </div>
        </header>

        {/* CHAT BODY */}
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-thumb-zinc-800">
            {messages.length === 0 ? (
              /* EMPTY STATE */
              <div className="flex h-full min-h-[400px] items-center justify-center px-4">
                <div className="w-full max-w-2xl text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 shadow-lg shadow-indigo-500/5">
                    <Sparkles className="h-7 w-7" />
                  </div>

                  <h2 className="text-2xl font-semibold tracking-tight text-zinc-100">
                    How can I help?
                  </h2>

                  <p className="mx-auto mt-2 max-w-md text-sm text-zinc-400">
                    Ask Sentinel AI about your code, APIs, issues,
                    debugging, or implementation ideas.
                  </p>

                  {/* SUGGESTIONS */}
                  <div className="mt-8 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {[
                      {
                        title: "Analyze an Issue",
                        prompt:
                          "Help me analyze this software issue.",
                      },
                      {
                        title: "Explain an Error",
                        prompt:
                          "Explain this error and how I can fix it.",
                      },
                      {
                        title: "Debug My API",
                        prompt:
                          "Help me debug my API.",
                      },
                      {
                        title: "Suggest an Implementation",
                        prompt:
                          "Suggest an implementation for my project.",
                      },
                    ].map((item) => (
                      <button
                        key={item.title}
                        type="button"
                        onClick={() => sendMessage(item.prompt)}
                        disabled={isGenerating}
                        className="group flex flex-col gap-1 rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-3.5 text-left transition-all hover:border-indigo-500/40 hover:bg-zinc-800/60 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <span className="text-xs font-medium text-zinc-200 group-hover:text-indigo-400">
                          {item.title}
                        </span>

                        <span className="line-clamp-1 text-[11px] text-zinc-500">
                          {item.prompt}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* MESSAGES */
              <div className="mx-auto w-full max-w-3xl space-y-6">
                {messages.map((message) => (
                  <MessageItem
                    key={message.id}
                    message={message}
                  />
                ))}

                {error && (
                  <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-400">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* COMPOSER */}
          <div className="shrink-0 border-t border-zinc-800/60 bg-zinc-950/80 p-4 backdrop-blur">
            <div className="mx-auto w-full max-w-3xl">
              <ChatComposer
                disabled={isLoading}
                isGenerating={isGenerating}
                onSend={sendMessage}
                onStop={stopGeneration}
              />

              <p className="mt-2 text-center text-[11px] text-zinc-500">
                Sentinel AI may provide inaccurate information. Verify
                important technical details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}