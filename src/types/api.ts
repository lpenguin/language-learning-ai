import { OpenAIRole } from './message';

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

export class APIConfig {
  readonly apiKey: string;
  readonly baseURL: string;
  readonly model: string = 'gpt-4o';
  readonly temperature: number = 0.7;
  readonly maxTokens: number = 500;

  constructor(apiKey: string, baseURL: string) {
    this.apiKey = apiKey;
    this.baseURL = baseURL;
  }
}
