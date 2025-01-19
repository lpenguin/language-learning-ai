# AI Language Learning Assistant

This application is an interactive language learning platform that leverages AI to provide personalized tutoring and practice exercises.

## Core Features

### 1. Interactive Chat Interface
- Users can engage in natural conversations with an AI tutor
- Clean, modern UI with message history display
- Real-time loading states for AI responses
- Messages are color-coded (blue for user, green for AI)

### 2. Word Substitution Exercises
The app specializes in generating and checking word substitution exercises:
- AI can generate contextual fill-in-the-blank exercises
- Exercises are presented in an interactive widget
- Users can input answers for multiple blanks
- System provides feedback on submitted answers

### 3. AI Integration
- Powered by OpenAI's GPT-3.5 Turbo model
- Configurable system prompt that defines the AI's role and capabilities
- Structured exercise generation using JSON format
- Error handling for API interactions

## Technical Architecture

### Main Application (App.tsx)
- Manages the core chat interface and message history
- Handles both regular chat messages and structured exercises
- Maintains application state (messages, input, loading states)
- Processes user inputs and AI responses

### Exercise Component (WordSubstitutionWidget.tsx)
- Renders interactive fill-in-the-blank exercises
- Manages exercise state and user inputs
- Provides a submission interface for answers
- Supports multiple blanks per sentence

### AI Integration (openai.ts)
- Handles communication with OpenAI API
- Manages API authentication and error handling
- Provides structured prompts for exercise generation and answer checking
- Formats responses for consistent application handling

## Data Structures

### Messages
```typescript
interface Message {
  role: 'user' | 'assistant';
  content: string;
  isExercise?: boolean;
  exerciseType?: 'word_substitution';
}
```

### Exercise Format
```typescript
interface WordSubstitutionExercise {
  exercise_type: 'word_substitution';
  sentences: Array<{
    text: string;
    answer: string;
  }>;
}
```

## User Experience Flow

1. **Chat Interaction**
   - User enters messages in the chat input
   - AI responds with conversational assistance or exercises
   - Chat history is maintained and displayed

2. **Exercise Generation**
   - User can request exercises
   - AI generates structured word substitution exercises
   - Exercises are rendered in an interactive widget

3. **Exercise Completion**
   - User fills in blanks in the exercise
   - Answers are collected and submitted
   - AI provides feedback on answers

4. **Error Handling**
   - Graceful handling of API errors
   - User-friendly error messages
   - Loading states for async operations

## Configuration

The application requires the following environment variables:
- `REACT_APP_OPENAI_API_KEY`: OpenAI API authentication key
- `REACT_APP_AI_BASE_URL`: Optional OpenAI API base URL (defaults to official API)
