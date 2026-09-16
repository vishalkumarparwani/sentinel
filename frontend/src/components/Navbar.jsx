import React from "react";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";
import {
  Menu,
  Sparkles,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar({
  isSidebarOpen,
  setIsSidebarOpen,
  onToggleAI,
}) {
  const { user, setTheme } = useAuth();

  const currentTheme = user?.theme || "dark";

  async function handleThemeToggle() {
    const newTheme =
      currentTheme === "dark" ? "light" : "dark";

    try {
      await setTheme(newTheme);
    } catch (err) {
      console.error("Failed to change theme:", err);
    }
  }

  return (
    <header className="h-14 border-b border-theme-border bg-theme-primary/80 backdrop-blur px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
      
      {/* Left */}
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

      <div className="flex items-center gap-1">
        <button
          onClick={onToggleAI}
          className="flex items-center gap-2 bg-theme-secondary hover:bg-theme-tertiary border border-theme-border text-theme-text text-xs px-3 py-1.5 rounded-lg transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />

          <span className="hidden sm:inline">
            Sentinel Copilot
          </span>
        </button>

        <button
          onClick={handleThemeToggle}
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-theme-muted transition-colors hover:bg-theme-secondary hover:text-theme-text"
          aria-label={`Switch to ${
            currentTheme === "dark" ? "light" : "dark"
          } theme`}
          title={`Switch to ${
            currentTheme === "dark" ? "light" : "dark"
          } theme`}
        >
          {currentTheme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>

        <UserMenu />

      </div>
    </header>
  );
}