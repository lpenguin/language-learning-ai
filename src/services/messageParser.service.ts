import { AssistantMessage, Message, MessagePart } from '../types/message';
import { WordSubstitutionExercise } from '../types/exercise';

export class MessageParserService {
  private static instance: MessageParserService;

  private constructor() {}

  public static getInstance(): MessageParserService {
    if (!this.instance) {
      this.instance = new MessageParserService();
    }
    return this.instance;
  }

  public parseAIResponse(response: string): AssistantMessage {
    const jsonMatches = Array.from(response.matchAll(/```json\s*({[\s\S]*?})\s*```/g));
      
    if (jsonMatches.length > 0) {
      try {
        const parts = this.extractMessageParts(response, jsonMatches);
        return {
          role: 'assistant',
          content: response,
          parts: parts
        };
      } catch (error) {
        console.error('Error parsing exercise:', error);
      }
    }

    return {
      role: 'assistant',
      content: response,
      parts: [{
        type: 'text',
        text: response
      }]
    };
  }

  private extractMessageParts(
    response: string,
    jsonMatches: RegExpMatchArray[]
  ): MessagePart[] {
    const parts: MessagePart[] = [];
    let lastIndex = 0;

    for (const match of jsonMatches) {
      const textBeforeExercise = response.substring(lastIndex, match.index).trim();
      if (textBeforeExercise.length > 0) {
        parts.push({
          type: 'text',
          text: textBeforeExercise
        });
      }
      lastIndex = match.index! + match[0].length;

      try {
        const parsedExercise = JSON.parse(match[1]) as WordSubstitutionExercise;
        if (parsedExercise.exercise_type === 'word_substitution') {
          parts.push({
            type: 'exercise',
            exercise: parsedExercise
          });
        }
      } catch (error) {
        console.error('Error parsing exercise JSON:', error);
      }
    }

    const remainingText = response.substring(lastIndex).trim();
    if (remainingText.length > 0) {
      parts.push({
        type: 'text',
        text: remainingText
      });
    }

    if (!parts.some(part => part.type === 'exercise')) {
      throw new Error('No valid word substitution exercises found');
    }

    return parts;
  }
}

export const messageParserService = MessageParserService.getInstance();
