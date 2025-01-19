import React, { FormEvent, ChangeEvent } from 'react';
import PaperPlaneIcon from '../../../common/components/PaperPlaneIcon';

interface ChatInputProps {
  value: string;
  isLoading: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onAfterSubmit?: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  value,
  isLoading,
  onChange,
  onSubmit,
  onAfterSubmit
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Force focus whenever value changes
  React.useEffect(() => {
    inputRef.current?.focus();
  }, [value]);

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      await onSubmit({} as FormEvent<HTMLFormElement>);
      onAfterSubmit?.();
    }
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!isLoading) {
      await onSubmit({} as FormEvent<HTMLFormElement>);
      onAfterSubmit?.();
    }
  };

  return (
    <div className="input-area">
      <div className="input-container">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          onBlur={() => inputRef.current?.focus()} // Force focus on blur
          placeholder="Chat with your AI tutor or ask for exercises..."
          className="message-input"
          disabled={isLoading}
        />
        <button
          onClick={handleSubmit}
          className="submit-button"
          disabled={isLoading}
          aria-label="Send message"
        >
          <PaperPlaneIcon />
        </button>
      </div>
    </div>
  );
};

export default React.memo(ChatInput);
