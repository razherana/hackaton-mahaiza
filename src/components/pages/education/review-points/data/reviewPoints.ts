import type { ReviewPoint } from "../../analyse/types"

export const sampleReviewPoints: ReviewPoint[] = [
  {
    id: "rp-1",
    documentId: "doc-1",
    title: "Photosynthèse - Équation chimique",
    description: "L'équation fondamentale de la photosynthèse",
    content: "6CO₂ + 6H₂O + énergie lumineuse → C₆H₁₂O₆ + 6O₂",
    pageNumber: 12,
    isLearned: false,
    difficulty: "medium",
    category: "Biologie",
    highlights: {
      searchText: "photosynthèse",
      page: 12,
      matches: []
    },
    createdAt: "2024-11-15T10:00:00Z"
  },
  {
    id: "rp-2", 
    documentId: "doc-1",
    title: "Mitose - Phases",
    description: "Les quatre phases principales de la mitose",
    content: "Prophase, Métaphase, Anaphase, Télophase - chacune avec ses caractéristiques spécifiques",
    pageNumber: 25,
    isLearned: true,
    difficulty: "hard",
    category: "Biologie cellulaire",
    highlights: {
      searchText: "mitose",
      page: 25,
      matches: []
    },
    createdAt: "2024-11-14T15:30:00Z",
    lastReviewed: "2024-11-15T09:15:00Z"
  },
  {
    id: "rp-3",
    documentId: "doc-2",
    title: "ADN - Structure double hélice",
    description: "La structure en double hélice de l'ADN découverte par Watson et Crick",
    content: "Deux brins antiparallèles reliés par des liaisons hydrogène entre bases complémentaires",
    pageNumber: 8,
    isLearned: false,
    difficulty: "medium",
    category: "Génétique",
    highlights: {
      searchText: "ADN double hélice",
      page: 8,
      matches: []
    },
    createdAt: "2024-11-13T14:20:00Z"
  },
  {
    id: "rp-4",
    documentId: "doc-2",
    title: "Respiration cellulaire",
    description: "Le processus de respiration cellulaire aérobie",
    content: "Glycolyse → Cycle de Krebs → Chaîne de transport d'électrons = 36-38 ATP",
    pageNumber: 18,
    isLearned: false,
    difficulty: "hard",
    category: "Métabolisme",
    highlights: {
      searchText: "respiration cellulaire",
      page: 18,
      matches: []
    },
    createdAt: "2024-11-12T11:45:00Z"
  },
  {
    id: "rp-5",
    documentId: "doc-1",
    title: "Méiose - Brassage génétique",
    description: "Les mécanismes de brassage génétique lors de la méiose",
    content: "Crossing-over en prophase I et ségrégation indépendante des chromosomes",
    pageNumber: 33,
    isLearned: true,
    difficulty: "hard",
    category: "Génétique",
    highlights: {
      searchText: "méiose brassage",
      page: 33,
      matches: []
    },
    createdAt: "2024-11-11T16:10:00Z",
    lastReviewed: "2024-11-14T20:30:00Z"
  }
]

// Helper functions
export function getReviewPointsByStatus(learned: boolean): ReviewPoint[] {
  return sampleReviewPoints.filter(point => point.isLearned === learned)
}

export function getReviewPointsByDifficulty(difficulty: ReviewPoint['difficulty']): ReviewPoint[] {
  return sampleReviewPoints.filter(point => point.difficulty === difficulty)
}

export function getReviewPointsByCategory(category: string): ReviewPoint[] {
  return sampleReviewPoints.filter(point => point.category === category)
}

export function toggleReviewPointLearned(pointId: string): ReviewPoint[] {
  return sampleReviewPoints.map(point => 
    point.id === pointId 
      ? { 
          ...point, 
          isLearned: !point.isLearned,
          lastReviewed: new Date().toISOString()
        }
      : point
  )
}