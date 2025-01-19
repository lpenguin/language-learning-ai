import { apiClient } from '../api/client';
import { API_CONFIG, SYSTEM_PROMPT } from '../config/api';
import { OpenAIResponse } from '../types/api';
import { Message, SystemMessage, OpenAIRole } from '../types/message';
import { ExerciseAnswer } from '../types/exercise';

interface OpenAIMessage {
  role: OpenAIRole;
  content: string;
}


export class OpenAIService {
  private static instance: OpenAIService;

  private constructor() {}

  public static getInstance(): OpenAIService {
    if (!this.instance) {
      this.instance = new OpenAIService();
    }
    return this.instance;
  }

  public async generateResponse(messages: Message[], customSystemPrompt?: string): Promise<string> {
    const systemMessage: SystemMessage = {
      role: 'system',
      content: customSystemPrompt || SYSTEM_PROMPT
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
      content: prompt
    };

    return this.generateResponse([userMessage]);
  }

  public async checkExerciseAnswers(answer: ExerciseAnswer): Promise<string> {
    const prompt = this.getAnswerCheckingPrompt(answer);
    const userMessage: Message = {
      role: 'user',
      content: prompt
    };

    return this.generateResponse([userMessage]);
  }

  private async makeOpenAIRequest(messages: OpenAIMessage[]): Promise<string> {
    const response = await apiClient.post<OpenAIResponse>('/chat/completions', {
      model: API_CONFIG.model,
      messages: messages,
      temperature: API_CONFIG.temperature,
      max_tokens: API_CONFIG.maxTokens
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
