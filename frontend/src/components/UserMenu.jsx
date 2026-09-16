import React from "react";
import { User } from "lucide-react";

export default function UserMenu() {
  return (
    <div className="flex items-center gap-2 border-l border-theme-border ml-1 pl-2">
      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-theme-border bg-theme-tertiary text-theme-muted hover:text-theme-text hover:border-theme-muted transition-colors"
        aria-label="Profile"
        title="Profile"
      >
        <User className="h-4 w-4" />
      </button>
    </div>
  );
}