import { Trophy, BookOpen, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { DocumentQuiz, QuizProgress } from "@/data/education"
import { generateReviewNotes } from "../utils"

interface QuizResultsModalProps {
  quiz: DocumentQuiz | null
  progress: QuizProgress | null
  isOpen: boolean
  onClose: () => void
}

export function QuizResultsModal({ quiz, progress, isOpen, onClose }: QuizResultsModalProps) {
  if (!quiz || !progress || !progress.completed) return null

  const score = progress.score || 0
  const totalQuestions = progress.totalQuestions || 0
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0
  const isPerfectScore = score === totalQuestions

  // Generate some review notes based on the quiz (mock data for now)
  const reviewNotes = generateReviewNotes(quiz.questions, {})

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1b1b1b] border-[#3a8a2a] text-white max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="relative">
          <DialogTitle className="text-white text-center text-xl pr-8">
            Résultats du Quiz
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Quiz Title */}
          <div className="text-center">
            <h3 className="text-lg font-medium text-white mb-1">{quiz.title}</h3>
            <p className="text-sm text-gray-400">{quiz.description}</p>
          </div>

          {/* Score Display */}
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold text-[#3a8a2a]">
              {score}/{totalQuestions}
            </div>
            <div className="text-lg">
              {percentage}% de réussite
            </div>
          </div>

          {/* Last Attempt Date */}
          {progress.lastAttempt && (
            <div className="bg-[#2a2a2a] rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
                <Calendar className="h-4 w-4" />
                <span>
                  Terminé le {progress.lastAttempt.toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          )}

          {/* Match Percentage - Mock data */}
          <div className="bg-[#2a2a2a] rounded-lg p-4 text-center">
            <div className="text-sm text-white mb-1">
              Correspondance avec le document
            </div>
            <div className="text-2xl font-semibold text-[#3a8a2a]">
              {Math.min(percentage + 5, 100)}%
            </div>
            <div className="text-xs text-gray-300 mt-1">
              Vos réponses correspondent bien au contenu analysé
            </div>
          </div>

          {/* Review Notes */}
          {reviewNotes.length > 0 && (
            <div className="bg-[#2a2a2a] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-5 w-5 text-[#3a8a2a]" />
                <span className="font-medium text-white">Points à réviser</span>
              </div>
              <div className="space-y-2">
                {reviewNotes.slice(0, 3).map((note, index) => (
                  <div key={index} className="text-sm text-gray-300 bg-[#1b1b1b] rounded p-2">
                    {note}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trophy for perfect score */}
          {isPerfectScore && (
            <div className="flex items-center justify-center gap-2 text-[#3a8a2a]">
              <Trophy className="h-5 w-5" />
              <span className="font-medium">Score parfait ! Félicitations !</span>
            </div>
          )}

          <Button
            onClick={onClose}
            className="w-full bg-[#3a8a2a] hover:bg-[#2d6b1f] text-white"
          >
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}