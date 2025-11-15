import { useState, type ReactNode } from "react"
import { AnalysisContext } from "../context/AnalysisContext"
import type { AnalysisSessionData } from "../types"

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [sessionData, setSessionData] = useState<AnalysisSessionData | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(true)

  return (
    <AnalysisContext.Provider
      value={{
        sessionData,
        setSessionData,
        isPreviewOpen,
        setIsPreviewOpen,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  )
}
