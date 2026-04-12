import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import useAuth from '../hooks/useAuth';
import authService from '../services/authService';

const PreferencesContext = createContext(null);

const DEFAULT_PREFERENCES = {
  theme: 'system',
  fontSize: 'medium',
  contentDensity: 'comfortable',
  animations: true,
};

const STORAGE_KEY = 'preferences';

const getStoredPreferences = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) } : DEFAULT_PREFERENCES;
  } catch {
    return DEFAULT_PREFERENCES;
  }
};

export const PreferencesProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [preferences, setPreferences] = useState(getStoredPreferences);

  const { theme, fontSize, contentDensity, animations } = preferences;

  const getSystemTheme = () =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  const [systemTheme, setSystemTheme] = useState(getSystemTheme);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setSystemTheme(e.matches ? 'dark' : 'light');
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const resolvedTheme = theme === 'system' ? systemTheme : theme;

  // Apply theme class to document
  useEffect(() => {
    const root = document.documentElement;

    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [resolvedTheme]);

  // Apply font size, density, and animation classes
  useEffect(() => {
    const root = document.documentElement;

    // Clear previous font-size classes and apply current
    root.classList.forEach((cls) => {
      if (cls.startsWith('font-size-')) root.classList.remove(cls);
    });
    root.classList.add(`font-size-${fontSize}`);

    // Clear previous density classes and apply current
    root.classList.forEach((cls) => {
      if (cls.startsWith('density-')) root.classList.remove(cls);
    });
    root.classList.add(`density-${contentDensity}`);

    // Toggle animations
    if (!animations) {
      root.classList.add('no-animations');
    } else {
      root.classList.remove('no-animations');
    }
  }, [fontSize, contentDensity, animations]);

  const updatePreference = useCallback(async (key, value) => {
    setPreferences((prev) => {
      const updated = { ...prev, [key]: value };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    if (isAuthenticated) {
      try {
        await authService.updatePreferences({ preferences: { [key]: value } });
      } catch (error) {
        console.error('Failed to sync preference with server:', error);
      }
    }
  }, [isAuthenticated]);

  const syncPreferences = useCallback((prefsObject) => {
    const merged = { ...DEFAULT_PREFERENCES, ...prefsObject };
    setPreferences(merged);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  }, []);

  const contextValue = useMemo(() => ({
    theme,
    fontSize,
    contentDensity,
    animations,
    resolvedTheme,
    updatePreference,
    syncPreferences,
  }), [theme, fontSize, contentDensity, animations, resolvedTheme, updatePreference, syncPreferences]);

  return (
    <PreferencesContext.Provider value={contextValue}>
      {children}
    </PreferencesContext.Provider>
  );
};

export default PreferencesContext;
