import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Moon, Sun, Eye, EyeOff } from 'lucide-react';
import { loginUser } from '../../api';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  const toggleTheme = () => {
    setTheme((current) => {
      const nextTheme = current === 'dark' ? 'light' : 'dark';

      document.documentElement.classList.toggle(
        'light',
        nextTheme === 'light'
      );

      localStorage.setItem('theme', nextTheme);

      return nextTheme;
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const data = await loginUser(email, password);
      login(data.user, data.access_token);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-theme-primary px-4 py-8 overflow-hidden">
      {/* Theme Toggle */}
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        className="absolute right-5 top-5 z-50 flex h-9 w-9 items-center justify-center rounded-lg border border-theme-border bg-theme-secondary text-theme-muted transition-colors hover:text-theme-text"
      >
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      {/* Subtle Background Accent */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-amber-500/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Branding */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-theme-border bg-theme-secondary shadow-sm">
            <span className="text-lg font-bold text-amber-400">S</span>
          </div>

          <h1 className="text-xl font-semibold tracking-tight text-theme-text">
            Sentinel
          </h1>

          <p className="mt-1 text-xs text-theme-muted">
            AI-native issue intelligence
          </p>
        </div>

        {/* Login Card */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-theme-border bg-theme-secondary p-6 shadow-xl"
        >
          <div>
            <h2 className="text-lg font-semibold text-theme-text">
              Welcome back
            </h2>

            <p className="mt-1 text-sm text-theme-muted">
              Sign in to continue to your workspace.
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-rose-900/40 bg-rose-950/20 px-3 py-2.5 text-xs text-rose-400">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-xs font-medium text-theme-text"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
              className="h-10 w-full rounded-lg border border-theme-border bg-theme-primary px-3 text-sm text-theme-text placeholder:text-theme-muted/60 transition-colors focus:border-amber-400/60 focus:outline-none focus:ring-1 focus:ring-amber-400/20"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-xs font-medium text-theme-text"
              >
                Password
              </label>

              <Link
                to="/forgot-password"
                className="text-xs text-amber-400 transition-colors hover:text-amber-300"
              >
                Forgot Password?
              </Link>
            </div>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className="h-10 w-full rounded-lg border border-theme-border bg-theme-primary px-3 pr-16 text-sm text-theme-text placeholder:text-theme-muted/60 transition-colors focus:border-amber-400/60 focus:outline-none focus:ring-1 focus:ring-amber-400/20"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-muted transition-colors hover:text-theme-text"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="h-10 w-full rounded-lg bg-theme-text px-4 text-sm font-medium text-theme-primary transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>

          {/* Register */}
          <p className="text-center text-xs text-theme-muted">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-amber-400 transition-colors hover:text-amber-300"
            >
              Create an account
            </Link>
          </p>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-[11px] text-theme-muted/60">
          Sentinel · AI-native issue intelligence
        </p>
      </div>
    </div>
  );
}
