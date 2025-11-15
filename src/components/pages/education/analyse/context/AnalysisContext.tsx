import { createContext } from "react"
import type { AnalysisSessionData } from "../types"

interface AnalysisContextType {
  sessionData: AnalysisSessionData | null
  setSessionData: (data: AnalysisSessionData | null) => void
  isPreviewOpen: boolean
  setIsPreviewOpen: (open: boolean) => void
}

export const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined)

