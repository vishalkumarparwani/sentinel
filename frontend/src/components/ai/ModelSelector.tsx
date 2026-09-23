import React from "react";
import type { AIModel } from "../../types/ai";

interface ModelSelectorProps {
  models: AIModel[];
  selectedModel: AIModel;
  onChange: (model: AIModel) => void;
}

export default function ModelSelector({
  models,
  selectedModel,
  onChange,
}: ModelSelectorProps) {
  return (
    <select
      value={selectedModel.model}
      onChange={(event) => {
        const model = models.find(
          (item) => item.model === event.target.value
        );

        if (model) onChange(model);
      }}
      className="max-w-[180px] rounded-lg border border-theme-border bg-theme-secondary px-3 py-2 text-xs outline-none"
    >
      {models.map((model) => (
        <option
          key={`${model.provider}-${model.model}`}
          value={model.model}
        >
          {model.display_name}
        </option>
      ))}
    </select>
  );
}