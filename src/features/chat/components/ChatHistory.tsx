import React from 'react';
import { Message } from '../../../types/message';
import { ExerciseAnswer } from '../../../types/exercise';
import ChatMessage from './ChatMessage';

interface ChatHistoryProps {
  messages: Message[];
  isLoading: boolean;
  onExerciseSubmit: (answer: ExerciseAnswer) => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  messages,
  isLoading,
  onExerciseSubmit
}) => {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="messages">
      {messages.map((message, index) => (
        <ChatMessage
          key={index}
          message={message}
          onExerciseSubmit={onExerciseSubmit}
        />
      ))}
      {isLoading && (
        <div className="message bot-message">
          AI Tutor is thinking...
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default React.memo(ChatHistory);
