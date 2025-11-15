import type {
  EducationDocument,
  DocumentAnalysisResult,
} from "../components/pages/education/import/types";
import type { ReviewPoint } from "../components/pages/education/analyse/types";

// Quiz related types
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface DocumentQuiz {
  documentId: number;
  title: string;
  description: string;
  questions: QuizQuestion[];
}

export interface QuizProgress {
  quizId: number;
  completed: boolean;
  score?: number;
  totalQuestions?: number;
  lastAttempt?: Date;
}

// Unified education data structure
export interface EducationData {
  documents: EducationDocument[];
  analysisResults: Record<number, DocumentAnalysisResult>;
  quizzes: Record<number, DocumentQuiz>;
  reviewPoints: ReviewPoint[];
}

// The unified education data store
export const educationData: EducationData = {
  documents: [
    // --- NOUVEAU DOCUMENT AJOUTÉ (ID 6) ---
    {
      id: 6,
      fileName: "Seconde guerre mondiale.pdf",
      description:
        "Analyse de la Seconde Guerre mondiale, de ses victoires à la violence de masse, et l'impact sur la France.",
      dateUploaded: new Date("2025-11-15"),
    },
  ],

  analysisResults: {
    // --- NOUVELLE ANALYSE AJOUTÉE (ID 6) ---
    6: {
      fileName: "Seconde guerre mondiale.pdf",
      title: "H1-3 LA SECONDE GUERRE MONDIALE",
      pageCount: 6,
      wordCount: 2150,
      readingTimeMinutes: 9,
      keywords: [
        "Seconde Guerre mondiale",
        "violence de masse",
        "génocide",
        "Axe",
        "Alliés",
        "France",
        "collaboration",
        "résistance",
        "Shoah",
      ],
      summaryParagraphs: [
        "Ce document analyse la Seconde Guerre mondiale, un conflit débuté en 1939 caractérisé par la violence de masse et la volonté d'anéantissement.",
        "Il aborde le plus grand génocide de l'histoire, celui des juifs et des tsiganes, de l'isolement dans les ghettos à la 'Solution finale' et la mort industrielle.",
        "Enfin, le cours examine la France durant la guerre, choquée par la défaite de juin 1940 et déchirée entre le régime de collaboration de Vichy et les mouvements de Résistance.",
      ],
      excerpt:
        "Ce conflit, bien plus encore que la Première Guerre mondiale, est caractérisé par la violence de masse et la volonté d'anéantir totalement l'adversaire.",
      createdAt: new Date("2025-11-15T21:15:00").toISOString(),
    },
  },

  quizzes: {
    6: {
      documentId: 6,
      title: "Quiz - Seconde Guerre mondiale",
      description:
        "Testez vos connaissances sur les événements majeurs et les aspects de la 2nde Guerre mondiale.",
      questions: [
        {
          id: "hist-6-1",
          question:
            "Quelle date marque le début officiel de la Seconde Guerre mondiale avec l'invasion de la Pologne ?",
          options: [
            "1er septembre 1939",
            "7 décembre 1941",
            "22 juin 1940",
            "10 mai 1940",
          ],
          correctAnswer: 0,
          explanation:
            "L'Allemagne nazie envahit la Pologne le 1er septembre 1939, marquant le début officiel de la guerre en Europe.",
          difficulty: "easy",
        },
        {
          id: "hist-6-2",
          question:
            "Quelle conférence a officialisé la 'Solution finale' pour l'extermination des Juifs ?",
          options: [
            "Conférence de Téhéran",
            "Conférence de Wannsee",
            "Conférence de Yalta",
            "Conférence de Potsdam",
          ],
          correctAnswer: 1,
          explanation:
            "La 'Solution finale' a été officialisée par Reinhard Heydrich lors de la conférence de Wannsee, le 20 janvier 1942.",
          difficulty: "medium",
        },
        {
          id: "hist-6-3",
          question:
            "Quel maréchal a pris les pleins pouvoirs en France le 10 juillet 1940 et mis en place la 'Révolution Nationale' ?",
          options: [
            "Charles de Gaulle",
            "Paul Reynaud",
            "Philippe Pétain",
            "Pierre Laval",
          ],
          correctAnswer: 2,
          explanation:
            "Le maréchal Pétain prend les pleins pouvoirs le 10 juillet 1940 et met en place la Révolution Nationale, basée sur la devise 'Travail, Famille Patrie'.",
          difficulty: "medium",
        },
      ],
    },
  },

  reviewPoints: [
    // --- POINT DE RÉVISION SYNTHÉTIQUE (DOC 6, PAGE 1) ---
    {
      id: "rp-6-1",
      documentId: "6",
      title: "Introduction : Violence de masse et défaite française",
      description:
        "Résumé de la problématique générale : conflit mondial total, violence de masse, génocide et fracture française après juin 1940.",
      content:
        "La Seconde Guerre mondiale débute avec l'invasion de la Pologne en 1939 mais s'inscrit dans une dynamique de guerre mondiale où l'Axe étend rapidement sa domination. Le texte insiste sur la violence de masse, le génocide des Juifs et des Tsiganes, ainsi que sur la France, effondrée en juin 1940 et partagée entre collaboration et résistance.",
      pageNumber: 1,
      isLearned: false,
      difficulty: "medium",
      category: "Histoire",
      highlights: {
        searchText: "La Seconde Guerre mondiale",
        page: 1,
        matches: [],
      },
      createdAt: "2025-11-15T22:00:00Z",
    },
  ],
};

// Simulated quiz progress data
export const mockQuizProgress: QuizProgress[] = [];

// Helper functions to access data
export const getDocument = (id: number): EducationDocument | undefined => {
  return educationData.documents.find((doc) => doc.id === id);
};

export const getDocumentAnalysis = (
  id: number
): DocumentAnalysisResult | undefined => {
  return educationData.analysisResults[id];
};

export const getDocumentQuiz = (id: number): DocumentQuiz | undefined => {
  return educationData.quizzes[id];
};

export const getDocumentReviewPoints = (documentId: string): ReviewPoint[] => {
  return educationData.reviewPoints.filter(
    (rp) => rp.documentId === documentId
  );
};

export const getAllDocuments = (): EducationDocument[] => {
  return educationData.documents;
};

export const getAllReviewPoints = (): ReviewPoint[] => {
  return educationData.reviewPoints;
};

// Simulation function for AI analysis (used when uploading new files)
export function simulateAIAnalysis(fileName: string): DocumentAnalysisResult {
  const wordCount = Math.floor(Math.random() * 10000) + 5000;
  const readingTimeMinutes = Math.ceil(wordCount / 250);

  return {
    fileName,
    title: `Analyse de ${fileName}`,
    pageCount: Math.floor(Math.random() * 50) + 20,
    wordCount,
    readingTimeMinutes,
    keywords: ["analyse", "document", "étude", "recherche"],
    summaryParagraphs: [
      "Ce document présente une analyse approfondie du sujet traité avec une méthodologie rigoureuse.",
      "Les résultats montrent des tendances intéressantes qui méritent une attention particulière.",
      "Les conclusions ouvrent de nouvelles perspectives pour la recherche future.",
    ],
    excerpt: "Analyse automatique générée par l'IA pour ce document.",
    createdAt: new Date().toISOString(),
  };
}
