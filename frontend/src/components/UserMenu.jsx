import React from 'react';
import { Bell, User } from 'lucide-react';

export default function UserMenu() {
  return (
    <div className="flex items-center gap-3">
      <button className="p-2 text-theme-muted hover:text-theme-text rounded-lg hover:bg-theme-secondary transition-colors">
        <Bell className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-2 pl-2 border-l border-theme-border">
        <div className="w-7 h-7 rounded-full bg-theme-tertiary border border-theme-border flex items-center justify-center text-theme-muted">
          <User className="w-4 h-4" />
        </div>

        <span className="text-xs font-medium text-theme-muted">
          Vishal (Tech Lead)
        </span>
      </div>
    </div>
  );
}