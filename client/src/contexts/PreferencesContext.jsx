import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
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

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};

export const PreferencesProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [preferences, setPreferences] = useState(getStoredPreferences);

  const { theme, fontSize, contentDensity, animations } = preferences;

  // Resolve effective theme based on system preference
  const [resolvedTheme, setResolvedTheme] = useState('light');

  useEffect(() => {
    if (theme !== 'system') {
      setResolvedTheme(theme);
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');

    const handleChange = (e) => setResolvedTheme(e.matches ? 'dark' : 'light');
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

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
        await authService.updatePreferences({ [key]: value });
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
