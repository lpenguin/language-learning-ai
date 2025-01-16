import React, { useState, FormEvent, ChangeEvent } from 'react';
import WordSubstitutionWidget from './components/WordSubstitutionWidget';
import { generateAIResponse } from './api/openai';
import './index.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isExercise?: boolean;
  exerciseType?: 'word_substitution';
}

interface WordSubstitutionExercise {
  exercise_type: 'word_substitution';
  sentences: Array<{
    text: string;
    answer: string;
  }>;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChatSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const userMessage: Message = {
      role: 'user',
      content: input
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse([...messages, userMessage]);
      let aiMessage: Message;

      // Check if the response is a structured exercise
      try {
        const parsedResponse = JSON.parse(aiResponse) as WordSubstitutionExercise;
        if (parsedResponse.exercise_type === 'word_substitution') {
          aiMessage = {
            role: 'assistant',
            content: aiResponse,
            isExercise: true,
            exerciseType: 'word_substitution'
          };
        } else {
          throw new Error('Not a word substitution exercise');
        }
      } catch {
        // If not JSON, treat as normal message
        aiMessage = {
          role: 'assistant',
          content: aiResponse
        };
      }

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI response error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    }
    setIsLoading(false);
  };

  const handleExerciseSubmit = async (answers: Record<string, string>) => {
    const userMessage: Message = {
      role: 'user',
      content: JSON.stringify(answers)
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse([...messages, userMessage]);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: aiResponse
      }]);
    } catch (error) {
      console.error('AI response error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error checking your answers. Please try again.'
      }]);
    }
    setIsLoading(false);
  };

  const renderMessage = (message: Message, index: number) => {
    if (message.isExercise && message.exerciseType === 'word_substitution') {
      try {
        const exercise = JSON.parse(message.content) as WordSubstitutionExercise;
        return (
          <div key={index} className="mb-4">
            <div className="bg-green-100 p-2 rounded mb-2">
              <strong>AI Tutor: </strong>
              Here's a word substitution exercise for you:
            </div>
            <WordSubstitutionWidget
              sentences={exercise.sentences}
              onSubmit={handleExerciseSubmit}
            />
          </div>
        );
      } catch (error) {
        console.error('Error parsing exercise:', error);
        return (
          <div key={index} className="bg-red-100 p-2 rounded mb-4">
            <strong>Error: </strong>Failed to load exercise
          </div>
        );
      }
    }

    return (
      <div 
        key={index} 
        className={`p-2 rounded mb-4 ${
          message.role === 'user' ? 'bg-blue-100' : 'bg-green-100'
        }`}
      >
        <strong>{message.role === 'user' ? 'You: ' : 'AI Tutor: '}</strong>
        {message.content}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">AI Language Learning Assistant</h1>
        
        <div className="mb-6">
          <p className="text-gray-600 text-center">
            Chat with your AI language tutor! You can:
            <br />
            • Ask questions about language
            <br />
            • Request exercises for practice
            <br />
            • Get feedback on your answers
          </p>
        </div>

        <div className="space-y-4 mb-4 max-h-[60vh] overflow-y-auto">
          {messages.map((message, index) => renderMessage(message, index))}
          {isLoading && (
            <div className="text-center text-gray-500">
              AI Tutor is thinking...
            </div>
          )}
        </div>

        <form onSubmit={handleChatSubmit} className="flex gap-2">
          <input
            value={input}
            placeholder="Chat with your AI tutor or ask for exercises..."
            onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
            className="flex-grow border p-2 rounded"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className={`bg-blue-500 text-white px-4 py-2 rounded ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
            }`}
            disabled={isLoading}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
