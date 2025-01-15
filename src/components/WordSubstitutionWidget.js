import React, { useState } from 'react';

const WordSubstitutionWidget = ({ sentences, onSubmit }) => {
  const [answers, setAnswers] = useState(
    sentences.map(sentence => {
      const blanks = (sentence.match(/____/g) || []).length;
      return new Array(blanks).fill('');
    })
  );

  const handleAnswerChange = (sentenceIndex, blankIndex, value) => {
    const newAnswers = [...answers];
    newAnswers[sentenceIndex][blankIndex] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    const exerciseAnswers = sentences.map((sentence, sentenceIndex) => ({
      sentence,
      filledAnswers: answers[sentenceIndex]
    }));
    onSubmit(exerciseAnswers);
  };

  const renderSentence = (sentence, sentenceIndex) => {
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
