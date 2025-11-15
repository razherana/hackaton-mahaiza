import { useState, type ReactNode } from "react"
import { AnalysisContext } from "../context/AnalysisContext"
import type { AnalysisSessionData } from "../types"

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [sessionData, setSessionData] = useState<AnalysisSessionData | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(true)
  
  // Global floating window state
  const [isFloating, setIsFloating] = useState(false)
  const [floatingPosition, setFloatingPosition] = useState({ x: 100, y: 100 })
  const [floatingSize, setFloatingSize] = useState({ width: 600, height: 800 })
  
  // PDF highlighting state
  const [currentHighlightRequest, setCurrentHighlightRequest] = useState<{searchText: string; page?: number; matches?: Array<{text: string; x: number; y: number; width: number; height: number}>} | null>(null)

  return (
    <AnalysisContext.Provider
      value={{
        sessionData,
        setSessionData,
        isPreviewOpen,
        setIsPreviewOpen,
        isFloating,
        setIsFloating,
        floatingPosition,
        setFloatingPosition,
        floatingSize,
        setFloatingSize,
        currentHighlightRequest,
        setCurrentHighlightRequest,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  )
}
