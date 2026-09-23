import React from "react";
import { useAIAssistant } from "../../hooks/useAIAssistant";
import RecentChatsSidebar from "../../components/ai/RecentChatsSidebar";
import ModelSelector from "../../components/ai/ModelSelector";
import MessageItem from "../../components/ai/MessageItem";
import ChatComposer from "../../components/ai/ChatComposer";
import { Menu, Sparkles } from "lucide-react";

export default function AIAssistantPage() {
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

  return (
    <div className="flex h-full min-h-0 w-full overflow-hidden rounded-xl border border-theme-border bg-theme-primary">
      <RecentChatsSidebar
        conversations={conversations}
        activeConversationId={activeConversation?.id ?? null}
        isLoading={isLoading}
        onNewChat={createNewChat}
        onSelectConversation={selectConversation}
        onRenameConversation={renameConversation}
        onDeleteConversation={deleteConversation}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-theme-border px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>

            <div>
              <h1 className="text-sm font-semibold">Sentinel AI Assistant</h1>
              <p className="text-xs text-theme-muted">
                Your AI-powered development assistant
              </p>
            </div>
          </div>

          <ModelSelector
            models={models}
            selectedModel={selectedModel}
            onChange={setSelectedModel}
          />
        </header>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center px-6">
                <div className="w-full max-w-2xl text-center">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>

                  <h2 className="text-2xl font-semibold">
                    How can I help?
                  </h2>

                  <p className="mx-auto mt-2 max-w-lg text-sm text-theme-muted">
                    Ask Sentinel AI about your issues, services, code,
                    debugging, or anything related to your project.
                  </p>

                  <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {[
                      "Analyze an issue",
                      "Explain this error",
                      "Help me debug my API",
                      "Suggest an implementation",
                    ].map((text) => (
                      <button
                        key={text}
                        type="button"
                        onClick={() => sendMessage(text)}
                        disabled={isGenerating}
                        className="rounded-xl border border-theme-border bg-theme-secondary px-4 py-3 text-left text-sm transition hover:border-primary/40 hover:bg-theme-secondary/80 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {text}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mx-auto w-full max-w-4xl px-4 py-6">
                {messages.map((message) => (
                  <MessageItem
                    key={message.id}
                    message={message}
                  />
                ))}

                {error && (
                  <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {error}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="shrink-0 border-t border-theme-border p-4">
            <div className="mx-auto w-full max-w-4xl">
              <ChatComposer
                disabled={isLoading}
                isGenerating={isGenerating}
                onSend={sendMessage}
                onStop={stopGeneration}
              />

              <p className="mt-2 text-center text-[11px] text-theme-muted">
                AI responses may contain mistakes. Verify important information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}