import { createContext } from "react"
import type { AnalysisSessionData } from "../types"

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
}

export const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined)

