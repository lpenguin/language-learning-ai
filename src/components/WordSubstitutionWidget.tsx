import React, { useState } from 'react';

interface WordSubstitutionWidgetProps {
  sentences: Array<{
    text: string;
    answer: string;
  }>;
  onSubmit: (answers: Record<string, string>) => void;
}

interface ExerciseAnswer {
  sentence: string;
  filledAnswers: string[];
}

const WordSubstitutionWidget: React.FC<WordSubstitutionWidgetProps> = ({ sentences, onSubmit }) => {
  const [answers, setAnswers] = useState<string[][]>(
    sentences.map(sentence => {
      const blanks = (sentence.text.match(/____/g) || []).length;
      return new Array(blanks).fill('');
    })
  );

  const handleAnswerChange = (sentenceIndex: number, blankIndex: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[sentenceIndex][blankIndex] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    const exerciseAnswers: ExerciseAnswer[] = sentences.map((sentence, sentenceIndex) => ({
      sentence: sentence.text,
      filledAnswers: answers[sentenceIndex]
    }));
    onSubmit(exerciseAnswers.reduce((acc, curr, idx) => {
      acc[`sentence${idx + 1}`] = curr.filledAnswers.join(',');
      return acc;
    }, {} as Record<string, string>));
  };

  const renderSentence = (sentence: { text: string; answer: string }, sentenceIndex: number) => {
    const parts = sentence.text.split('____');
    return (
      <div key={sentenceIndex} className="mb-4">
        <div className="flex flex-wrap items-center gap-2">
          {parts.map((part, partIndex) => (
            <React.Fragment key={partIndex}>
              <span>{part}</span>
              {partIndex < parts.length - 1 && (
                <input
                  type="text"
                  className="border border-gray-300 rounded px-2 py-1 w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

export default WordSubstitutionWidget;
