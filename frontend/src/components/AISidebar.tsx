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
    const [view, setView] =
        useState<SidebarView>("chats");

    const [search, setSearch] = useState("");
    const [editingId, setEditingId] =
        useState<number | null>(null);

    const [editingTitle, setEditingTitle] =
        useState("");

    const [deleteTarget, setDeleteTarget] =
        useState<Conversation | null>(null);

    const filteredConversations = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) return conversations;

        return conversations.filter((conversation) =>
            conversation.title
                .toLowerCase()
                .includes(query)
        );
    }, [conversations, search]);

    const startRename = (
        conversation: Conversation
    ): void => {
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

    const confirmDelete = (): void => {
        if (!deleteTarget) return;

        onDeleteConversation(deleteTarget.id);
        setDeleteTarget(null);
    };

    if (!isOpen) {
        return (
            <aside className="flex w-12 shrink-0 flex-col items-center border-r border-black/10 bg-theme-primary dark:border-white/10">
                <button
                    type="button"
                    onClick={onToggle}
                    title="Open AI sidebar"
                    className="mt-3 flex h-8 w-8 items-center justify-center rounded-lg text-theme-text/50 transition hover:bg-black/5 hover:text-theme-text dark:hover:bg-white/5"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </aside>
        );
    }

    return (
        <>
            <aside className="flex w-[260px] shrink-0 flex-col border-r border-black/10 bg-theme-primary dark:border-white/10">
                <div className="flex h-14 items-center justify-between border-b border-black/10 px-2.5 dark:border-white/10">
                    <button
                        type="button"
                        onClick={() =>
                            setView(
                                view === "chats"
                                    ? "models"
                                    : "chats"
                            )
                        }
                        className="flex min-w-0 items-center gap-2 rounded-lg px-2 py-1.5 text-left transition hover:bg-black/5 dark:hover:bg-white/5"
                    >
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-indigo-500">
                            {view === "chats" ? (
                                <MessageSquare className="h-3.5 w-3.5" />
                            ) : (
                                <Sparkles className="h-3.5 w-3.5" />
                            )}
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-theme-text">
                                {view === "chats"
                                    ? "Chats"
                                    : "AI Models"}
                            </p>

                            <p className="text-[10px] text-theme-text/40">
                                {view === "chats"
                                    ? "Your conversations"
                                    : "Available models"}
                            </p>
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={onToggle}
                        title="Collapse sidebar"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-theme-text/40 transition hover:bg-black/5 hover:text-theme-text dark:hover:bg-white/5"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                </div>

                {view === "chats" ? (
                    <>
                        <div className="p-2.5">
                            <button
                                type="button"
                                onClick={onNewChat}
                                className="flex w-full items-center justify-center gap-2 rounded-xl border border-black/10 bg-black/[0.025] px-3 py-2.5 text-xs font-medium text-theme-text/75 transition hover:bg-black/[0.05] dark:border-white/10 dark:bg-white/[0.025] dark:hover:bg-white/[0.05]"
                            >
                                <Plus className="h-3.5 w-3.5" />
                                New Chat
                            </button>
                        </div>

                        <div className="px-2.5 pb-3">
                            <div className="flex items-center gap-2 rounded-xl border border-black/10 bg-black/[0.025] px-3 dark:border-white/10 dark:bg-white/[0.025]">
                                <Search className="h-3.5 w-3.5 shrink-0 text-theme-text/35" />

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Search chats..."
                                    className="h-9 min-w-0 flex-1 bg-transparent text-xs text-theme-text outline-none placeholder:text-theme-text/35"
                                />
                            </div>
                        </div>

                        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                            <div className="px-3.5 pb-2">
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-theme-text/35">
                                    Recent
                                </span>
                            </div>

                            <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
                                {isLoading ? (
                                    <div className="space-y-2 px-1">
                                        {[1, 2, 3, 4].map(
                                            (item) => (
                                                <div
                                                    key={item}
                                                    className="h-9 animate-pulse rounded-lg bg-black/5 dark:bg-white/5"
                                                />
                                            )
                                        )}
                                    </div>
                                ) : filteredConversations.length ===
                                  0 ? (
                                    <div className="px-3 py-8 text-center">
                                        <MessageSquare className="mx-auto mb-2 h-5 w-5 text-theme-text/20" />

                                        <p className="text-xs text-theme-text/40">
                                            {search
                                                ? "No chats found."
                                                : "No conversations yet."}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-0.5">
                                        {filteredConversations.map(
                                            (conversation) => {
                                                const isActive =
                                                    conversation.id ===
                                                    activeConversationId;

                                                const isEditing =
                                                    editingId ===
                                                    conversation.id;

                                                return (
                                                    <div
                                                        key={
                                                            conversation.id
                                                        }
                                                        className={`group relative flex min-h-10 items-center rounded-lg transition ${
                                                            isActive
                                                                ? "bg-black/[0.07] dark:bg-white/[0.08]"
                                                                : "hover:bg-black/[0.035] dark:hover:bg-white/[0.04]"
                                                        }`}
                                                    >
                                                        {isEditing ? (
                                                            <input
                                                                autoFocus
                                                                value={
                                                                    editingTitle
                                                                }
                                                                onChange={(
                                                                    event
                                                                ) =>
                                                                    setEditingTitle(
                                                                        event
                                                                            .target
                                                                            .value
                                                                    )
                                                                }
                                                                onKeyDown={
                                                                    handleRenameKeyDown
                                                                }
                                                                onBlur={
                                                                    saveRename
                                                                }
                                                                className="mx-2 min-w-0 flex-1 rounded-md bg-theme-primary px-2 py-1.5 text-xs text-theme-text outline-none ring-1 ring-indigo-500/40"
                                                            />
                                                        ) : (
                                                            <>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        onSelectConversation(
                                                                            conversation.id
                                                                        )
                                                                    }
                                                                    className="min-w-0 flex-1 truncate px-3 py-2.5 pr-1 text-left text-xs text-theme-text/70"
                                                                >
                                                                    {
                                                                        conversation.title
                                                                    }
                                                                </button>

                                                                <div className="mr-1 hidden items-center gap-0.5 rounded-lg border border-black/10 bg-theme-primary/95 p-0.5 shadow-sm group-hover:flex dark:border-white/10">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            startRename(
                                                                                conversation
                                                                            )
                                                                        }
                                                                        title="Rename chat"
                                                                        className="flex h-6 w-6 items-center justify-center rounded-md text-theme-text/40 transition hover:bg-black/5 hover:text-theme-text dark:hover:bg-white/10"
                                                                    >
                                                                        <Pencil className="h-3 w-3" />
                                                                    </button>

                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            setDeleteTarget(
                                                                                conversation
                                                                            )
                                                                        }
                                                                        title="Delete chat"
                                                                        className="flex h-6 w-6 items-center justify-center rounded-md text-theme-text/40 transition hover:bg-red-500/10 hover:text-red-500"
                                                                    >
                                                                        <Trash2 className="h-3 w-3" />
                                                                    </button>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="min-h-0 flex-1 overflow-y-auto p-2.5">
                        <div className="mb-3 px-1">
                            <p className="text-xs font-medium text-theme-text/80">
                                Available Models
                            </p>

                            <p className="mt-1 text-[10px] leading-relaxed text-theme-text/40">
                                Select the model used for future
                                messages.
                            </p>
                        </div>

                        <div className="space-y-2">
                            {models.map((model) => {
                                const isSelected =
                                    model.model ===
                                    selectedModel;

                                const isAvailable =
                                    model.status ===
                                    "available";

                                return (
                                    <button
                                        key={model.model}
                                        type="button"
                                        disabled={!isAvailable}
                                        onClick={() =>
                                            onSelectModel(
                                                model.model
                                            )
                                        }
                                        className={`w-full rounded-xl border p-3 text-left transition ${
                                            isSelected
                                                ? "border-indigo-500/30 bg-indigo-500/10"
                                                : "border-black/10 bg-black/[0.025] hover:bg-black/[0.05] dark:border-white/10 dark:bg-white/[0.025] dark:hover:bg-white/[0.05]"
                                        } ${
                                            !isAvailable
                                                ? "cursor-not-allowed opacity-50"
                                                : ""
                                        }`}
                                    >
                                        <div className="flex items-start gap-2.5">
                                            <div
                                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                                                    model.provider ===
                                                    "groq"
                                                        ? "bg-orange-500/10 text-orange-500"
                                                        : "bg-black/5 text-theme-text/50 dark:bg-white/5"
                                                }`}
                                            >
                                                <Bot className="h-4 w-4" />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-xs font-medium text-theme-text/80">
                                                    {
                                                        model.display_name
                                                    }
                                                </p>

                                                <p className="mt-0.5 truncate text-[10px] text-theme-text/35">
                                                    {model.model}
                                                </p>

                                                <div className="mt-2 flex items-center justify-between">
                                                    <span className="text-[10px] text-theme-text/45">
                                                        {
                                                            model.provider_name
                                                        }
                                                    </span>

                                                    <span
                                                        className={`text-[10px] ${
                                                            isAvailable
                                                                ? "text-emerald-500"
                                                                : "text-theme-text/30"
                                                        }`}
                                                    >
                                                        {isAvailable
                                                            ? "Available"
                                                            : "Unavailable"}
                                                    </span>
                                                </div>
                                            </div>

                                            {isSelected && (
                                                <span className="rounded-full bg-indigo-500/10 px-1.5 py-0.5 text-[9px] font-medium text-indigo-500">
                                                    Active
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </aside>

            {deleteTarget && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            setDeleteTarget(null);
                        }
                    }}
                >
                    <div className="w-full max-w-sm rounded-2xl border border-black/10 bg-theme-primary p-5 shadow-2xl dark:border-white/10">
                        <h2 className="text-sm font-semibold text-theme-text">
                            Delete chat?
                        </h2>

                        <p className="mt-2 text-xs leading-relaxed text-theme-text/55">
                            This will delete{" "}
                            <span className="font-semibold text-theme-text">
                                {deleteTarget.title}
                            </span>
                            .
                        </p>

                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() =>
                                    setDeleteTarget(null)
                                }
                                className="rounded-lg border border-black/10 bg-black/[0.04] px-4 py-2 text-xs font-medium text-theme-text/70 transition hover:bg-black/[0.08] dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-white/[0.08]"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={confirmDelete}
                                className="rounded-lg border border-white bg-red-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-red-500"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}