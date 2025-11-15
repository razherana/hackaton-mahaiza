import { createContext } from "react"
import type { AnalysisSessionData } from "../types"
import type { TextMatch } from "../utils/pdfHighlights"

interface PDFHighlightRequest {
  searchText: string
  page?: number
  matches?: TextMatch[]
}

interface AnalysisContextType {
  sessionData: AnalysisSessionData | null
  setSessionData: (data: AnalysisSessionData | null) => void
  isPreviewOpen: boolean
  setIsPreviewOpen: (open: boolean) => void
  // Global floating window state
  isFloating: boolean
  setIsFloating: (floating: boolean) => void
  floatingPosition: { x: number; y: number }
  setFloatingPosition: (position: { x: number; y: number }) => void
  floatingSize: { width: number; height: number }
  setFloatingSize: (size: { width: number; height: number }) => void
  // PDF highlighting state
  currentHighlightRequest: PDFHighlightRequest | null
  setCurrentHighlightRequest: (request: PDFHighlightRequest | null) => void
}

export const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined)

