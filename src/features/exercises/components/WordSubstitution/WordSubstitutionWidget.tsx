import React, { useState } from 'react';
import { ExerciseWidgetProps, ExerciseAnswer } from '../../../../types/exercise';
import './WordSubstitution.css';

const WordSubstitutionWidget: React.FC<ExerciseWidgetProps> = ({ sentences, onSubmit }) => {
  const [answers, setAnswers] = useState<string[][]>(
    sentences.map(sentence => {
      const blanks = (sentence.match(/____/g) || []).length;
      return new Array(blanks).fill('');
    })
  );

  const handleAnswerChange = (sentenceIndex: number, blankIndex: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[sentenceIndex][blankIndex] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    // Filter out sentences with no answers
    const validAnswers = answers.map((sentenceAnswers, idx) => ({
      sentence: sentences[idx],
      answers: sentenceAnswers.map(ans => ans.trim()).filter(ans => ans !== '')
    })).filter(item => item.answers.length > 0);

    if (validAnswers.length > 0) {
      const answer: ExerciseAnswer = {
        sentences: validAnswers.map(item => item.sentence),
        filledAnswers: validAnswers.map(item => item.answers)
      };
      onSubmit(answer);
    }
  };

  const renderSentence = (sentence: string, sentenceIndex: number) => {
    const parts = sentence.split('____');
    return (
      <li key={sentenceIndex} className="sentence-content">
        {parts.map((part, partIndex) => (
          <React.Fragment key={partIndex}>
            <span>{part}</span>
            {partIndex < parts.length - 1 && (
              <input
                type="text"
                className="word-input"
                value={answers[sentenceIndex][partIndex] || ''}
                onChange={(e) => handleAnswerChange(sentenceIndex, partIndex, e.target.value)}
                placeholder="Enter word"
                size={Math.max(8, answers[sentenceIndex][partIndex]?.length || 8)}
              />
            )}
          </React.Fragment>
        ))}
      </li>
    );
  };

  return (
    <div className="widget-container">
      <ol className="sentences-list">
        {sentences.map((sentence, index) => renderSentence(sentence, index))}
      </ol>
      <button
        onClick={handleSubmit}
        className="exercise-submit-button"
      >
        Submit Answers
      </button>
    </div>
  );
};

export default React.memo(WordSubstitutionWidget);
