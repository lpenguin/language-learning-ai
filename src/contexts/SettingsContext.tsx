import React, { createContext, useContext, useState, useEffect } from 'react';
import { Settings, SettingsContextType } from '../types/settings';

const defaultSettings: Settings = {
  apiKey: '',
  baseURL: 'https://api.openai.com/v1'
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    const storedSettings = localStorage.getItem('appSettings');
    return storedSettings ? JSON.parse(storedSettings) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
