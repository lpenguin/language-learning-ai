# AI Language Learning Assistant

An interactive chat-based language learning application with AI-powered exercises and feedback.

## Features

- Interactive chat with AI language tutor
- Dynamic word substitution exercises
- Real-time exercise feedback
- Natural conversation practice

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   Create a `.env` file in the project root with:
   ```
   REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Usage

1. Chat naturally with the AI tutor
2. Request exercises by asking something like:
   - "Can you give me a word substitution exercise?"
   - "I want to practice verbs, can you create an exercise?"
   - "Generate an exercise about animals"

3. Complete the exercises by filling in the blanks
4. Submit your answers for AI feedback

## How It Works

The application uses a chat-based interface where you can:
- Have natural conversations with the AI tutor about language learning
- Request exercises when you want to practice
- Get immediate feedback on your answers

When you request an exercise, the AI tutor responds with a structured message that automatically triggers the exercise widget. The exercise format looks like this:

```json
{
  "exercise_type": "word_substitution",
  "sentences": [
    "The ____ cat sits on the mat.",
    "She ____ to the store."
  ]
}
```

After completing the exercise, the AI tutor provides personalized feedback on your answers, pointing out any mistakes and offering suggestions for improvement.

## Technical Stack

- React for the frontend
- Tailwind CSS for styling
- OpenAI API for AI interactions
- Axios for API requests

## Project Structure

- `src/App.js` - Main application component with chat interface
- `src/components/WordSubstitutionWidget.js` - Exercise widget component
- `src/api/openai.js` - OpenAI API integration and prompt management
- `src/index.css` - Global styles and Tailwind configuration

## Future Enhancements

- Additional exercise types (multiple choice, sentence ordering, etc.)
- Progress tracking
- Difficulty levels
- Language-specific exercises
- Speech recognition and pronunciation practice
