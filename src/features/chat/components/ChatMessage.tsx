import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message, AssistantMessage, MessagePart } from '../../../types/message';
import { WordSubstitutionExercise, ExerciseAnswer } from '../../../types/exercise';
import WordSubstitutionWidget from '../../exercises/components/WordSubstitution/WordSubstitutionWidget';
import ExerciseAnswerDisplay from '../../exercises/components/WordSubstitution/ExerciseAnswerDisplay';

interface ChatMessageProps {
  message: Message;
  onExerciseSubmit: (answer: ExerciseAnswer) => void;
}

const isAssistantMessage = (message: Message): message is AssistantMessage => {
  return message.role === 'assistant';
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onExerciseSubmit }) => {
  if (isAssistantMessage(message) && message.parts.some(part => part.type === 'exercise')) {
    return (
      <div className="message bot-message">
        <div>
          <strong>AI Tutor: </strong>
        </div>
        {message.parts.map((part, index) => {
          if (part.type === 'text') {
            return (
              <div key={`text-${index}`} className="mb-2">
                <ReactMarkdown>{part.text}</ReactMarkdown>
              </div>
            );
          } else if (part.type === 'exercise') {
            const exercise = part.exercise as WordSubstitutionExercise;
            if (exercise.exercise_type === 'word_substitution') {
              return (
                <div key={`exercise-${index}`} className="mb-4">
                  <WordSubstitutionWidget
                    sentences={exercise.sentences}
                    onSubmit={onExerciseSubmit}
                  />
                </div>
              );
            }
          }
          return null;
        })}
      </div>
    );
  }

  return (
    <div className={`message ${message.role === 'user' ? 'user-message' : 'bot-message'}`}>
      <strong>{message.role === 'user' ? 'You: ' : 'AI Tutor: '}</strong>
      {message.role === 'user' && message.exerciseAnswer ? (
        <ExerciseAnswerDisplay answer={message.exerciseAnswer} />
      ) : (
        <ReactMarkdown>{message.content}</ReactMarkdown>
      )}
    </div>
  );
};

export default React.memo(ChatMessage);
