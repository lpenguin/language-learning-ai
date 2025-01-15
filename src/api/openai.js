import axios from 'axios';

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const OPENAI_API_URL = process.env.REACT_APP_AI_BASE_URL || 'https://api.openai.com/v1';

const systemMessage = {
  role: "system",
  content: `You are a helpful and encouraging language learning tutor. You can:
  1. Answer questions about language learning
  2. Have natural conversations to help practice
  3. Generate exercises when requested
  4. Check exercise answers and provide feedback

  When generating word substitution exercises, respond with JSON in this format:
  {
    "exercise_type": "word_substitution",
    "sentences": ["The ____ cat sits on the mat.", "She ____ to the store."]
  }

  When checking exercise answers, provide clear feedback on mistakes and offer encouragement.
  Keep responses friendly and educational.`
};

export const generateAIResponse = async (messages) => {
  try {
    const response = await axios.post(
      `${OPENAI_API_URL}/chat/completions`,
      {
        model: "gpt-3.5-turbo",
        messages: [systemMessage, ...messages],
        temperature: 0.7,
        max_tokens: 500
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating AI response:', error);
    if (error.response?.data?.error?.message) {
      throw new Error(error.response.data.error.message);
    }
    throw new Error('Failed to generate AI response. Please try again.');
  }
};

// Example exercise request prompt
export const getExercisePrompt = (topic = '') => {
  return `Generate a word substitution exercise${topic ? ` about ${topic}` : ''}. 
  Respond with a JSON object containing exercise_type "word_substitution" and an array of sentences with blanks marked as "____".`;
};

// Example answer checking prompt
export const getAnswerCheckingPrompt = (exerciseAnswers) => {
  return `Check these exercise answers and provide feedback:
  ${JSON.stringify(exerciseAnswers, null, 2)}
  
  Explain any mistakes and suggest improvements.`;
};
