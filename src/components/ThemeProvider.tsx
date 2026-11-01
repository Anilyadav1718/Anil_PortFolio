'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'LIGHT_OS' | 'DARK_OS';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'LIGHT_OS',
  toggleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>('LIGHT_OS');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read persisted theme or system preference
    const stored = localStorage.getItem('anil_portfolio_theme') as Theme | null;
    let initial: Theme = 'LIGHT_OS';

    if (stored === 'LIGHT_OS' || stored === 'DARK_OS') {
      initial = stored;
    } else if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      initial = 'DARK_OS';
    }

    setThemeState(initial);
    document.documentElement.setAttribute('data-theme', initial);
    setMounted(true);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('anil_portfolio_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const toggleTheme = () => {
    const next = theme === 'LIGHT_OS' ? 'DARK_OS' : 'LIGHT_OS';
    setTheme(next);
  };

  // Prevent flash while mounting
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      <div className={`system-grid min-h-screen text-theme-text transition-colors duration-200 ${mounted ? '' : 'opacity-95'}`}>
        <div className="crt-scanlines" aria-hidden="true" />
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

