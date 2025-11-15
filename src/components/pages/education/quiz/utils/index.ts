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

export function generateReviewNotes(
  questions: Array<{ id: string; question: string; options: string[]; correctAnswer: number; explanation: string; difficulty: string }>,
  selectedAnswers: Record<string, number>
): string[] {
  const reviewNotes: string[] = []
  const incorrectQuestions = questions.filter(
    question => selectedAnswers[question.id] !== question.correctAnswer
  )

  if (incorrectQuestions.length === 0) {
    return ["Excellente performance ! Continuez à pratiquer pour maintenir ce niveau."]
  }

  // Group by difficulty for better organization
  const easyIncorrect = incorrectQuestions.filter(q => q.difficulty === "easy")
  const mediumIncorrect = incorrectQuestions.filter(q => q.difficulty === "medium")
  const hardIncorrect = incorrectQuestions.filter(q => q.difficulty === "hard")

  // Add notes based on difficulty levels
  if (easyIncorrect.length > 0) {
    reviewNotes.push("🔍 Réviser les concepts de base : " + easyIncorrect.slice(0, 2).map(q => q.explanation.split('.')[0]).join(", "))
  }

  if (mediumIncorrect.length > 0) {
    reviewNotes.push("📚 Approfondir les concepts intermédiaires pour une meilleure compréhension")
  }

  if (hardIncorrect.length > 0) {
    reviewNotes.push("🎯 Se concentrer sur les concepts avancés nécessitant plus de pratique")
  }

  // Add specific topic recommendations
  const topics = new Set<string>()
  incorrectQuestions.forEach(q => {
    // Extract key topics from questions (simple keyword extraction)
    if (q.question.toLowerCase().includes("équation")) topics.add("équations")
    if (q.question.toLowerCase().includes("variable")) topics.add("variables")
    if (q.question.toLowerCase().includes("fonction")) topics.add("fonctions")
    if (q.question.toLowerCase().includes("graphique")) topics.add("graphiques")
    if (q.question.toLowerCase().includes("calcul")) topics.add("calculs")
  })

  if (topics.size > 0) {
    reviewNotes.push(`📖 Sujets à revoir : ${Array.from(topics).join(", ")}`)
  }

  // Add general advice based on score
  const scorePercentage = ((questions.length - incorrectQuestions.length) / questions.length) * 100
  if (scorePercentage < 50) {
    reviewNotes.push("💡 Conseil : Revoir les bases avant de passer aux concepts plus avancés")
  } else if (scorePercentage < 75) {
    reviewNotes.push("💪 Bon travail ! Quelques révisions ciblées amélioreront votre score")
  }

  return reviewNotes.slice(0, 4) // Limit to 4 most relevant notes
}