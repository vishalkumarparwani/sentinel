import React, {
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";

import {
  Paperclip,
  Mic,
  Send,
  Square,
  X,
  FileText,
} from "lucide-react";

interface ChatComposerProps {
  disabled?: boolean;
  isGenerating?: boolean;
  onSend: (message: string) => void;
  onStop: () => void;
}

export default function ChatComposer({
  disabled = false,
  isGenerating = false,
  onSend,
  onStop,
}: ChatComposerProps): React.ReactElement {
  const [input, setInput] = useState<string>("");
  const [attachedFile, setAttachedFile] =
    useState<File | null>(null);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const handleKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement>
  ): void => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = (): void => {
    if (
      (!input.trim() && !attachedFile) ||
      disabled ||
      isGenerating
    ) {
      return;
    }

    onSend(input.trim());

    setInput("");
    setAttachedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    const file = event.target.files?.[0];

    if (file) {
      setAttachedFile(file);
    }
  };

  const handleRemoveFile = (): void => {
    setAttachedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="relative flex flex-col overflow-hidden rounded-2xl border border-theme-border bg-theme-secondary shadow-lg transition focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/20">
      {attachedFile && (
        <div className="flex items-center gap-2 border-b border-theme-border px-3 py-2 text-xs text-theme-text">
          <FileText className="h-4 w-4 text-indigo-400" />

          <span className="max-w-xs truncate">
            {attachedFile.name}
          </span>

          <button
            type="button"
            onClick={handleRemoveFile}
            className="ml-auto flex h-6 w-6 items-center justify-center rounded-md text-theme-muted transition hover:bg-theme-tertiary hover:text-theme-text"
            title="Remove attachment"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <textarea
        value={input}
        onChange={(
          event: ChangeEvent<HTMLTextAreaElement>
        ) => setInput(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask Sentinel AI anything..."
        rows={1}
        disabled={disabled}
        className="max-h-32 w-full resize-none bg-transparent px-4 py-3 text-xs text-theme-text outline-none placeholder:text-theme-muted scrollbar-thin"
      />

      <div className="flex items-center justify-between border-t border-theme-border px-3 py-2">
        <div className="flex items-center gap-1">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="hidden"
            disabled={
              disabled || isGenerating
            }
          />

          <button
            type="button"
            onClick={() =>
              fileInputRef.current?.click()
            }
            disabled={
              disabled || isGenerating
            }
            className="flex h-7 w-7 items-center justify-center rounded-lg text-theme-muted transition hover:bg-theme-tertiary hover:text-theme-text disabled:cursor-not-allowed disabled:opacity-40"
            title="Attach file or image"
          >
            <Paperclip className="h-4 w-4" />
          </button>

          <button
            type="button"
            disabled
            className="flex h-7 w-7 items-center justify-center rounded-lg text-theme-muted opacity-50"
            title="Voice input coming soon"
          >
            <Mic className="h-4 w-4" />
          </button>
        </div>

        {isGenerating ? (
          <button
            type="button"
            onClick={onStop}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-theme-tertiary text-theme-text transition hover:opacity-80"
            title="Stop generating"
          >
            <Square className="h-3.5 w-3.5 fill-current" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              (!input.trim() && !attachedFile) ||
              disabled
            }
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white shadow transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
            title="Send message"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}