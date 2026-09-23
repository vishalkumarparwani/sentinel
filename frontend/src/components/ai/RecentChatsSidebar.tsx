import React from 'react';
import { Plus, Search, MessageSquare, Trash2, Edit2, MoreVertical } from 'lucide-react';
import { Conversation } from '../../types/ai';

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
}

export const RecentChatsSidebar: React.FC<SidebarProps> = ({
  conversations,
  activeId,
  searchTerm,
  onSearchChange,
  onSelect,
  onNewChat,
  onDelete,
  onRename,
}) => {
  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <aside className="w-64 md:w-72 bg-slate-900/90 border-r border-slate-800 flex flex-col h-full select-none">
      {/* New Chat Button */}
      <div className="p-3 border-b border-slate-800/80">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-md transition duration-150 shadow-sm"
        >
          <Plus size={16} />
          <span>New Chat</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="px-3 pt-3 pb-2">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search conversations..."
            className="w-full bg-slate-950 border border-slate-800 rounded-md pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
        <div className="px-2 py-1 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
          Recent Conversations
        </div>
        {filtered.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-500">No chats found</div>
        ) : (
          filtered.map((chat) => {
            const isActive = chat.id === activeId;
            return (
              <div
                key={chat.id}
                onClick={() => onSelect(chat.id)}
                className={`group relative flex items-center justify-between px-3 py-2 rounded-md text-xs cursor-pointer transition ${
                  isActive
                    ? 'bg-slate-800 text-slate-100 font-medium'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate pr-2">
                  <MessageSquare size={14} className={isActive ? 'text-indigo-400' : 'text-slate-500'} />
                  <span className="truncate">{chat.title}</span>
                </div>

                <div className="hidden group-hover:flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const newTitle = prompt('Rename chat:', chat.title);
                      if (newTitle) onRename(chat.id, newTitle);
                    }}
                    className="p-1 text-slate-400 hover:text-slate-200 rounded"
                    title="Rename"
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Delete this conversation?')) onDelete(chat.id);
                    }}
                    className="p-1 text-slate-400 hover:text-red-400 rounded"
                    title="Delete"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};