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
    {
      id: 1,
      fileName: "Mathématiques_Algèbre_Base.pdf",
      description:
        "Introduction aux concepts fondamentaux de l'algèbre, équations du premier degré et résolution de problèmes.",
      dateUploaded: new Date("2024-10-15"),
    },
    {
      id: 2,
      fileName: "Histoire_Madagascar_Colonisation.pdf",
      description:
        "L'histoire de Madagascar pendant la période coloniale française (1896-1960) et les mouvements d'indépendance.",
      dateUploaded: new Date("2024-11-02"),
    },
    {
      id: 3,
      fileName: "Physique_Mécanique_Classique.pdf",
      description:
        "Cours de physique sur la mécanique classique : forces, mouvement et lois de Newton.",
      dateUploaded: new Date("2024-11-08"),
    },
    {
      id: 4,
      fileName: "Économie_Madagascar_Développement.pdf",
      description:
        "Analyse économique du développement de Madagascar : secteurs clés, défis et opportunités.",
      dateUploaded: new Date("2024-11-10"),
    },
    {
      id: 5,
      fileName: "Littérature_Française_XIXe.pdf",
      description:
        "Panorama de la littérature française du XIXe siècle : romantisme, réalisme et naturalisme.",
      dateUploaded: new Date("2024-11-12"),
    },
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
    1: {
      fileName: "Mathématiques_Algèbre_Base.pdf",
      title: "Introduction à l'Algèbre - Concepts Fondamentaux",
      pageCount: 45,
      wordCount: 12500,
      readingTimeMinutes: 42,
      keywords: [
        "algèbre",
        "équations",
        "variables",
        "résolution",
        "mathématiques",
        "inconnue",
        "premier degré",
      ],
      summaryParagraphs: [
        "Ce document présente les concepts fondamentaux de l'algèbre, en commençant par la définition des variables et des constantes. Il explique comment manipuler les expressions algébriques de base.",
        "Le cours aborde ensuite les équations du premier degré, en montrant les techniques de résolution étape par étape. Les méthodes d'isolation de la variable sont expliquées avec des exemples pratiques.",
        "La dernière partie se concentre sur la résolution de problèmes concrets en utilisant les outils algébriques. Des exercices variés permettent de consolider les acquis.",
      ],
      excerpt:
        "L'algèbre est la branche des mathématiques qui étudie les structures algébriques et les règles de manipulation des symboles mathématiques.",
      createdAt: new Date("2024-10-15T10:30:00").toISOString(),
    },

    2: {
      fileName: "Histoire_Madagascar_Colonisation.pdf",
      title: "Madagascar sous la Colonisation Française (1896-1960)",
      pageCount: 78,
      wordCount: 18900,
      readingTimeMinutes: 63,
      keywords: [
        "Madagascar",
        "colonisation",
        "France",
        "indépendance",
        "résistance",
        "administration",
        "économie coloniale",
      ],
      summaryParagraphs: [
        "L'histoire de la colonisation française à Madagascar commence en 1896 avec l'établissement du protectorat français. Cette période marque une transformation radicale de la société malgache.",
        "L'administration coloniale française impose de nouveaux systèmes économiques et sociaux, transformant l'agriculture traditionnelle et introduisant de nouvelles cultures d'exportation comme le café et la vanille.",
        "Les mouvements de résistance se développent progressivement, culminant avec la révolte de 1947. Ces événements marquent le début du processus d'indépendance qui aboutira en 1960.",
      ],
      excerpt:
        "La colonisation française de Madagascar transforme profondément la société malgache et pose les bases des tensions qui mèneront à l'indépendance.",
      createdAt: new Date("2024-11-02T14:15:00").toISOString(),
    },

    3: {
      fileName: "Physique_Mécanique_Classique.pdf",
      title: "Principes de la Mécanique Classique",
      pageCount: 92,
      wordCount: 22100,
      readingTimeMinutes: 74,
      keywords: [
        "physique",
        "mécanique",
        "forces",
        "Newton",
        "mouvement",
        "accélération",
        "vitesse",
      ],
      summaryParagraphs: [
        "Ce cours présente les fondements de la mécanique classique, en commençant par les concepts de base comme la position, la vitesse et l'accélération.",
        "Les trois lois de Newton sont expliquées en détail avec de nombreux exemples d'application dans la vie quotidienne et l'ingénierie.",
        "Le document couvre également les concepts d'énergie cinétique et potentielle, ainsi que les principes de conservation qui gouvernent les systèmes mécaniques.",
      ],
      excerpt:
        "La mécanique classique décrit le mouvement des objets macroscopiques selon les lois établies par Isaac Newton.",
      createdAt: new Date("2024-11-08T09:20:00").toISOString(),
    },

    4: {
      fileName: "Économie_Madagascar_Développement.pdf",
      title: "Développement Économique de Madagascar : Défis et Opportunités",
      pageCount: 64,
      wordCount: 15800,
      readingTimeMinutes: 53,
      keywords: [
        "Madagascar",
        "économie",
        "développement",
        "agriculture",
        "tourisme",
        "mines",
        "pauvreté",
      ],
      summaryParagraphs: [
        "Madagascar fait face à des défis économiques majeurs malgré ses ressources naturelles abondantes. L'agriculture reste le secteur dominant mais souffre de faible productivité.",
        "Le tourisme représente un potentiel important pour l'économie malgache, avec ses paysages uniques et sa biodiversité exceptionnelle.",
        "L'exploitation minière, notamment des pierres précieuses et des métaux, pourrait contribuer significativement au développement économique du pays.",
      ],
      excerpt:
        "Madagascar possède un potentiel économique considérable mais doit surmonter de nombreux obstacles structurels pour assurer son développement.",
      createdAt: new Date("2024-11-10T16:45:00").toISOString(),
    },

    5: {
      fileName: "Littérature_Française_XIXe.pdf",
      title: "La Littérature Française du XIXe Siècle",
      pageCount: 156,
      wordCount: 28500,
      readingTimeMinutes: 95,
      keywords: [
        "littérature",
        "française",
        "XIXe siècle",
        "romantisme",
        "réalisme",
        "naturalisme",
        "Balzac",
        "Hugo",
      ],
      summaryParagraphs: [
        "Le XIXe siècle français est marqué par l'émergence de trois grands mouvements littéraires : le romantisme, le réalisme et le naturalisme.",
        "Victor Hugo incarne le romantisme avec ses œuvres monumentales, tandis que Balzac développe le réalisme à travers La Comédie Humaine.",
        "Émile Zola pousse la description de la société vers le naturalisme, appliquant les méthodes scientifiques à l'analyse sociale.",
      ],
      excerpt:
        "Le XIXe siècle français révolutionne la littérature par sa diversité de mouvements et la richesse de ses œuvres.",
      createdAt: new Date("2024-11-12T11:30:00").toISOString(),
    },
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
    1: {
      documentId: 1,
      title: "Quiz - Algèbre de Base",
      description:
        "Testez vos connaissances sur les concepts fondamentaux de l'algèbre",
      questions: [
        {
          id: "math-1-1",
          question: "Quelle est la valeur de x dans l'équation 2x + 5 = 13 ?",
          options: ["3", "4", "5", "6"],
          correctAnswer: 1,
          explanation:
            "En soustrayant 5 des deux côtés : 2x = 8, puis en divisant par 2 : x = 4",
          difficulty: "easy",
        },
        {
          id: "math-1-2",
          question: "Qu'est-ce qu'une variable en algèbre ?",
          options: [
            "Un nombre fixe",
            "Un symbole représentant une valeur inconnue",
            "Une opération mathématique",
            "Une équation",
          ],
          correctAnswer: 1,
          explanation:
            "Une variable est un symbole (généralement une lettre) qui représente une valeur inconnue ou qui peut changer.",
          difficulty: "easy",
        },
        {
          id: "math-1-3",
          question: "Comment résout-on l'équation 3x - 7 = 2x + 5 ?",
          options: [
            "En additionnant 7 et soustrayant 2x",
            "En soustrayant 2x et additionnant 7",
            "En multipliant par 3",
            "En divisant par x",
          ],
          correctAnswer: 1,
          explanation: "3x - 7 = 2x + 5 → 3x - 2x = 5 + 7 → x = 12",
          difficulty: "medium",
        },
      ],
    },

    2: {
      documentId: 2,
      title: "Quiz - Histoire de Madagascar",
      description:
        "Évaluez vos connaissances sur la période coloniale malgache",
      questions: [
        {
          id: "hist-2-1",
          question:
            "En quelle année Madagascar devient-elle une colonie française ?",
          options: ["1894", "1896", "1898", "1900"],
          correctAnswer: 1,
          explanation:
            "Madagascar devient officiellement une colonie française en 1896 après l'établissement du protectorat.",
          difficulty: "easy",
        },
        {
          id: "hist-2-2",
          question: "Quelle révolte marque le tournant vers l'indépendance ?",
          options: [
            "La révolte de 1945",
            "La révolte de 1947",
            "La révolte de 1950",
            "La révolte de 1955",
          ],
          correctAnswer: 1,
          explanation:
            "La révolte de 1947 constitue un événement majeur dans la lutte pour l'indépendance malgache.",
          difficulty: "medium",
        },
      ],
    },

    3: {
      documentId: 3,
      title: "Quiz - Mécanique Classique",
      description:
        "Testez votre compréhension des lois de Newton et de la mécanique",
      questions: [
        {
          id: "phys-3-1",
          question: "Quelle est la première loi de Newton ?",
          options: [
            "F = ma",
            "Un objet au repos reste au repos sauf si une force agit sur lui",
            "À toute action correspond une réaction égale et opposée",
            "L'énergie se conserve",
          ],
          correctAnswer: 1,
          explanation:
            "La première loi de Newton, ou principe d'inertie, stipule qu'un objet conserve son état de mouvement sauf si une force extérieure agit sur lui.",
          difficulty: "easy",
        },
        {
          id: "phys-3-2",
          question: "Que représente l'équation F = ma ?",
          options: [
            "La première loi de Newton",
            "La deuxième loi de Newton",
            "La troisième loi de Newton",
            "La loi de conservation de l'énergie",
          ],
          correctAnswer: 1,
          explanation:
            "F = ma est la formulation mathématique de la deuxième loi de Newton, reliant force, masse et accélération.",
          difficulty: "medium",
        },
      ],
    },
    // --- NOUVEAU QUIZ AJOUTÉ (ID 4) ---
    4: {
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
    {
      id: "rp-1",
      documentId: "1",
      title: "Équations du premier degré",
      description: "Méthode de résolution des équations linéaires",
      content: "Pour résoudre ax + b = c, on isole x : x = (c - b) / a",
      pageNumber: 12,
      isLearned: false,
      difficulty: "medium",
      category: "Algèbre",
      highlights: {
        searchText: "équation premier degré",
        page: 12,
        matches: [],
      },
      createdAt: "2024-11-15T10:00:00Z",
    },
    {
      id: "rp-2",
      documentId: "1",
      title: "Variables et constantes",
      description: "Différence entre variables et constantes en algèbre",
      content:
        "Une variable (x, y, z) peut changer de valeur, une constante (5, π) reste fixe",
      pageNumber: 5,
      isLearned: true,
      difficulty: "easy",
      category: "Algèbre",
      highlights: {
        searchText: "variables",
        page: 5,
        matches: [],
      },
      createdAt: "2024-11-14T15:30:00Z",
      lastReviewed: "2024-11-15T09:15:00Z",
    },
    {
      id: "rp-3",
      documentId: "2",
      title: "Colonisation française - 1896",
      description: "Établissement du protectorat français à Madagascar",
      content:
        "En 1896, la France établit officiellement son protectorat sur Madagascar après plusieurs années de négociations et conflits.",
      pageNumber: 23,
      isLearned: false,
      difficulty: "medium",
      category: "Histoire",
      highlights: {
        searchText: "1896 protectorat",
        page: 23,
        matches: [],
      },
      createdAt: "2024-11-14T14:20:00Z",
    },
    {
      id: "rp-4",
      documentId: "3",
      title: "Première loi de Newton",
      description: "Principe d'inertie en mécanique classique",
      content:
        "Un objet au repos reste au repos et un objet en mouvement reste en mouvement à vitesse constante, sauf si une force externe agit sur lui.",
      pageNumber: 15,
      isLearned: false,
      difficulty: "medium",
      category: "Physique",
      highlights: {
        searchText: "première loi Newton",
        page: 15,
        matches: [],
      },
      createdAt: "2024-11-13T16:45:00Z",
    },
    // --- NOUVEAUX POINTS DE RÉVISION AJOUTÉS (DOC 6) ---
    {
      id: "rp-5",
      documentId: "6",
      title: "Opération Barbarossa",
      description: "Invasion de l'URSS par l'Allemagne.",
      content:
        "Le 22 juin 1941, Hitler lance la guerre contre l'URSS (opération Barbarossa), l'armée rouge est débordée.",
      pageNumber: 1,
      isLearned: false,
      difficulty: "medium",
      category: "Histoire",
      highlights: {
        searchText: "opération Barbarossa",
        page: 1,
        matches: [],
      },
      createdAt: "2025-11-15T21:20:00Z",
    },
    {
      id: "rp-6",
      documentId: "6",
      title: "Pearl Harbor",
      description: "Attaque japonaise et entrée en guerre des USA.",
      content:
        "Le Japon lance un raid surprise sur la base de Pearl Harbor le 7 décembre 1941, poussant les États-Unis à entrer en guerre.",
      pageNumber: 1,
      isLearned: false,
      difficulty: "easy",
      category: "Histoire",
      highlights: {
        searchText: "Pearl Harbor",
        page: 1,
        matches: [],
      },
      createdAt: "2025-11-15T21:21:00Z",
    },
    {
      id: "rp-7",
      documentId: "6",
      title: "Appel du 18 Juin",
      description: "Appel à la Résistance par De Gaulle.",
      content:
        "Face à la défaite, le général De Gaulle lance le 18 juin 1940 de Londres un appel à la Résistance.",
      pageNumber: 5,
      isLearned: false,
      difficulty: "easy",
      category: "Histoire",
      highlights: {
        searchText: "18 juin 1940",
        page: 5,
        matches: [],
      },
      createdAt: "2025-11-15T21:22:00Z",
    },
  ],
};

// Simulated quiz progress data
export const mockQuizProgress: QuizProgress[] = [
  {
    quizId: 1,
    completed: true,
    score: 8,
    totalQuestions: 10,
    lastAttempt: new Date("2024-11-10"),
  },
  {
    quizId: 2,
    completed: false,
  },
  {
    quizId: 3,
    completed: true,
    score: 6,
    totalQuestions: 8,
    lastAttempt: new Date("2024-11-12"),
  },
  {
    quizId: 4,
    completed: true,
    score: 10,
    totalQuestions: 10,
    lastAttempt: new Date("2024-11-14"),
  },
];

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