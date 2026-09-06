import { createContext, useContext, useEffect, useState } from 'react';
import { updateTheme } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState(
    () => localStorage.getItem('authToken') || null
  );

  const [loading, setLoading] = useState(false);

  // Apply the user's saved theme when authenticated,
  // otherwise use the theme selected on the login/register page.
  useEffect(() => {
    const theme =
      user?.theme ||
      localStorage.getItem('theme') ||
      'dark';

    document.documentElement.classList.toggle(
      'light',
      theme === 'light'
    );
  }, [user?.theme]);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);

    localStorage.setItem('authToken', authToken);
    localStorage.setItem('user', JSON.stringify(userData));

    // The authenticated user's backend theme takes priority.
    const theme = userData?.theme || 'dark';

    document.documentElement.classList.toggle(
      'light',
      theme === 'light'
    );

    localStorage.setItem('theme', theme);
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem('authToken');
    localStorage.removeItem('user');

    // Keep the user's last selected theme for the
    // unauthenticated Login/Register pages.
    const theme = localStorage.getItem('theme') || 'dark';

    document.documentElement.classList.toggle(
      'light',
      theme === 'light'
    );
  };

  const setTheme = async (theme) => {
    const updatedUser = await updateTheme(theme, token);

    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    localStorage.setItem('theme', theme);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        setTheme,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
