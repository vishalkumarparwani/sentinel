import React, { useState } from "react";
import { User, Bot, Copy, Check } from "lucide-react";

import type { Message } from "../../types/ai";

interface MessageItemProps {
  message: Message;
}

export default function MessageItem({
  message,
}: MessageItemProps): React.ReactElement {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex gap-3.5 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
          <Bot className="h-4 w-4" />
        </div>
      )}

      <div
        className={`flex max-w-[85%] flex-col gap-1 ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`rounded-2xl px-4 py-3 text-xs leading-relaxed ${
            isUser
              ? "rounded-tr-xs bg-indigo-600 text-white"
              : "rounded-tl-xs border border-zinc-700/40 bg-zinc-800/60 text-zinc-100 shadow-sm"
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">
              {message.content}
            </p>
          ) : (
            <AssistantContent content={message.content} />
          )}
        </div>
      </div>

      {isUser && (
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-300">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}

function AssistantContent({
  content,
}: {
  content: string;
}): React.ReactElement {
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-3">
      {parts.map((part, index) => {
        if (
          part.startsWith("```") &&
          part.endsWith("```")
        ) {
          const firstLineEnd = part.indexOf("\n");

          const language =
            firstLineEnd > -1
              ? part.slice(3, firstLineEnd).trim() || "code"
              : "code";

          const code =
            firstLineEnd > -1
              ? part.slice(firstLineEnd + 1, -3)
              : part.slice(3, -3);

          return (
            <CodeBlock
              key={index}
              language={language}
              code={code}
            />
          );
        }

        if (!part.trim()) {
          return null;
        }

        return (
          <p
            key={index}
            className="whitespace-pre-wrap text-zinc-200"
          >
            {part}
          </p>
        );
      })}
    </div>
  );
}

interface CodeBlockProps {
  language: string;
  code: string;
}

function CodeBlock({
  language,
  code,
}: CodeBlockProps): React.ReactElement {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="my-2 overflow-hidden rounded-xl border border-zinc-700/60 bg-zinc-950 font-mono text-[11px]">
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-3 py-1.5 text-zinc-400">
        <span className="text-[10px] font-semibold uppercase tracking-wider">
          {language}
        </span>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 rounded px-1.5 py-0.5 text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-400" />
              <span className="text-emerald-400">
                Copied
              </span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy code</span>
            </>
          )}
        </button>
      </div>

      <div className="overflow-x-auto p-3 leading-relaxed text-zinc-200 scrollbar-thin scrollbar-thumb-zinc-800">
        <pre className="whitespace-pre">{code}</pre>
      </div>
    </div>
  );
}