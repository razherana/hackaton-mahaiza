// Re-export from unified data for backwards compatibility
import { educationData } from "@/data/education"

export { 
  getDocumentAnalysis as getAnalysisByDocumentId,
  simulateAIAnalysis,
  getDocumentQuiz as getQuizByDocumentId
} from "@/data/education"

// Re-export types
export type { QuizQuestion, DocumentQuiz } from "@/data/education"

// Legacy exports
export const hardcodedAnalysisResults = educationData.analysisResults
export const hardcodedQuizzes = educationData.quizzes

// Simulate AI quiz generation (placeholder function)
export function simulateAIQuizGeneration(fileName: string) {
  return {
    documentId: Math.floor(Math.random() * 1000) + 100,
    title: `Quiz généré pour ${fileName}`,
    description: `Quiz automatique généré par l'IA pour ${fileName}`,
    questions: []
  }
}