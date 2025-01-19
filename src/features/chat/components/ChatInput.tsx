import React, { FormEvent, ChangeEvent } from 'react';

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

  return (
    <div className="input-area">
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
    </div>
  );
};

export default React.memo(ChatInput);
