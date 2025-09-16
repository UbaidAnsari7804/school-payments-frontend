import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // initialize: prefer localStorage, otherwise OS preference
  const getInitialTheme = () => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (err) {}
    // fallback to OS preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    // apply theme to <html> so Tailwind's 'dark:' classes work
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');

    try {
      localStorage.setItem('theme', theme);
    } catch (err) {}

    // Optional: keep track of OS changes if user didn't explicitly pick
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      // If user has no saved theme, follow OS
      try {
        if (!localStorage.getItem('theme')) {
          setTheme(e.matches ? 'dark' : 'light');
        }
      } catch (err) {}
    };
    mq.addEventListener?.('change', handleChange);
    return () => mq.removeEventListener?.('change', handleChange);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  const setLight = () => setTheme('light');
  const setDark = () => setTheme('dark');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setLight, setDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
