import React, { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Plus,
  Search,
  Pencil,
  Trash2,
  Bot,
  Sparkles,
} from "lucide-react";

import type { AIModel, Conversation } from "../types/ai";

interface AISidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  conversations: Conversation[];
  activeConversationId: number | null;
  isLoading: boolean;
  models: AIModel[];
  selectedModel: string;
  onSelectModel: (modelId: string) => void;
  onNewChat: () => void;
  onSelectConversation: (id: number) => void;
  onRenameConversation: (id: number, newTitle: string) => void;
  onDeleteConversation: (id: number) => void;
}

type SidebarView = "chats" | "models";

export default function AISidebar({
  isOpen,
  onToggle,
  conversations,
  activeConversationId,
  isLoading,
  models,
  selectedModel,
  onSelectModel,
  onNewChat,
  onSelectConversation,
  onRenameConversation,
  onDeleteConversation,
}: AISidebarProps): React.ReactElement {
  const [view, setView] = useState<SidebarView>("chats");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return conversations;
    }

    return conversations.filter((conversation) =>
      conversation.title.toLowerCase().includes(query)
    );
  }, [conversations, search]);

  const startRename = (conversation: Conversation): void => {
    setEditingId(conversation.id);
    setEditingTitle(conversation.title);
  };

  const cancelRename = (): void => {
    setEditingId(null);
    setEditingTitle("");
  };

  const saveRename = (): void => {
    if (editingId === null) return;

    const title = editingTitle.trim();

    if (title) {
      onRenameConversation(editingId, title);
    }

    cancelRename();
  };

  const handleRenameKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (event.key === "Enter") {
      event.preventDefault();
      saveRename();
    }

    if (event.key === "Escape") {
      event.preventDefault();
      cancelRename();
    }
  };

  if (!isOpen) {
    return (
      <aside className="flex w-14 shrink-0 flex-col items-center border-r border-zinc-800/80 bg-zinc-950">
        <button
          type="button"
          onClick={onToggle}
          title="Open Sidebar"
          className="mt-3 flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </aside>
    );
  }

  return (
    <aside className="flex w-72 shrink-0 flex-col border-r border-zinc-800/80 bg-zinc-950">
      <div className="flex h-14 items-center justify-between border-b border-zinc-800/80 px-3">
        <button
          type="button"
          onClick={() =>
            setView(view === "chats" ? "models" : "chats")
          }
          className="flex min-w-0 items-center gap-2 rounded-lg px-2 py-1.5 text-left transition hover:bg-zinc-800"
          title="Switch sidebar view"
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
            {view === "chats" ? (
              <MessageSquare className="h-3.5 w-3.5" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-zinc-100">
              {view === "chats" ? "Chats" : "AI Models"}
            </p>

            <p className="text-[10px] text-zinc-500">
              {view === "chats"
                ? "Your conversations"
                : "Available models"}
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={onToggle}
          title="Collapse Sidebar"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-800 hover:text-zinc-200"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      {view === "chats" ? (
        <>
          <div className="p-3">
            <button
              type="button"
              onClick={onNewChat}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-xs font-medium text-zinc-200 transition hover:border-indigo-500/40 hover:bg-zinc-800"
            >
              <Plus className="h-4 w-4" />
              New Chat
            </button>
          </div>

          <div className="px-3 pb-3">
            <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/70 px-3">
              <Search className="h-3.5 w-3.5 shrink-0 text-zinc-500" />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search chats..."
                className="h-9 min-w-0 flex-1 bg-transparent text-xs text-zinc-200 outline-none placeholder:text-zinc-600"
              />
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="px-4 pb-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                Recent
              </span>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3 scrollbar-thin scrollbar-thumb-zinc-800">
              {isLoading ? (
                <div className="space-y-2 px-1">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="h-9 animate-pulse rounded-lg bg-zinc-900"
                    />
                  ))}
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="px-3 py-8 text-center">
                  <MessageSquare className="mx-auto mb-2 h-5 w-5 text-zinc-700" />

                  <p className="text-xs text-zinc-500">
                    {search
                      ? "No chats found."
                      : "No conversations yet."}
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredConversations.map((conversation) => {
                    const isActive =
                      conversation.id === activeConversationId;

                    const isEditing =
                      editingId === conversation.id;

                    return (
                      <div
                        key={conversation.id}
                        className={`group relative flex items-center rounded-lg transition ${
                          isActive
                            ? "bg-zinc-800"
                            : "hover:bg-zinc-900"
                        }`}
                      >
                        {isEditing ? (
                          <input
                            autoFocus
                            value={editingTitle}
                            onChange={(event) =>
                              setEditingTitle(event.target.value)
                            }
                            onKeyDown={handleRenameKeyDown}
                            onBlur={saveRename}
                            className="mx-2 min-w-0 flex-1 rounded bg-zinc-950 px-2 py-1.5 text-xs text-zinc-200 outline-none ring-1 ring-indigo-500/40"
                          />
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                onSelectConversation(conversation.id)
                              }
                              className="min-w-0 flex-1 truncate px-3 py-2.5 text-left text-xs text-zinc-300"
                            >
                              {conversation.title}
                            </button>

                            <div className="mr-1 hidden shrink-0 items-center gap-0.5 group-hover:flex">
                              <button
                                type="button"
                                onClick={() =>
                                  startRename(conversation)
                                }
                                title="Rename chat"
                                className="flex h-6 w-6 items-center justify-center rounded text-zinc-500 transition hover:bg-zinc-800 hover:text-zinc-300"
                              >
                                <Pencil className="h-3 w-3" />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  onDeleteConversation(conversation.id)
                                }
                                title="Delete chat"
                                className="flex h-6 w-6 items-center justify-center rounded text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-zinc-800">
          <div className="mb-3 px-1">
            <p className="text-xs font-medium text-zinc-300">
              Available Models
            </p>

            <p className="mt-1 text-[10px] leading-relaxed text-zinc-600">
              Select the model used for future messages.
            </p>
          </div>

          <div className="space-y-2">
            {models.map((model) => {
              const isSelected =
                model.model === selectedModel;

              const isAvailable =
                model.status === "available";

              return (
                <button
                  key={model.model}
                  type="button"
                  disabled={!isAvailable}
                  onClick={() => onSelectModel(model.model)}
                  className={`w-full rounded-xl border p-3 text-left transition ${
                    isSelected
                      ? "border-indigo-500/40 bg-indigo-500/10"
                      : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-900"
                  } ${
                    !isAvailable
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                        model.provider === "groq"
                          ? "bg-orange-500/10 text-orange-400"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      <Bot className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-xs font-medium text-zinc-200">
                            {model.display_name}
                          </p>

                          <p className="mt-0.5 truncate text-[10px] text-zinc-600">
                            {model.model}
                          </p>
                        </div>

                        {isSelected && (
                          <span className="shrink-0 rounded-full bg-indigo-500/15 px-1.5 py-0.5 text-[9px] font-medium text-indigo-400">
                            Active
                          </span>
                        )}
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[10px] text-zinc-500">
                          {model.provider_name}
                        </span>

                        <span
                          className={`text-[10px] ${
                            isAvailable
                              ? "text-emerald-500"
                              : "text-zinc-600"
                          }`}
                        >
                          {isAvailable
                            ? "Available"
                            : "Unavailable"}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
}