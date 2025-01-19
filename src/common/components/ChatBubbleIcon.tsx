import React from 'react';

const ChatBubbleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12.5 2.5H3.5C2.7 2.5 2 3.2 2 4V13L4.5 10.5H12.5C13.3 10.5 14 9.8 14 9V4C14 3.2 13.3 2.5 12.5 2.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

export default ChatBubbleIcon;
