import type { QuizProgress } from "../types"

// Simulated quiz progress data
export const mockQuizProgress: QuizProgress[] = [
  {
    quizId: 1,
    completed: true,
    score: 8,
    totalQuestions: 10,
    lastAttempt: new Date('2024-11-10')
  },
  {
    quizId: 2,
    completed: false
  },
  {
    quizId: 3,
    completed: true,
    score: 6,
    totalQuestions: 8,
    lastAttempt: new Date('2024-11-12')
  },
  {
    quizId: 4,
    completed: true,
    score: 10,
    totalQuestions: 10,
    lastAttempt: new Date('2024-11-14')
  }
]