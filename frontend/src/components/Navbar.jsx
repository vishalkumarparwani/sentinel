import React from "react";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";
import { Menu, Sparkles } from "lucide-react";

export default function Navbar({
  isSidebarOpen,
  setIsSidebarOpen,
  onToggleAI,
}) {
  return (
    <header className="h-14 border-b border-theme-border bg-theme-primary/80 backdrop-blur px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-theme-secondary transition-colors"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5 text-theme-muted" />
        </button>

        <SearchBar />
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onToggleAI}
          className="flex items-center gap-2 bg-theme-secondary hover:bg-theme-tertiary border border-theme-border text-theme-text text-xs px-3 py-1.5 rounded-lg transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Sentinel Copilot</span>
        </button>

        <UserMenu />  
      </div>
    </header>
  );
}