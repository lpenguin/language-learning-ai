import { apiClient } from '../api/client';
import { SYSTEM_PROMPT } from '../config/api';
import { APIConfig, OpenAIResponse } from '../types/api';
import { Message, SystemMessage, OpenAIRole } from '../types/message';
import { ExerciseAnswer } from '../types/exercise';

interface OpenAIMessage {
  role: OpenAIRole;
  content: string;
}

export class OpenAIService {
  private static instance: OpenAIService;
  private currentApiKey: string = '';
  private currentBaseURL: string = 'https://api.openai.com/v1';

  private constructor() {}

  public static getInstance(): OpenAIService {
    if (!this.instance) {
      this.instance = new OpenAIService();
    }
    return this.instance;
  }

  public setApiKey(apiKey: string, baseURL: string) {
    this.currentApiKey = apiKey;
    this.currentBaseURL = baseURL;
    apiClient.updateConfig(apiKey, baseURL);
  }

  public async generateResponse(messages: Message[], customSystemPrompt?: string): Promise<string> {
    if (!this.currentApiKey) {
      throw new Error('API key not set. Please configure your API key in settings.');
    }

    const systemMessage: SystemMessage = {
      role: 'system',
      content: customSystemPrompt || SYSTEM_PROMPT,
      timestamp: new Date().toISOString()
    };
    
    const formattedMessages: OpenAIMessage[] = [
      systemMessage,
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    return this.makeOpenAIRequest(formattedMessages);
  }

  public async generateExercise(topic: string = ''): Promise<string> {
    const prompt = this.getExercisePrompt(topic);
    const userMessage: Message = {
      role: 'user',
      content: prompt,
      timestamp: new Date().toISOString()
    };

    return this.generateResponse([userMessage]);
  }

  public async checkExerciseAnswers(answer: ExerciseAnswer): Promise<string> {
    const prompt = this.getAnswerCheckingPrompt(answer);
    const userMessage: Message = {
      role: 'user',
      content: prompt,
      timestamp: new Date().toISOString()
    };

    return this.generateResponse([userMessage]);
  }

  private async makeOpenAIRequest(messages: OpenAIMessage[]): Promise<string> {
    const config = new APIConfig(this.currentApiKey, this.currentBaseURL);
    
    const response = await apiClient.post<OpenAIResponse>('/chat/completions', {
      model: config.model,
      messages: messages,
      temperature: config.temperature,
      max_tokens: config.maxTokens
    });

    return response.choices[0].message.content;
  }

  private getExercisePrompt(topic: string): string {
    return `Generate a word substitution exercise${topic ? ` about ${topic}` : ''}. 
    You can provide explanatory text about the exercise, followed by the exercise itself in JSON format. 
    The JSON should contain exercise_type "word_substitution" and an array of sentences with blanks marked as "____".`;
  }

  private getAnswerCheckingPrompt(answer: ExerciseAnswer): string {
    const answersFormatted = answer.sentences.map((sentence, idx) => 
      `Sentence ${idx + 1}: ${sentence}
      Answers: ${answer.filledAnswers[idx].join(', ')}`
    ).join('\n\n');

    return `Check these exercise answers and provide feedback:
    ${answersFormatted}
    
    Please evaluate each answer and provide specific feedback on accuracy, grammar, and any suggested improvements.`;
  }
}

// Export a singleton instance
export const openAIService = OpenAIService.getInstance();
