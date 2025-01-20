export interface Settings {
  apiKey: string;
  baseURL: string;
}

export interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
}
