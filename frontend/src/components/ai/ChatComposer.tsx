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
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement>
  ): void => {
    if (event.key === "Enter" && !event.shiftKey) {
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
    <div className="relative flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/90 shadow-xl focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/50">
      {/* File attachment preview */}
      {attachedFile && (
        <div className="flex items-center gap-2 border-b border-zinc-800 px-3 py-2 text-xs text-zinc-300">
          <FileText className="h-4 w-4 text-indigo-400" />

          <span className="max-w-xs truncate">
            {attachedFile.name}
          </span>

          <button
            type="button"
            onClick={handleRemoveFile}
            className="ml-auto text-zinc-500 hover:text-zinc-300"
            title="Remove attachment"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Textarea */}
      <textarea
        value={input}
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
          setInput(event.target.value)
        }
        onKeyDown={handleKeyDown}
        placeholder="Ask Sentinel AI anything..."
        rows={1}
        disabled={disabled}
        className="max-h-32 w-full resize-none bg-transparent px-4 py-3 text-xs text-zinc-100 outline-none placeholder:text-zinc-500 scrollbar-thin scrollbar-thumb-zinc-800"
      />

      {/* Bottom bar */}
      <div className="flex items-center justify-between border-t border-zinc-800/40 px-3 py-2">
        <div className="flex items-center gap-1">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="hidden"
            disabled={disabled || isGenerating}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isGenerating}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
            title="Attach file or image"
          >
            <Paperclip className="h-4 w-4" />
          </button>

          <button
            type="button"
            disabled
            className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 opacity-50"
            title="Voice input coming soon"
          >
            <Mic className="h-4 w-4" />
          </button>
        </div>

        {/* Send / Stop */}
        {isGenerating ? (
          <button
            type="button"
            onClick={onStop}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-800 text-zinc-200 transition hover:bg-zinc-700"
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
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white shadow transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-indigo-600"
            title="Send message"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}