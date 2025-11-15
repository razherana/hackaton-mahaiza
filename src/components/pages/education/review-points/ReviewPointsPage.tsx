import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { ArrowLeft, Eye, CheckCircle, Circle, Target, Clock, BookMarked } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { sampleReviewPoints, toggleReviewPointLearned } from "./data/reviewPoints"
import type { ReviewPoint } from "../analyse/types"
import { useAnalysis } from "../analyse/context/useAnalysis"

interface ReviewPointCardProps {
  point: ReviewPoint
  onToggleLearned: (pointId: string) => void
  onShowInPDF: (point: ReviewPoint) => void
}

function ReviewPointCard({ point, onToggleLearned, onShowInPDF }: ReviewPointCardProps) {
  const getDifficultyColor = (difficulty: ReviewPoint['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-900/50 text-green-300 border-green-600'
      case 'medium': return 'bg-yellow-900/50 text-yellow-300 border-yellow-600'
      case 'hard': return 'bg-red-900/50 text-red-300 border-red-600'
      default: return 'bg-gray-900/50 text-gray-300 border-gray-600'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Card className="p-4 bg-[#1a1a1a] border-[#2a2a2a] hover:border-[#3a8a2a] transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-[#f5f5f5] mb-1 truncate">
            {point.title}
          </h3>
          <p className="text-xs text-[#b0b0b0] mb-2">
            {point.description}
          </p>
        </div>
        <div className="flex items-center gap-2 ml-3">
          <Badge 
            variant="outline" 
            className={`text-xs ${getDifficultyColor(point.difficulty)}`}
          >
            {point.difficulty}
          </Badge>
          <Button
            onClick={() => onToggleLearned(point.id)}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-[#b0b0b0] hover:text-[#3a8a2a]"
          >
            {point.isLearned ? (
              <CheckCircle className="h-4 w-4 text-[#3a8a2a]" />
            ) : (
              <Circle className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="bg-[#0a0a0a] rounded p-3 mb-3 border border-[#2a2a2a]">
        <p className="text-xs text-[#e0e0e0] leading-relaxed">
          {point.content}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-[#b0b0b0]">
          <span className="flex items-center gap-1">
            <BookMarked className="h-3 w-3" />
            {point.category}
          </span>
          <span className="flex items-center gap-1">
            <Target className="h-3 w-3" />
            Page {point.pageNumber}
          </span>
          {point.lastReviewed && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDate(point.lastReviewed)}
            </span>
          )}
        </div>
        
        <Button
          onClick={() => onShowInPDF(point)}
          variant="outline"
          size="sm"
          className="h-7 px-3 text-xs border-[#3a8a2a] text-[#3a8a2a] hover:bg-[#3a8a2a] hover:text-white"
        >
          <Eye className="h-3 w-3 mr-1" />
          Voir dans PDF
        </Button>
      </div>
    </Card>
  )
}

export function ReviewPointsPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { setIsPreviewOpen, setIsFloating, setCurrentHighlightRequest } = useAnalysis()
  const [reviewPoints, setReviewPoints] = useState(sampleReviewPoints)
  const [filter, setFilter] = useState<'all' | 'learned' | 'unlearned'>('all')
  
  const documentId = searchParams.get('documentId')

  const handleToggleLearned = (pointId: string) => {
    const updatedPoints = toggleReviewPointLearned(pointId)
    setReviewPoints([...updatedPoints])
  }

  const handleShowInPDF = (point: ReviewPoint) => {
    // Enable preview and set it to floating mode
    setIsPreviewOpen(true)
    setIsFloating(true)
    
    // Set highlight request for the PDF viewer
    if (point.highlights) {
      setCurrentHighlightRequest({
        searchText: point.highlights.searchText,
        page: point.highlights.page,
        matches: point.highlights.matches
      })
    }
  }

  const filteredPoints = reviewPoints.filter(point => {
    switch (filter) {
      case 'learned': return point.isLearned
      case 'unlearned': return !point.isLearned
      default: return true
    }
  })

  const learnedCount = reviewPoints.filter(p => p.isLearned).length
  const totalCount = reviewPoints.length

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#f5f5f5]">
      {/* Header */}
      <div className="border-b border-[#2a2a2a] bg-[#1a1a1a] p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Button
              onClick={() => navigate(-1)}
              variant="ghost"
              size="sm"
              className="text-[#b0b0b0] hover:text-[#f5f5f5]"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-[#f5f5f5]">Points à réviser</h1>
              <p className="text-sm text-[#b0b0b0] mt-1">
                Gérez vos points de révision et suivez vos progrès
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 mb-4">
            <div className="text-sm">
              <span className="text-[#b0b0b0]">Progression: </span>
              <span className="text-[#3a8a2a] font-medium">
                {learnedCount}/{totalCount} appris
              </span>
            </div>
            <div className="flex-1 bg-[#2a2a2a] rounded-full h-2">
              <div 
                className="bg-[#3a8a2a] rounded-full h-2 transition-all duration-300"
                style={{ width: `${totalCount > 0 ? (learnedCount / totalCount) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <Button
              onClick={() => setFilter('all')}
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              className={filter === 'all' ? 'bg-[#3a8a2a] text-white' : 'border-[#3a8a2a] text-[#3a8a2a] hover:bg-[#3a8a2a] hover:text-white'}
            >
              Tous ({totalCount})
            </Button>
            <Button
              onClick={() => setFilter('unlearned')}
              variant={filter === 'unlearned' ? 'default' : 'outline'}
              size="sm"
              className={filter === 'unlearned' ? 'bg-[#3a8a2a] text-white' : 'border-[#3a8a2a] text-[#3a8a2a] hover:bg-[#3a8a2a] hover:text-white'}
            >
              À apprendre ({totalCount - learnedCount})
            </Button>
            <Button
              onClick={() => setFilter('learned')}
              variant={filter === 'learned' ? 'default' : 'outline'}
              size="sm"
              className={filter === 'learned' ? 'bg-[#3a8a2a] text-white' : 'border-[#3a8a2a] text-[#3a8a2a] hover:bg-[#3a8a2a] hover:text-white'}
            >
              Appris ({learnedCount})
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6">
        {filteredPoints.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-lg font-medium text-[#f5f5f5] mb-2">
              Aucun point à réviser
            </h3>
            <p className="text-sm text-[#b0b0b0]">
              {filter === 'learned' 
                ? "Vous n'avez pas encore marqué de points comme appris"
                : filter === 'unlearned'
                ? "Félicitations ! Vous avez appris tous vos points de révision"
                : "Commencez par analyser un document pour créer des points de révision"}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredPoints.map((point) => (
              <ReviewPointCard
                key={point.id}
                point={point}
                onToggleLearned={handleToggleLearned}
                onShowInPDF={handleShowInPDF}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}