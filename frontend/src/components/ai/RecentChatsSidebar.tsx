import React, { useMemo, useState } from "react";
import {
  MessageSquare,
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

import type { Conversation } from "../../types/ai";

interface RecentChatsSidebarProps {
  conversations: Conversation[];
  activeConversationId: number | null;
  isLoading: boolean;
  onNewChat: () => void;
  onSelectConversation: (conversation: Conversation) => void;
  onRenameConversation: (
    conversationId: number,
    title: string
  ) => void;
  onDeleteConversation: (conversationId: number) => void;
}

export default function RecentChatsSidebar({
  conversations,
  activeConversationId,
  isLoading,
  onNewChat,
  onSelectConversation,
  onRenameConversation,
  onDeleteConversation,
}: RecentChatsSidebarProps) {
  const [search, setSearch] = useState("");
  const [menuId, setMenuId] = useState<number | null>(null);

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return conversations;

    return conversations.filter((conversation) =>
      conversation.title.toLowerCase().includes(query)
    );
  }, [conversations, search]);

  const handleRename = (conversation: Conversation) => {
    const title = window.prompt(
      "Enter a new name:",
      conversation.title
    );

    if (title?.trim()) {
      onRenameConversation(
        conversation.id,
        title.trim()
      );
    }

    setMenuId(null);
  };

  const handleDelete = (conversation: Conversation) => {
    const confirmed = window.confirm(
      "Delete this conversation?"
    );

    if (confirmed) {
      onDeleteConversation(conversation.id);
    }

    setMenuId(null);
  };

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-theme-border bg-theme-secondary md:flex">
      <div className="p-3">
        <button
          type="button"
          onClick={onNewChat}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </button>
      </div>

      <div className="px-3 pb-3">
        <div className="flex items-center gap-2 rounded-lg border border-theme-border bg-theme-primary px-3 py-2">
          <Search className="h-4 w-4 shrink-0 text-theme-muted" />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search chats..."
            className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-theme-muted"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-3">
        <p className="px-2 py-2 text-[11px] font-medium uppercase tracking-wider text-theme-muted">
          Recent chats
        </p>

        {isLoading ? (
          <div className="px-2 py-4 text-xs text-theme-muted">
            Loading...
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="px-2 py-4 text-xs text-theme-muted">
            No conversations yet.
          </div>
        ) : (
          <div className="space-y-1">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`group relative flex items-center rounded-lg transition ${
                  activeConversationId === conversation.id
                    ? "bg-theme-primary"
                    : "hover:bg-theme-primary/60"
                }`}
              >
                <button
                  type="button"
                  onClick={() =>
                    onSelectConversation(conversation)
                  }
                  className="flex min-w-0 flex-1 items-center gap-2 px-2.5 py-2.5 text-left"
                >
                  <MessageSquare className="h-4 w-4 shrink-0 text-theme-muted" />

                  <span className="truncate text-xs">
                    {conversation.title}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setMenuId(
                      menuId === conversation.id
                        ? null
                        : conversation.id
                    )
                  }
                  className="mr-1 rounded-md p-1.5 opacity-0 transition hover:bg-theme-primary group-hover:opacity-100"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>

                {menuId === conversation.id && (
                  <div className="absolute right-1 top-10 z-20 w-32 rounded-lg border border-theme-border bg-theme-primary p-1 shadow-lg">
                    <button
                      type="button"
                      onClick={() =>
                        handleRename(conversation)
                      }
                      className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-xs hover:bg-theme-secondary"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Rename
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(conversation)
                      }
                      className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-xs text-red-400 hover:bg-theme-secondary"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
} 