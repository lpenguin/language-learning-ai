import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import '../styles/SettingsDialog.css';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useSettings();
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [baseURL, setBaseURL] = useState(settings.baseURL);

  const handleSave = () => {
    updateSettings({ apiKey, baseURL });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="settings-dialog-overlay">
      <div className="settings-dialog">
        <div className="settings-dialog-header">
          <h2>Settings</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="settings-dialog-content">
          <div className="settings-field">
            <label htmlFor="apiKey">ChatGPT API Key</label>
            <input
              type="password"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your OpenAI API key"
            />
          </div>
          <div className="settings-field">
            <label htmlFor="baseURL">OpenAI Base URL</label>
            <input
              type="text"
              id="baseURL"
              value={baseURL}
              onChange={(e) => setBaseURL(e.target.value)}
              placeholder="https://api.openai.com/v1"
            />
          </div>
        </div>
        <div className="settings-dialog-footer">
          <button className="cancel-button" onClick={onClose}>Cancel</button>
          <button className="save-button" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};
