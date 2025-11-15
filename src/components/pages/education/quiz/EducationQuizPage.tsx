import { ArrowLeft, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate, useSearchParams } from "react-router-dom"
import { educationData, getDocumentQuiz, mockQuizProgress } from "@/data/education"
import type { DocumentQuiz, QuizProgress } from "@/data/education"
import { useState } from "react"
import { QuizModal, QuizCard, QuizResultsModal } from "./components"

export function EducationQuizPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [selectedQuiz, setSelectedQuiz] = useState<DocumentQuiz | null>(null)
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false)
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false)
  const [selectedQuizProgress, setSelectedQuizProgress] = useState<QuizProgress | null>(null)

  // Get documentId from URL parameters if available
  const currentDocumentId = searchParams.get("documentId") ? parseInt(searchParams.get("documentId")!, 10) : null

  // Filter quizzes by documentId if provided, otherwise show all
  const availableQuizzes = currentDocumentId
    ? Object.values(educationData.quizzes).filter(quiz => quiz.documentId === currentDocumentId)
    : Object.values(educationData.quizzes)

  const getQuizProgress = (quizId: number): QuizProgress | undefined => {
    return mockQuizProgress.find(progress => progress.quizId === quizId)
  }

  const handleStartQuiz = (quizId: number) => {
    const quiz = getDocumentQuiz(quizId)
    const progress = getQuizProgress(quizId)

    if (quiz) {
      setSelectedQuiz(quiz)

      // If quiz is completed, show results modal
      if (progress?.completed) {
        setSelectedQuizProgress(progress)
        setIsResultsModalOpen(true)
      } else {
        // If quiz is not completed, show quiz modal
        setIsQuizModalOpen(true)
      }
    }
  }

  const handleQuizComplete = (score: number, totalQuestions: number, matchPercentage: number, reviewNotes: string[]) => {
    // Here you would typically save the quiz results to your backend/state management
    console.log(`Quiz completed: ${score}/${totalQuestions}, ${matchPercentage}% match`)
    console.log("Review notes:", reviewNotes)
    // You could update the mockQuizProgress or trigger a refetch of quiz data
  }

  const handleCloseModal = () => {
    setIsQuizModalOpen(false)
    setSelectedQuiz(null)
  }

  const handleCloseResultsModal = () => {
    setIsResultsModalOpen(false)
    setSelectedQuiz(null)
    setSelectedQuizProgress(null)
  }

  return (
    <div className="min-h-screen bg-[#1b1b1b] text-white">
      {/* Header */}
      <header className="border-b border-[#3a8a2a] bg-[#1b1b1b] px-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate(currentDocumentId ? `/education/analyse?documentId=${currentDocumentId}` : "/education/analyse")}
            variant="ghost"
            size="sm"
            className="text-white hover:text-white hover:bg-[#3a8a2a]"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'analyse
          </Button>
          <div className="h-6 w-px bg-[#3a8a2a]" />
          <h1 className="text-xl font-semibold text-white">Mes Quiz</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            {currentDocumentId ? "Quiz du Document" : "Quiz Disponibles"}
          </h2>
          <p className="text-white">
            {currentDocumentId
              ? "Quiz générés à partir de ce document spécifique."
              : "Testez vos connaissances avec ces quiz générés à partir de vos documents."
            }
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {availableQuizzes.map((quiz) => {
            const progress = getQuizProgress(quiz.documentId)

            return (
              <QuizCard
                key={quiz.documentId}
                quiz={quiz}
                progress={progress}
                onStartQuiz={handleStartQuiz}
              />
            )
          })}
        </div>

        {availableQuizzes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-white mb-4">
              <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>
                {currentDocumentId
                  ? "Aucun quiz disponible pour ce document."
                  : "Aucun quiz disponible pour le moment."
                }
              </p>
              <p className="text-sm mt-1">
                {currentDocumentId
                  ? "Ce document n'a pas encore de quiz généré."
                  : "Importez et analysez des documents pour générer des quiz."
                }
              </p>
            </div>
            <Button
              onClick={() => navigate(currentDocumentId ? `/education/analyse?documentId=${currentDocumentId}` : "/education/import")}
              variant="outline"
              className="border-[#3a8a2a] text-white hover:bg-[#3a8a2a]"
            >
              {currentDocumentId ? "Retour à l'analyse" : "Importer des documents"}
            </Button>
          </div>
        )}
      </main>

      {/* Quiz Modal */}
      <QuizModal
        quiz={selectedQuiz}
        isOpen={isQuizModalOpen}
        onClose={handleCloseModal}
        onComplete={handleQuizComplete}
      />

      {/* Quiz Results Modal */}
      <QuizResultsModal
        quiz={selectedQuiz}
        progress={selectedQuizProgress}
        isOpen={isResultsModalOpen}
        onClose={handleCloseResultsModal}
      />
    </div>
  )
}