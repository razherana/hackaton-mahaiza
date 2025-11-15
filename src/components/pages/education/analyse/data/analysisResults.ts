import type { DocumentAnalysisResult } from "../../import/types";

// Hardcoded analysis results for documents in the hub
export const hardcodedAnalysisResults: Record<number, DocumentAnalysisResult> =
  {
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
        "La colonisation française à Madagascar représente une période charnière qui a profondément marqué l'identité nationale malgache.",
      createdAt: new Date("2024-11-02T14:20:00").toISOString(),
    },

    3: {
      fileName: "Physique_Mécanique_Classique.pdf",
      title: "Mécanique Classique : Forces et Mouvement",
      pageCount: 62,
      wordCount: 15800,
      readingTimeMinutes: 53,
      keywords: [
        "physique",
        "mécanique",
        "forces",
        "Newton",
        "mouvement",
        "dynamique",
        "cinématique",
      ],
      summaryParagraphs: [
        "Ce cours de physique présente les principes fondamentaux de la mécanique classique, en commençant par l'étude du mouvement des objets dans l'espace et le temps.",
        "Les trois lois de Newton sont expliquées en détail avec des applications pratiques. La première loi traite de l'inertie, la seconde de la relation entre force et accélération, et la troisième du principe d'action-réaction.",
        "Le document aborde également les concepts d'énergie cinétique et potentielle, ainsi que les principes de conservation qui régissent les systèmes mécaniques.",
      ],
      excerpt:
        "La mécanique classique, développée par Newton, constitue le fondement de notre compréhension du mouvement des objets macroscopiques.",
      createdAt: new Date("2024-11-08T09:15:00").toISOString(),
    },

    4: {
      fileName: "Économie_Madagascar_Développement.pdf",
      title: "Développement Économique de Madagascar : Analyse et Perspectives",
      pageCount: 95,
      wordCount: 22300,
      readingTimeMinutes: 74,
      keywords: [
        "économie",
        "Madagascar",
        "développement",
        "PIB",
        "agriculture",
        "mines",
        "tourisme",
        "commerce",
      ],
      summaryParagraphs: [
        "L'économie malgache repose principalement sur l'agriculture, qui emploie plus de 70% de la population active. Les principales cultures incluent le riz, la vanille, le café et les épices.",
        "Le secteur minier joue un rôle croissant dans l'économie, avec l'exploitation du nickel, du cobalt et des pierres précieuses. Ces ressources représentent un potentiel important pour le développement du pays.",
        "Le tourisme constitue également un secteur prometteur, grâce à la biodiversité unique de l'île et à ses paysages exceptionnels. Cependant, le développement de ce secteur nécessite des investissements importants en infrastructure.",
      ],
      excerpt:
        "Madagascar possède un potentiel économique considérable, mais fait face à des défis structurels qui freinent son développement.",
      createdAt: new Date("2024-11-10T16:45:00").toISOString(),
    },

    5: {
      fileName: "Littérature_Française_XIXe.pdf",
      title: "Panorama de la Littérature Française du XIXe Siècle",
      pageCount: 120,
      wordCount: 28500,
      readingTimeMinutes: 95,
      keywords: [
        "littérature",
        "romantisme",
        "réalisme",
        "naturalisme",
        "Hugo",
        "Balzac",
        "Zola",
        "XIXe siècle",
      ],
      summaryParagraphs: [
        "Le XIXe siècle français est marqué par une révolution littéraire majeure avec l'émergence du romantisme. Victor Hugo, Chateaubriand et Lamartine renouvellent l'expression poétique et narrative.",
        "Le mouvement réaliste, avec Balzac et Stendhal, cherche à dépeindre fidèlement la société contemporaine. Cette école privilégie l'observation sociale et la vérité psychologique.",
        "Le naturalisme, théorisé par Zola, pousse plus loin l'approche scientifique de la littérature. Les écrivains naturalistes appliquent les méthodes d'observation des sciences expérimentales à l'art romanesque.",
      ],
      excerpt:
        "Le XIXe siècle français voit naître les grands courants littéraires modernes qui influenceront durablement la littérature mondiale.",
      createdAt: new Date("2024-11-12T11:30:00").toISOString(),
    },
  };

// Function to get analysis by document ID
export function getAnalysisByDocumentId(
  documentId: number
): DocumentAnalysisResult | null {
  return hardcodedAnalysisResults[documentId] || null;
}

// Function to simulate AI analysis for new uploads
export function simulateAIAnalysis(fileName: string): DocumentAnalysisResult {
  return {
    fileName,
    title: `Analyse de ${fileName}`,
    pageCount: Math.floor(Math.random() * 100) + 20,
    wordCount: Math.floor(Math.random() * 20000) + 5000,
    readingTimeMinutes: Math.floor(Math.random() * 60) + 15,
    keywords: ["document", "analyse", "contenu", "éducation", "apprentissage"],
    summaryParagraphs: [
      "Ce document a été analysé automatiquement par notre système d'intelligence artificielle.",
      "L'analyse révèle un contenu riche et structuré adapté à l'apprentissage.",
      "Les concepts clés ont été identifiés pour faciliter la compréhension et l'étude.",
    ],
    excerpt: "Document analysé automatiquement par l'IA éducative.",
    createdAt: new Date().toISOString(),
  };
}
