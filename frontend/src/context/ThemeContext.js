// frontend/src/context/ThemeContext.js
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import useConversationStore from '../store/conversationStore';

const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
  const settings = useConversationStore(state => state.settings);
  const updateSettings = useConversationStore(state => state.updateSettings);
  const [isDark, setIsDark] = useState(() => {
    // Initialize theme state
    if (settings.theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return settings.theme === 'dark';
  });

  // Memoize theme update function
  const updateTheme = useCallback((darkMode) => {
    setIsDark(darkMode);
    document.documentElement.classList.toggle('dark', darkMode);
  }, []);

  // Handle system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      if (settings.theme === 'system') {
        updateTheme(e.matches);
      }
    };

    // Initial setup
    if (settings.theme === 'system') {
      updateTheme(mediaQuery.matches);
    } else {
      updateTheme(settings.theme === 'dark');
    }

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [settings.theme, updateTheme]);

  const toggleTheme = useCallback(() => {
    const newTheme = isDark ? 'light' : 'dark';
    updateSettings({ ...settings, theme: newTheme });
  }, [isDark, updateSettings, settings]);

  const setTheme = useCallback((theme) => {
    updateSettings({ ...settings, theme });
  }, [updateSettings, settings]);

  const contextValue = React.useMemo(() => ({
    isDark,
    toggleTheme,
    setTheme,
    theme: settings.theme
  }), [isDark, toggleTheme, setTheme, settings.theme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}