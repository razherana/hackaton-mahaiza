import type { EducationDocument, DocumentAnalysisResult } from "../../import/types"
import type { TextMatch, PDFViewport } from "../utils/pdfHighlights"

export interface AnalysisSessionData {
  document: EducationDocument
  analysis: DocumentAnalysisResult
}

// Review Points types
export interface ReviewPoint {
  id: string
  title: string
  description: string
  content: string
  pageNumber: number
  isLearned: boolean
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
  highlights?: {
    searchText: string
    page: number
    matches: TextMatch[]
  }
  createdAt: string
  lastReviewed?: string
}

// PDF.js types
export interface SearchResult {
  page: number;
  preview: string;
  matches: TextMatch[];
}

export interface PDFDocumentProxy {
  numPages: number;
  getPage: (pageNumber: number) => Promise<PDFPageProxy>;
}

export interface PDFPageProxy {
  getViewport: (params: { scale: number }) => PDFViewport;
  render: (params: RenderParameters) => RenderTask;
  getTextContent: () => Promise<TextContent>;
}

export interface RenderParameters {
  canvasContext: CanvasRenderingContext2D;
  viewport: PDFViewport;
}

export interface RenderTask {
  promise: Promise<void>;
  cancel: () => void;
}

export interface TextContent {
  items: Array<{
    str: string;
    transform: number[];
    width: number;
    height: number;
  }>;
}

declare global {
  interface Window {
    pdfjsLib: {
      GlobalWorkerOptions: {
        workerSrc: string;
      };
      getDocument: (params: { data: ArrayBuffer }) => {
        promise: Promise<PDFDocumentProxy>;
      };
    };
  }
}
