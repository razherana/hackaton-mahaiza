export interface QuizProgress {
  quizId: number;
  completed: boolean;
  score?: number;
  totalQuestions?: number;
  lastAttempt?: Date;
}

export interface QuizResults {
  score: number;
  total: number;
  matchPercentage: number;
  reviewNotes: string[];
}

export interface QuizModalProps {
  quiz: import("@/data/education").DocumentQuiz | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (
    score: number,
    totalQuestions: number,
    matchPercentage: number,
    reviewNotes: string[]
  ) => void;
}
