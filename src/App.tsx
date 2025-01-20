import React, { useState, ChangeEvent, useEffect } from 'react';
import { SettingsProvider } from './contexts/SettingsContext';
import { SettingsDialog } from './components/SettingsDialog';
import ChatInput from './features/chat/components/ChatInput';
import ChatHistory from './features/chat/components/ChatHistory';
import Drawer from './common/components/Drawer';
import { useChatMessages } from './features/chat/hooks/useChatMessages';
import './styles/Chat.css';
import './styles/Drawer.css';
import './index.css';

const AppContent = () => {
  const [input, setInput] = useState<string>('');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const { 
    messages, 
    isLoading, 
    error, 
    handleChatSubmit, 
    handleExerciseSubmit,
    chats,
    currentChatId,
    createNewChat,
    selectChat
  } = useChatMessages();

  const currentChat = chats.find(chat => chat.id === currentChatId);

  useEffect(() => {
    // Create initial chat if none exists
    if (chats.length === 0) {
      createNewChat();
    }
  }, [chats.length, createNewChat]);

  const onInputSubmit = async () => {
    await handleChatSubmit(input);
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <div className="container">
      <div className="header-container">
        {!isDrawerOpen && (
          <button 
            className="menu-toggle" 
            onClick={() => setIsDrawerOpen(true)}
          >
            ☰
          </button>
        )}
          <div className="chat-header">
            {currentChat?.name || 'New Chat'}
          </div>
        <button 
          className="settings-button" 
          onClick={() => setIsSettingsOpen(true)}
        >
          ⚙️
        </button>
      </div>

      <Drawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)}
        chats={chats}
        currentChatId={currentChatId}
        onChatSelect={selectChat}
        onNewChat={createNewChat}
      />

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <ChatHistory
        messages={messages}
        isLoading={isLoading}
        onExerciseSubmit={handleExerciseSubmit}
      />

      <ChatInput
        value={input}
        isLoading={isLoading}
        onChange={onInputChange}
        onSubmit={onInputSubmit}
        onAfterSubmit={() => setInput('')}
      />

      <SettingsDialog 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}

export default App;
