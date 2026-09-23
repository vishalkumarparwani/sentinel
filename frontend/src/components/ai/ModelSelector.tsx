import React, { useState } from 'react';
import { ChevronDown, Search, Check, Circle } from 'lucide-react';
import { AIModel } from '../../types/ai';

interface ModelSelectorProps {
  models: AIModel[];
  selectedModel: AIModel | null;
  onSelect: (model: AIModel) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ models, selectedModel, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const statusMap = {
    available: { color: 'bg-emerald-500', text: 'Available' },
    api_key_required: { color: 'bg-amber-500', text: 'Key Required' },
    rate_limited: { color: 'bg-orange-500', text: 'Rate Limited' },
    unavailable: { color: 'bg-rose-500', text: 'Unavailable' },
  };

  const providers = Array.from(new Set(models.map((m) => m.provider_name)));
  const filteredModels = models.filter(
    (m) =>
      m.display_name.toLowerCase().includes(search.toLowerCase()) ||
      m.provider_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-slate-950 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-md text-xs font-medium text-slate-200 transition"
      >
        <span
          className={`w-2 h-2 rounded-full ${
            statusMap[selectedModel?.status || 'unavailable'].color
          }`}
        />
        <span>{selectedModel ? selectedModel.display_name : 'Select Model'}</span>
        <ChevronDown size={14} className="text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 sm:left-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-lg shadow-xl z-50 p-2 text-xs">
          {/* Search Box */}
          <div className="relative mb-2">
            <Search size={12} className="absolute left-2.5 top-2.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter models..."
              className="w-full bg-slate-950 border border-slate-800 rounded pl-8 pr-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Grouped Models */}
          <div className="max-h-64 overflow-y-auto space-y-3 scrollbar-thin">
            {providers.map((pName) => {
              const group = filteredModels.filter((m) => m.provider_name === pName);
              if (group.length === 0) return null;
              return (
                <div key={pName}>
                  <div className="px-2 py-1 font-semibold text-[10px] text-slate-500 uppercase tracking-wider">
                    {pName}
                  </div>
                  {group.map((m) => {
                    const isSelected = selectedModel?.model === m.model;
                    const st = statusMap[m.status];
                    return (
                      <div
                        key={m.model}
                        onClick={() => {
                          onSelect(m);
                          setIsOpen(false);
                        }}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-md cursor-pointer transition ${
                          isSelected ? 'bg-indigo-600/20 text-indigo-300' : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${st.color}`} />
                          <span>{m.display_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500">{st.text}</span>
                          {isSelected && <Check size={12} className="text-indigo-400" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};