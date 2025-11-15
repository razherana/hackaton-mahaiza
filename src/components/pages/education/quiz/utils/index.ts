export function getScoreColor(score: number, total: number): string {
  const percentage = (score / total) * 100
  if (percentage >= 80) return "text-[#3a8a2a]"
  if (percentage >= 60) return "text-[#3a8a2a]"
  return "text-[#3a8a2a]"
}

export function getScoreBadgeVariant(score: number, total: number): "default" | "outline" {
  const percentage = (score / total) * 100
  if (percentage >= 80) return "default"
  if (percentage >= 60) return "outline"
  return "default"
}

export function calculateQuizScore(
  questions: Array<{ id: string; correctAnswer: number }>,
  selectedAnswers: Record<string, number>
): { score: number; total: number } {
  let correctAnswers = 0
  questions.forEach(question => {
    if (selectedAnswers[question.id] === question.correctAnswer) {
      correctAnswers++
    }
  })
  
  return {
    score: correctAnswers,
    total: questions.length
  }
}

export function generateMatchPercentage(): number {
  // Generate random match percentage (between 70-95% for realistic simulation)
  return Math.floor(Math.random() * 26) + 70
}