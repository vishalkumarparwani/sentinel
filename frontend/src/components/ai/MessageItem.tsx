import React from 'react';
import { Copy, Check, Bot, User, FileText, RefreshCw } from 'lucide-react';
import { Message } from '../../types/ai';

interface MessageItemProps {
  message: Message;
  onCopy: (content: string) => void;
  onRegenerate?: () => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message, onCopy, onRegenerate }) => {
  const [copied, setCopied] = React.useState(false);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    onCopy(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`py-4 px-4 sm:px-6 flex gap-4 ${isUser ? 'bg-slate-950/40' : 'bg-slate-900/30 border-y border-slate-800/40'}`}>
      <div className="flex-shrink-0">
        {isUser ? (
          <div className="w-7 h-7 rounded-md bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <User size={16} />
          </div>
        ) : (
          <div className="w-7 h-7 rounded-md bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Bot size={16} />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 space-y-2">
        {/* Header Meta */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">{isUser ? 'You' : 'Sentinel Assistant'}</span>
            {!isUser && message.model && (
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-mono border border-slate-700/60">
                {message.provider} / {message.model}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isUser && onRegenerate && (
              <button onClick={onRegenerate} className="hover:text-slate-300 p-1 rounded" title="Regenerate">
                <RefreshCw size={12} />
              </button>
            )}
            <button onClick={handleCopy} className="hover:text-slate-300 p-1 rounded" title="Copy Message">
              {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            </button>
          </div>
        </div>

        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {message.attachments.map((att) => (
              <div key={att.id} className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-slate-300">
                <FileText size={12} className="text-indigo-400" />
                <span className="truncate max-w-[150px]">{att.filename}</span>
              </div>
            ))}
          </div>
        )}

        {/* Text / Markdown Output */}
        <div className="text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-wrap break-words">
          {message.content}
          {message.status === 'streaming' && (
            <span className="inline-block w-1.5 h-4 ml-1 bg-indigo-500 animate-pulse align-middle" />
          )}
        </div>
      </div>
    </div>
  );
};