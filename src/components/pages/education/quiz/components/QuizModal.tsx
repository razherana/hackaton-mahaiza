import { useState } from "react"
import { Trophy, Loader2, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { QuizModalProps, QuizResults } from "../types"
import { calculateQuizScore, generateMatchPercentage, generateReviewNotes } from "../utils"

export function QuizModal({ quiz, isOpen, onClose, onComplete }: QuizModalProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState<QuizResults | null>(null)

  if (!quiz) return null

  const resetQuizState = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswers({})
    setIsSubmitting(false)
    setShowResults(false)
    setResults(null)
  }

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1
  const hasAnswered = selectedAnswers[currentQuestion?.id] !== undefined
  const allQuestionsAnswered = quiz.questions.every(q => selectedAnswers[q.id] !== undefined)

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }))
  }

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmitQuiz()
    } else {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleSubmitQuiz = async () => {
    if (!allQuestionsAnswered) return

    setIsSubmitting(true)

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Calculate score and generate review notes
    const { score, total } = calculateQuizScore(quiz.questions, selectedAnswers)
    const matchPercentage = generateMatchPercentage()
    const reviewNotes = generateReviewNotes(quiz.questions, selectedAnswers)

    const finalResults: QuizResults = {
      score,
      total,
      matchPercentage,
      reviewNotes
    }

    setResults(finalResults)
    setShowResults(true)
    setIsSubmitting(false)
  }

  const handleFinish = () => {
    if (results) {
      onComplete(results.score, results.total, results.matchPercentage, results.reviewNotes)
      resetQuizState()
      onClose()
    }
  }

  const handleClose = () => {
    resetQuizState()
    onClose()
  }

  if (showResults && results) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="bg-[#1b1b1b] border-[#3a8a2a] text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white text-center text-xl">
              Quiz Terminé !
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Score Display */}
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-[#3a8a2a]">
                {results.score}/{results.total}
              </div>
              <div className="text-lg">
                {Math.round((results.score / results.total) * 100)}% de réussite
              </div>
            </div>

            {/* Match Percentage */}
            <div className="bg-[#2a2a2a] rounded-lg p-4 text-center">
              <div className="text-sm text-white mb-1">
                Correspondance avec le document
              </div>
              <div className="text-2xl font-semibold text-[#3a8a2a]">
                {results.matchPercentage}%
              </div>
              <div className="text-xs text-white mt-1">
                Vos réponses correspondent bien au contenu analysé
              </div>
            </div>

            {/* Review Notes */}
            <div className="bg-[#2a2a2a] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-5 w-5 text-[#3a8a2a]" />
                <span className="font-medium text-white">Points à réviser</span>
              </div>
              <div className="space-y-2">
                {results.reviewNotes.map((note, index) => (
                  <div key={index} className="text-sm text-white bg-[#1b1b1b] rounded p-2">
                    {note}
                  </div>
                ))}
              </div>
            </div>

            {/* Trophy for perfect score */}
            {results.score === results.total && (
              <div className="flex items-center justify-center gap-2 text-[#3a8a2a]">
                <Trophy className="h-5 w-5" />
                <span className="font-medium">Score parfait !</span>
              </div>
            )}

            <Button
              onClick={handleFinish}
              className="w-full bg-[#3a8a2a] hover:bg-[#2d6b1f] text-white"
            >
              Terminer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (isSubmitting) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="bg-[#1b1b1b] border-[#3a8a2a] text-white max-w-lg">
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-[#3a8a2a]" />
            <div className="text-center">
              <div className="text-lg font-medium mb-2">Analyse en cours...</div>
              <div className="text-sm text-white">
                Calcul de votre score et correspondance avec le document
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={handleClose}
      key={quiz?.documentId} // This will reset component state when quiz changes
    >
      <DialogContent className="bg-[#1b1b1b] border-[#3a8a2a] text-white max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white text-lg">
              {quiz.title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-white">
            Question {currentQuestionIndex + 1} sur {quiz.questions.length}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-white">
              <span>Progression</span>
              <span>{Math.round(((currentQuestionIndex + 1) / quiz.questions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-[#2a2a2a] rounded-full h-2">
              <div
                className="bg-[#3a8a2a] h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="space-y-4">
            <div className="text-lg font-medium text-white">
              {currentQuestion.question}
            </div>

            {/* Answer Options */}
            <div className="space-y-2">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(currentQuestion.id, index)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${selectedAnswers[currentQuestion.id] === index
                    ? 'border-[#3a8a2a] bg-[#3a8a2a] bg-opacity-20'
                    : 'border-[#2a2a2a] hover:border-[#3a8a2a] hover:bg-[#2a2a2a]'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${selectedAnswers[currentQuestion.id] === index
                      ? 'border-[#3a8a2a] bg-[#3a8a2a]'
                      : 'border-[#666]'
                      }`}>
                      {selectedAnswers[currentQuestion.id] === index && (
                        <div className="w-2 h-2 rounded-full bg-white mx-auto mt-0.5" />
                      )}
                    </div>
                    <span className="text-white">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              variant="outline"
              className="border-[#3a8a2a] text-white hover:bg-[#3a8a2a] disabled:opacity-50"
            >
              Précédent
            </Button>

            <Button
              onClick={handleNext}
              disabled={!hasAnswered}
              className="bg-[#3a8a2a] hover:bg-[#2d6b1f] text-white disabled:opacity-50"
            >
              {isLastQuestion ? 'Terminer' : 'Suivant'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}