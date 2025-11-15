// Hardcoded quiz data for each document
// This simulates AI-generated quizzes but provides consistent, high-quality content

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: "easy" | "medium" | "hard"
}

export interface DocumentQuiz {
  documentId: number
  title: string
  description: string
  questions: QuizQuestion[]
}

export const hardcodedQuizzes: Record<number, DocumentQuiz> = {
  1: {
    documentId: 1,
    title: "Quiz - Algèbre de Base",
    description: "Testez vos connaissances sur les concepts fondamentaux de l'algèbre",
    questions: [
      {
        id: "math-1-1",
        question: "Quelle est la valeur de x dans l'équation 2x + 5 = 13 ?",
        options: ["3", "4", "5", "6"],
        correctAnswer: 1,
        explanation: "En soustrayant 5 des deux côtés : 2x = 8, puis en divisant par 2 : x = 4",
        difficulty: "easy"
      },
      {
        id: "math-1-2",
        question: "Qu'est-ce qu'une variable en algèbre ?",
        options: [
          "Un nombre fixe",
          "Un symbole représentant une valeur inconnue",
          "Une opération mathématique",
          "Une équation"
        ],
        correctAnswer: 1,
        explanation: "Une variable est un symbole (généralement une lettre) qui représente une valeur inconnue ou qui peut changer.",
        difficulty: "easy"
      },
      {
        id: "math-1-3",
        question: "Comment résout-on l'équation 3x - 7 = 2x + 5 ?",
        options: [
          "x = 12",
          "x = 2",
          "x = -2",
          "x = -12"
        ],
        correctAnswer: 0,
        explanation: "3x - 2x = 5 + 7, donc x = 12",
        difficulty: "medium"
      }
    ]
  },

  2: {
    documentId: 2,
    title: "Quiz - Histoire de Madagascar",
    description: "Évaluez vos connaissances sur la période coloniale malgache",
    questions: [
      {
        id: "hist-2-1",
        question: "En quelle année la France a-t-elle établi son protectorat sur Madagascar ?",
        options: ["1894", "1896", "1898", "1900"],
        correctAnswer: 1,
        explanation: "Le protectorat français sur Madagascar a été établi en 1896.",
        difficulty: "easy"
      },
      {
        id: "hist-2-2",
        question: "Quelle révolte majeure a marqué l'histoire de Madagascar en 1947 ?",
        options: [
          "La révolte des Menalamba",
          "L'insurrection malgache de 1947",
          "La révolution de 1972",
          "Le soulèvement de 1929"
        ],
        correctAnswer: 1,
        explanation: "L'insurrection malgache de 1947 fut un mouvement de résistance majeur contre l'administration coloniale française.",
        difficulty: "medium"
      },
      {
        id: "hist-2-3",
        question: "Quand Madagascar a-t-elle obtenu son indépendance ?",
        options: ["1958", "1960", "1962", "1965"],
        correctAnswer: 1,
        explanation: "Madagascar a obtenu son indépendance de la France le 26 juin 1960.",
        difficulty: "easy"
      }
    ]
  },

  3: {
    documentId: 3,
    title: "Quiz - Mécanique Classique",
    description: "Testez votre compréhension des lois de Newton et de la mécanique",
    questions: [
      {
        id: "phys-3-1",
        question: "Énoncez la première loi de Newton :",
        options: [
          "F = ma",
          "Un objet au repos reste au repos sauf si une force agit sur lui",
          "À toute action correspond une réaction",
          "L'énergie se conserve"
        ],
        correctAnswer: 1,
        explanation: "La première loi de Newton, ou loi d'inertie, stipule qu'un objet au repos reste au repos et un objet en mouvement continue à se mouvoir à vitesse constante, sauf si une force extérieure agit sur lui.",
        difficulty: "easy"
      },
      {
        id: "phys-3-2",
        question: "Quelle est la formule de la deuxième loi de Newton ?",
        options: ["F = ma", "E = mc²", "v = d/t", "P = mv"],
        correctAnswer: 0,
        explanation: "La deuxième loi de Newton s'exprime par F = ma, où F est la force, m la masse et a l'accélération.",
        difficulty: "easy"
      },
      {
        id: "phys-3-3",
        question: "Si une force de 10N agit sur un objet de 2kg, quelle est son accélération ?",
        options: ["2 m/s²", "5 m/s²", "10 m/s²", "20 m/s²"],
        correctAnswer: 1,
        explanation: "En utilisant F = ma : a = F/m = 10N/2kg = 5 m/s²",
        difficulty: "medium"
      }
    ]
  },

  4: {
    documentId: 4,
    title: "Quiz - Économie de Madagascar",
    description: "Évaluez vos connaissances sur l'économie malgache",
    questions: [
      {
        id: "eco-4-1",
        question: "Quel secteur emploie la majorité de la population malgache ?",
        options: ["L'industrie", "L'agriculture", "Les services", "Le tourisme"],
        correctAnswer: 1,
        explanation: "L'agriculture emploie plus de 70% de la population active malgache.",
        difficulty: "easy"
      },
      {
        id: "eco-4-2",
        question: "Quelles sont les principales ressources minières de Madagascar ?",
        options: [
          "Or et diamant",
          "Nickel et cobalt",
          "Pétrole et gaz",
          "Charbon et fer"
        ],
        correctAnswer: 1,
        explanation: "Madagascar possède d'importantes réserves de nickel et de cobalt, ainsi que diverses pierres précieuses.",
        difficulty: "medium"
      },
      {
        id: "eco-4-3",
        question: "Quel produit agricole Madagascar est-elle particulièrement réputée ?",
        options: ["Le café", "La vanille", "Le cacao", "Le thé"],
        correctAnswer: 1,
        explanation: "Madagascar est l'un des plus grands producteurs mondiaux de vanille.",
        difficulty: "easy"
      }
    ]
  },

  5: {
    documentId: 5,
    title: "Quiz - Littérature Française du XIXe",
    description: "Testez vos connaissances sur les grands mouvements littéraires",
    questions: [
      {
        id: "lit-5-1",
        question: "Qui est l'auteur des 'Misérables' ?",
        options: ["Émile Zola", "Victor Hugo", "Honoré de Balzac", "Gustave Flaubert"],
        correctAnswer: 1,
        explanation: "Victor Hugo est l'auteur des 'Misérables', chef-d'œuvre du romantisme français.",
        difficulty: "easy"
      },
      {
        id: "lit-5-2",
        question: "Quel mouvement littéraire Émile Zola a-t-il théorisé ?",
        options: ["Le romantisme", "Le réalisme", "Le naturalisme", "Le symbolisme"],
        correctAnswer: 2,
        explanation: "Émile Zola a théorisé et illustré le mouvement naturaliste, qui applique la méthode scientifique à la littérature.",
        difficulty: "medium"
      },
      {
        id: "lit-5-3",
        question: "Quel auteur est associé au cycle romanesque de 'La Comédie humaine' ?",
        options: ["Stendhal", "Honoré de Balzac", "George Sand", "Alexandre Dumas"],
        correctAnswer: 1,
        explanation: "'La Comédie humaine' est le vaste cycle romanesque d'Honoré de Balzac qui dépeint la société française de son époque.",
        difficulty: "medium"
      }
    ]
  }
}

// Function to get quiz by document ID
export function getQuizByDocumentId(documentId: number): DocumentQuiz | null {
  return hardcodedQuizzes[documentId] || null
}

// Function to simulate AI quiz generation
export function simulateAIQuizGeneration(documentId: number, documentTitle: string): DocumentQuiz {
  return {
    documentId,
    title: `Quiz - ${documentTitle}`,
    description: "Quiz généré automatiquement par l'IA à partir du contenu du document",
    questions: [
      {
        id: `auto-${documentId}-1`,
        question: "Quel est le thème principal de ce document ?",
        options: ["Thème A", "Thème B", "Thème C", "Thème D"],
        correctAnswer: 0,
        explanation: "Cette question a été générée automatiquement à partir de l'analyse du document.",
        difficulty: "easy"
      }
    ]
  }
}