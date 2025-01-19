import { Message } from './message';

export interface Chat {
  id: string;
  name: string;
  messages: Message[];
  createdAt: string;
}

export interface ChatState {
  chats: Chat[];
  currentChatId: string | null;
}
