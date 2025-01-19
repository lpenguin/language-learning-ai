import { Chat, ChatState } from '../types/chat';
import { Message } from '../types/message';
import { v4 as uuidv4 } from 'uuid';
import { openAIService } from './openai.service';

const STORAGE_KEY = 'language_learning_chats';

class ChatService {
  private static instance: ChatService;

  private constructor() {}

  public static getInstance(): ChatService {
    if (!this.instance) {
      this.instance = new ChatService();
    }
    return this.instance;
  }

  public loadChats(): ChatState {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (!storedData) {
      const initialState = this.createInitialState();
      this.saveChats(initialState);
      return initialState;
    }
    return JSON.parse(storedData);
  }

  public saveChats(state: ChatState): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  public createNewChat(): Chat {
    return {
      id: uuidv4(),
      name: 'New Chat',
      messages: []
    };
  }

  public async generateChatName(firstMessage: string): Promise<string> {
    const systemPrompt = 'You are a helpful assistant that generates short, descriptive titles for language learning conversations. Always respond with just 2-4 words, no punctuation, no quotes.';
    const prompt = `Create a title that captures the main topic or intent of this language learning conversation: "${firstMessage}"`;
    
    try {
      const name = await openAIService.generateResponse([{
        role: 'user',
        content: prompt,
        timestamp: new Date().toISOString()
      }], systemPrompt);
      const cleanedName = name.trim().replace(/^["']|["']$/g, ''); // Remove quotes if present
      return cleanedName || 'New Chat';
    } catch (error) {
      console.error('Failed to generate chat name:', error);
      return 'New Chat';
    }
  }

  private createInitialState(): ChatState {
    const newChat = this.createNewChat();
    return {
      chats: [newChat],
      currentChatId: newChat.id
    };
  }

  public updateChat(state: ChatState, chatId: string, updates: Partial<Chat>): ChatState {
    const newState = {
      ...state,
      chats: state.chats.map(chat => 
        chat.id === chatId ? { ...chat, ...updates } : chat
      )
    };
    this.saveChats(newState);
    return newState;
  }

  public addChat(state: ChatState, chat: Chat): ChatState {
    const newState = {
      ...state,
      chats: [chat, ...state.chats],
      currentChatId: chat.id
    };
    this.saveChats(newState);
    return newState;
  }

  public deleteChat(state: ChatState, chatId: string): ChatState {
    const newState = {
      ...state,
      chats: state.chats.filter(chat => chat.id !== chatId),
      currentChatId: state.currentChatId === chatId 
        ? (state.chats[0]?.id ?? null) 
        : state.currentChatId
    };
    this.saveChats(newState);
    return newState;
  }
}

export const chatService = ChatService.getInstance();
