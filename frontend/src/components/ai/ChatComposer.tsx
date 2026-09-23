import React, { useRef, useState } from "react";
import {
  ArrowUp,
  Paperclip,
  Mic,
  Square,
} from "lucide-react";

interface ChatComposerProps {
  disabled: boolean;
  isGenerating: boolean;
  onSend: (message: string) => void;
  onStop: () => void;
}

export default function ChatComposer({
  disabled,
  isGenerating,
  onSend,
  onStop,
}: ChatComposerProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const submit = () => {
    const trimmed = value.trim();

    if (!trimmed || disabled || isGenerating) return;

    onSend(trimmed);
    setValue("");

    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <div className="rounded-2xl border border-theme-border bg-theme-secondary p-2 shadow-sm">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled || isGenerating}
        placeholder="Ask Sentinel AI..."
        rows={1}
        className="max-h-40 min-h-[48px] w-full resize-none bg-transparent px-3 py-3 text-sm outline-none placeholder:text-theme-muted disabled:cursor-not-allowed"
      />

      <div className="flex items-center justify-between px-1 pb-1">
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled
            title="Attachments coming later"
            className="rounded-lg p-2 text-theme-muted opacity-40"
          >
            <Paperclip className="h-4 w-4" />
          </button>

          <button
            type="button"
            disabled
            title="Speech-to-text coming later"
            className="rounded-lg p-2 text-theme-muted opacity-40"
          >
            <Mic className="h-4 w-4" />
          </button>
        </div>

        {isGenerating ? (
          <button
            type="button"
            onClick={onStop}
            className="flex h-9 items-center gap-2 rounded-xl bg-red-500 px-3 text-sm font-medium text-white transition hover:bg-red-600"
          >
            <Square className="h-3.5 w-3.5 fill-current" />
            Stop
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={!value.trim() || disabled}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}