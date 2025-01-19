import React from 'react';
import { ExerciseAnswer } from '../../../../types/exercise';

interface ExerciseAnswerDisplayProps {
  answer: ExerciseAnswer;
}

const ExerciseAnswerDisplay: React.FC<ExerciseAnswerDisplayProps> = ({ answer }) => {
  const getFilledSentence = (sentence: string, answers: string[]) => {
    let filledSentence = sentence;
    answers.forEach(answer => {
      filledSentence = filledSentence.replace('____', `<strong>${answer}</strong>`);
    });
    return filledSentence;
  };

  return (
    <div className="exercise-answer">
      <ol className="pl-8">
        {answer.sentences.map((sentence, index) => (
          <li key={index} className="mb-2">
            <span 
              dangerouslySetInnerHTML={{ 
                __html: getFilledSentence(sentence, answer.filledAnswers[index]) 
              }} 
            />
          </li>
        ))}
      </ol>
    </div>
  );
};

export default ExerciseAnswerDisplay;
