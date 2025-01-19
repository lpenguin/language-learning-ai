import { Message } from './message';

export interface Chat {
  id: string;
  name: string;
  messages: Message[];
}

export interface ChatState {
  chats: Chat[];
  currentChatId: string | null;
}
