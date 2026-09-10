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
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-theme-border bg-theme-primary/80 px-4 backdrop-blur md:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="rounded-lg p-2 transition-colors hover:bg-theme-secondary md:hidden"
          aria-label="Toggle Sidebar"
        >
          <Menu className="h-5 w-5 text-theme-muted" />
        </button>

        <SearchBar />
      </div>

      <div className="ml-3 flex shrink-0 items-center gap-4">
        <button
          type="button"
          onClick={onToggleAI}
          aria-label="Open Sentinel Copilot"
          title="Sentinel Copilot"
          className="flex h-8 items-center gap-2 rounded-lg border border-theme-border bg-theme-secondary px-2.5 text-xs text-theme-text transition-colors hover:bg-theme-tertiary xl:px-3"
        >
          <Sparkles className="h-3.5 w-3.5 shrink-0 text-amber-400" />

          <span className="hidden xl:inline">Sentinel Copilot</span>
        </button>

        <UserMenu />
      </div>
    </header>
  );
}