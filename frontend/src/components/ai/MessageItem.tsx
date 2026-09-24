import React from "react";
import ReactMarkdown from "react-markdown";
import { Bot, User, Copy, Check } from "lucide-react";
import { useState } from "react";
import type { Message } from "../../types/ai";

interface MessageItemProps {
  message: Message;
}

export default function MessageItem({
  message,
}: MessageItemProps) {
  const [copied, setCopied] = useState(false);

  const isUser = message.role === "user";

  const copyMessage = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <div
      className={`group mb-6 flex gap-3 ${isUser ? "justify-end" : "justify-start"
        }`}
    >
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Bot className="h-4 w-4 text-primary" />
        </div>
      )}

      <div
        className={`max-w-[80%] ${isUser
            ? "rounded-2xl rounded-br-md bg-primary px-4 py-3 text-primary-foreground"
            : "rounded-2xl rounded-bl-md bg-theme-secondary px-4 py-3"
          }`}
      >
        <div className="whitespace-pre-wrap wrap-break-words text-sm leading-6">
          <ReactMarkdown>{message.content}</ReactMarkdown>

          {message.isStreaming && (
            <span className="ml-1 inline-block animate-pulse">
              ▋
            </span>
          )}
        </div>

        {!isUser && message.content && !message.isStreaming && (
          <button
            type="button"
            onClick={copyMessage}
            className="mt-2 flex items-center gap-1 text-xs text-theme-muted opacity-0 transition group-hover:opacity-100 hover:text-theme-text"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                Copy
              </>
            )}
          </button>
        )}
      </div>

      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-theme-secondary">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}