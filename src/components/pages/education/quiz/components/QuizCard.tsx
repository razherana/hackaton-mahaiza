import { CheckCircle, Clock, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { DocumentQuiz, QuizProgress } from "@/data/education"
import { getScoreColor, getScoreBadgeVariant } from "../utils"

interface QuizCardProps {
  quiz: DocumentQuiz
  progress?: QuizProgress
  onStartQuiz: (quizId: number) => void
}

export function QuizCard({ quiz, progress, onStartQuiz }: QuizCardProps) {
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
            <Button
              onClick={() => onStartQuiz(quiz.documentId)}
              size="sm"
              className="w-full bg-[#3a8a2a] hover:bg-[#3a8a2a] text-white"
            >
              {isCompleted ? "Voir les résultats" : "Commencer le quiz"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}