import React from 'react';
import { Bell, Moon, User } from 'lucide-react';

export default function UserMenu() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-theme-muted transition-colors hover:bg-theme-secondary hover:text-theme-text"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>

        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-theme-muted transition-colors hover:bg-theme-secondary hover:text-theme-text"
          aria-label="Toggle theme"
        >
          <Moon className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-2 border-l border-theme-border pl-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-theme-border bg-theme-tertiary text-theme-muted">
          <User className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}