export interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export interface OpenAIError {
  error: {
    message: string;
  };
}

export interface APIConfig {
  apiKey: string;
  baseURL: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

import { OpenAIRole } from './message';

export interface APIRequestOptions {
  messages: Array<{
    role: OpenAIRole;
    content: string;
  }>;
}

export interface APIErrorResponse {
  message: string;
  code?: string;
  status?: number;
}
