import { Exercise, WordSubstitutionExercise, ExerciseAnswer } from "./exercise";

export type MessageRole = 'user' | 'assistant';
export type SystemRole = 'system';
export type OpenAIRole = MessageRole | SystemRole;

interface BaseMessage {
  content: string;
}

export interface SystemMessage {
  role: SystemRole;
  content: string;
}

export interface BaseUserAssistantMessage extends BaseMessage {
  role: MessageRole;
}

export type MessagePartType = 'text' | 'exercise'

export interface TextPart {
  type: 'text'
  text: string
}

export interface ExercisePart {
  type: 'exercise'
  exercise: Exercise
}

export type MessagePart = ExercisePart | TextPart

export interface AssistantMessage extends BaseUserAssistantMessage {
  role: 'assistant'
  parts: MessagePart[];
}

export interface UserMessage extends BaseUserAssistantMessage {
  role: 'user';
  exerciseAnswer?: ExerciseAnswer;
}

export type Message = AssistantMessage | UserMessage;

export interface MessageState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}
