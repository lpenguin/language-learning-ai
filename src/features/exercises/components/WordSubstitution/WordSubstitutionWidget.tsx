import React, { useState } from 'react';
import { ExerciseWidgetProps, ExerciseAnswer } from '../../../../types/exercise';

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
      <div key={sentenceIndex} className="mb-4">
        <div className="flex flex-wrap items-center gap-2">
          {parts.map((part, partIndex) => (
            <React.Fragment key={partIndex}>
              <span>{part}</span>
              {partIndex < parts.length - 1 && (
                <input
                  type="text"
                  className="border-b border-gray-300 px-2 py-1 w-16 bg-transparent focus:outline-none focus:border-blue-500"
                  value={answers[sentenceIndex][partIndex] || ''}
                  onChange={(e) => handleAnswerChange(sentenceIndex, partIndex, e.target.value)}
                  placeholder="Enter word"
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="widget-container">
      <div className="space-y-4">
        {sentences.map((sentence, index) => renderSentence(sentence, index))}
      </div>
      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        Submit Answers
      </button>
    </div>
  );
};

export default React.memo(WordSubstitutionWidget);
