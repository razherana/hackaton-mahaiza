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
      }}
    >
      {children}
    </AnalysisContext.Provider>
  )
}
