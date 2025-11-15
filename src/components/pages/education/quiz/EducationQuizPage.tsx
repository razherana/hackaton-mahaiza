import { ArrowLeft, CheckCircle, Clock, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useNavigate, useSearchParams } from "react-router-dom"
import { hardcodedQuizzes } from "../analyse/data/quizData"

// Mock data for quiz completion status
interface QuizProgress {
  quizId: number
  completed: boolean
  score?: number
  totalQuestions?: number
  lastAttempt?: Date
}

// Simulated quiz progress data
const mockQuizProgress: QuizProgress[] = [
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

function getScoreColor(score: number, total: number) {
  const percentage = (score / total) * 100
  if (percentage >= 80) return "text-[#3a8a2a]"
  if (percentage >= 60) return "text-[#3a8a2a]"
  return "text-[#3a8a2a]"
}

function getScoreBadgeVariant(score: number, total: number) {
  const percentage = (score / total) * 100
  if (percentage >= 80) return "default"
  if (percentage >= 60) return "outline"
  return "default"
}

export function EducationQuizPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Get documentId from URL parameters if available
  const currentDocumentId = searchParams.get("documentId") ? parseInt(searchParams.get("documentId")!, 10) : null

  // Filter quizzes by documentId if provided, otherwise show all
  const availableQuizzes = currentDocumentId
    ? Object.values(hardcodedQuizzes).filter(quiz => quiz.documentId === currentDocumentId)
    : Object.values(hardcodedQuizzes)

  const getQuizProgress = (quizId: number): QuizProgress | undefined => {
    return mockQuizProgress.find(progress => progress.quizId === quizId)
  }

  const handleStartQuiz = (quizId: number) => {
    // Navigate to specific quiz (to be implemented)
    console.log(`Starting quiz ${quizId}`)
  }

  const handleRetakeQuiz = (quizId: number) => {
    // Navigate to specific quiz for retaking (to be implemented)
    console.log(`Retaking quiz ${quizId}`)
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
            const isCompleted = progress?.completed || false

            return (
              <Card
                key={quiz.documentId}
                className="bg-[#1b1b1b] border-[#3a8a2a] hover:border-[#3a8a2a] transition-colors"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white text-lg mb-1">
                        {quiz.title}
                      </CardTitle>
                      <CardDescription className="text-white text-sm">
                        {quiz.description}
                      </CardDescription>
                    </div>
                    {isCompleted && (
                      <CheckCircle className="h-5 w-5 text-[#3a8a2a] mt-1 shrink-0" />
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {/* Quiz Info */}
                    <div className="flex items-center gap-4 text-sm text-white">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{quiz.questions.length} questions</span>
                      </div>
                      {isCompleted && progress?.lastAttempt && (
                        <div className="text-xs">
                          Dernière tentative: {progress.lastAttempt.toLocaleDateString('fr-FR')}
                        </div>
                      )}
                    </div>

                    {/* Score Display */}
                    {isCompleted && progress?.score !== undefined && progress?.totalQuestions && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white">Score:</span>
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold ${getScoreColor(progress.score, progress.totalQuestions)}`}>
                              {progress.score}/{progress.totalQuestions}
                            </span>
                            <Badge
                              variant={getScoreBadgeVariant(progress.score, progress.totalQuestions)}
                              className="text-xs bg-[#3a8a2a] text-white border-[#3a8a2a]"
                            >
                              {Math.round((progress.score / progress.totalQuestions) * 100)}%
                            </Badge>
                          </div>
                        </div>
                        {progress.score === progress.totalQuestions && (
                          <div className="flex items-center gap-1 text-[#3a8a2a] text-xs">
                            <Trophy className="h-3 w-3" />
                            <span>Score parfait !</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      {isCompleted ? (
                        <>
                          <Button
                            onClick={() => handleRetakeQuiz(quiz.documentId)}
                            variant="outline"
                            size="sm"
                            className="flex-1 border-[#3a8a2a] text-white hover:bg-[#3a8a2a]"
                          >
                            Refaire
                          </Button>
                          <Button
                            onClick={() => handleStartQuiz(quiz.documentId)}
                            size="sm"
                            className="flex-1 bg-[#3a8a2a] hover:bg-[#3a8a2a] text-white"
                          >
                            Voir les résultats
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={() => handleStartQuiz(quiz.documentId)}
                          size="sm"
                          className="w-full bg-[#3a8a2a] hover:bg-[#3a8a2a] text-white"
                        >
                          Commencer le quiz
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
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
    </div>
  )
}