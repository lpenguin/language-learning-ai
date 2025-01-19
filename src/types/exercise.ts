export type ExcersiceType = 'word_substitution'

export interface WordSubstitutionExercise {
  exercise_type: 'word_substitution';
  sentences: string[];
}

export type Exercise = WordSubstitutionExercise;

export interface ExerciseAnswer {
  sentences: string[];
  filledAnswers: string[][];
}

export interface ExerciseSubmission {
  [key: string]: string; // e.g., { sentence1: "answer1,answer2" }
}

export interface ExerciseState {
  currentExercise: WordSubstitutionExercise | null;
  answers: string[][];
  isSubmitting: boolean;
  feedback: string | null;
  error: string | null;
}

export interface ExerciseWidgetProps {
  sentences: string[];
  onSubmit: (answer: ExerciseAnswer) => void;
}
