import React from 'react';
import '../../styles/Drawer.css';
import { Chat } from '../../types/chat';
import ChatBubbleIcon from './ChatBubbleIcon';
import PlusIcon from './PlusIcon';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  chats: Chat[];
  currentChatId: string | null;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
}

const getLastUserMessageTimestamp = (chat: Chat): number => {
  const userMessages = chat.messages.filter(msg => msg.role === 'user');
  if (userMessages.length === 0) {
    return new Date(0).getTime(); // Return epoch time if no user messages
  }
  return new Date(userMessages[userMessages.length - 1].timestamp).getTime();
};

const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  chats,
  currentChatId,
  onChatSelect,
  onNewChat
}) => {
  return (
    <>
      {isOpen && (
        <div className="drawer-backdrop" onClick={onClose}>
          <div className={`drawer ${isOpen ? 'open' : ''}`} onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <h2>Menu</h2>
              <button onClick={onClose}>&times;</button>
            </div>
            <div className="drawer-content">
              <div className="new-chat" onClick={onNewChat}>
                <PlusIcon className="new-chat-icon" />
                Start new chat
              </div>
              
              <div className="section">
                <h3>Recents</h3>
                <div className="chat-list">
                  {[...chats]
                    .sort((a, b) => getLastUserMessageTimestamp(b) - getLastUserMessageTimestamp(a))
                    .map(chat => (
                    <div
                      key={chat.id}
                      className={`chat-item ${chat.id === currentChatId ? 'active' : ''}`}
                      onClick={() => {
                        onChatSelect(chat.id);
                        onClose();
                      }}
                    >
                      <ChatBubbleIcon className="chat-icon" />
                      {chat.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(Drawer);
