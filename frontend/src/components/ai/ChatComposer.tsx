import React, { useState, useRef } from 'react';
import { Paperclip, Mic, Send, Square, X, FileText } from 'lucide-react';
import { AIModel, Attachment } from '../../types/ai';
import { aiApi } from '../../services/aiApi';
import { speechService } from '../../services/speechService';

interface ChatComposerProps {
  selectedModel: AIModel | null;
  attachments: Attachment[];
  setAttachments: React.Dispatch<React.SetStateAction<Attachment[]>>;
  isGenerating: boolean;
  onSend: (text: string) => void;
  onStop: () => void;
}

export const ChatComposer: React.FC<ChatComposerProps> = ({
  selectedModel,
  attachments,
  setAttachments,
  isGenerating,
  onSend,
  onStop,
}) => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!input.trim() && attachments.length === 0) return;
    onSend(input);
    setInput('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    for (const file of files) {
      const att = await aiApi.uploadAttachment(file);
      setAttachments((prev) => [...prev, att]);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      speechService.stopListening();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      speechService.startListening(
        (transcript) => setInput((prev) => (prev ? `${prev} ${transcript}` : transcript)),
        () => setIsRecording(false),
        () => setIsRecording(false)
      );
    }
  };

  return (
    <div className="p-3 sm:p-4 bg-slate-900 border-t border-slate-800">
      <div className="max-w-4xl mx-auto bg-slate-950 border border-slate-800 rounded-lg p-2 flex flex-col gap-2 shadow-lg focus-within:border-slate-700 transition">
        {/* Attachment Previews */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 px-2 pt-1">
            {attachments.map((att) => (
              <div key={att.id} className="flex items-center gap-2 px-2 py-1 bg-slate-800 rounded text-xs text-slate-200">
                <FileText size={12} className="text-indigo-400" />
                <span className="truncate max-w-[140px]">{att.filename}</span>
                <button
                  onClick={() => setAttachments((prev) => prev.filter((a) => a.id !== att.id))}
                  className="text-slate-400 hover:text-slate-200"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Multiline Input */}
        <textarea
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Sentinel anything... (Shift+Enter for new line)"
          className="w-full bg-transparent text-xs sm:text-sm text-slate-100 placeholder-slate-500 resize-none px-2 focus:outline-none scrollbar-thin"
        />

        {/* Toolbar Row */}
        <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 px-1">
          <div className="flex items-center gap-1">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition"
              title="Attach document/image"
            >
              <Paperclip size={16} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              className="hidden"
            />

            <button
              onClick={toggleRecording}
              className={`p-1.5 rounded transition ${
                isRecording
                  ? 'bg-rose-500/20 text-rose-400 animate-pulse'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title="Voice transcription"
            >
              <Mic size={16} />
            </button>

            <span className="text-[10px] text-slate-500 ml-2 font-mono">
              Context: Auto
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isGenerating ? (
              <button
                onClick={onStop}
                className="flex items-center gap-1.5 px-3 py-1 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded text-xs transition"
              >
                <Square size={12} />
                <span>Stop</span>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!input.trim() && attachments.length === 0}
                className="p-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded transition shadow"
              >
                <Send size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};