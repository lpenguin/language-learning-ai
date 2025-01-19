import { useState, useCallback, useEffect } from 'react';
import { Message, MessageState } from '../../../types/message';
import { ExerciseAnswer } from '../../../types/exercise';
import { openAIService } from '../../../services/openai.service';
import { messageParserService } from '../../../services/messageParser.service';
import { chatService } from '../../../services/chat.service';
import { Chat, ChatState } from '../../../types/chat';

interface UseChatMessagesProps {
  initialChatState?: ChatState;
}

export const useChatMessages = ({ initialChatState }: UseChatMessagesProps = {}) => {
  const [chatState, setChatState] = useState<ChatState>(
    initialChatState || chatService.loadChats()
  );
  const [state, setState] = useState<MessageState>({
    messages: [],
    isLoading: false,
    error: null
  });

  useEffect(() => {
    const currentChat = chatState.chats.find(chat => chat.id === chatState.currentChatId);
    if (currentChat) {
      setState(prev => ({
        ...prev,
        messages: currentChat.messages
      }));
    }
  }, [chatState.currentChatId]);

  const addMessage = useCallback((message: Message) => {
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, message]
    }));
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({
      ...prev,
      isLoading,
      error: isLoading ? null : prev.error
    }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({
      ...prev,
      error,
      isLoading: false
    }));
  }, []);

  const handleChatSubmit = useCallback(async (input: string) => {
    if (!chatState.currentChatId) return;
    if (input.trim() === '') return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };
    const currentChat = chatState.chats.find(chat => chat.id === chatState.currentChatId);
    if (!currentChat) return;

    addMessage(userMessage);

    let updatedState = chatState;

    // If this is the first message, generate a chat name
    if (currentChat.messages.length === 0) {
      try {
        const chatName = await chatService.generateChatName(input);
        updatedState = chatService.updateChat(updatedState, currentChat.id, {
          name: chatName,
          messages: [...currentChat.messages, userMessage]
        });
      } catch (error) {
        console.error('Failed to generate chat name:', error);
        updatedState = chatService.updateChat(updatedState, currentChat.id, {
          messages: [...currentChat.messages, userMessage]
        });
      }
    } else {
      updatedState = chatService.updateChat(updatedState, currentChat.id, {
        messages: [...currentChat.messages, userMessage]
      });
    }
    
    setChatState(updatedState);
    setLoading(true);

    try {
      const aiResponse = await openAIService.generateResponse([...currentChat.messages, userMessage]);
      const aiMessage = messageParserService.parseAIResponse(aiResponse);
      addMessage(aiMessage);

      // Update chat in storage with AI response
      const chatWithUserMessage = updatedState.chats.find(chat => chat.id === updatedState.currentChatId);
      if (chatWithUserMessage) {
        updatedState = chatService.updateChat(updatedState, chatWithUserMessage.id, {
          messages: [...chatWithUserMessage.messages, aiMessage]
        });
        setChatState(updatedState);
      }
    } catch (error) {
      console.error('AI response error:', error);
      setError('Sorry, I encountered an error. Please try again.');
    }
    setLoading(false);
  }, [chatState, addMessage, setLoading, setError]);

  const handleExerciseSubmit = useCallback(async (answer: ExerciseAnswer) => {
    if (!chatState.currentChatId) return;
    
    const userMessage: Message = {
      role: 'user',
      content: '', // Content will be displayed through ExerciseAnswerDisplay
      exerciseAnswer: answer,
      timestamp: new Date().toISOString()
    };

    const currentChat = chatState.chats.find(chat => chat.id === chatState.currentChatId);
    if (!currentChat) return;

    addMessage(userMessage);

    let updatedState = chatState;

    // Update chat in storage with user message
    updatedState = chatService.updateChat(updatedState, currentChat.id, {
      messages: [...currentChat.messages, userMessage]
    });
    setChatState(updatedState);
    setLoading(true);

    try {
      const aiResponse = await openAIService.checkExerciseAnswers(answer);
      const aiMessage: Message = {
        role: 'assistant',
        content: aiResponse,
        parts: [{
          type: 'text',
          text: aiResponse
        }],
        timestamp: new Date().toISOString()
      };
      addMessage(aiMessage);

      // Update chat in storage with AI response
      const chatWithUserMessage = updatedState.chats.find(chat => chat.id === updatedState.currentChatId);
      if (chatWithUserMessage) {
        updatedState = chatService.updateChat(updatedState, chatWithUserMessage.id, {
          messages: [...chatWithUserMessage.messages, aiMessage]
        });
        setChatState(updatedState);
      }
    } catch (error) {
      console.error('AI response error:', error);
      setError('Sorry, I encountered an error checking your answers. Please try again.');
    }
    setLoading(false);
  }, [chatState, addMessage, setLoading, setError]);

  const createNewChat = useCallback(() => {
    const newChat = chatService.createNewChat();
    const updatedState = chatService.addChat(chatState, newChat);
    setChatState(updatedState);
  }, [chatState]);

  const selectChat = useCallback((chatId: string) => {
    setChatState(prev => ({
      ...prev,
      currentChatId: chatId
    }));
  }, []);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    handleChatSubmit,
    handleExerciseSubmit,
    chats: chatState.chats,
    currentChatId: chatState.currentChatId,
    createNewChat,
    selectChat
  };
};
