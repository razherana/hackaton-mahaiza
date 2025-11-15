export interface EducationDocument {
  id: number;
  image?: string;
  fileName: string;
  description?: string;
  dateUploaded: Date;
}

export interface DocumentAnalysisResult {
  fileName: string;
  title: string | null;
  pageCount: number | null;
  wordCount: number;
  readingTimeMinutes: number;
  keywords: string[];
  summaryParagraphs: string[];
  excerpt: string;
  createdAt: string;
}
