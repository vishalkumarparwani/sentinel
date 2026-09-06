import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  const isLight = theme === 'light';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
      title={`Switch to ${isLight ? 'dark' : 'light'} mode`}
      className="fixed right-5 top-5 z-50 flex h-9 w-9 items-center justify-center rounded-lg border border-theme-border bg-theme-secondary text-theme-muted transition-colors hover:text-theme-text"
    >
      {isLight ? (
        <Moon size={16} />
      ) : (
        <Sun size={16} />
      )}
    </button>
  );
}
