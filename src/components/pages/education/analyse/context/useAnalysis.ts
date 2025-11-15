import { useContext } from "react"
import { AnalysisContext } from "./AnalysisContext"

export function useAnalysis() {
  const context = useContext(AnalysisContext)
  if (context === undefined) {
    throw new Error("useAnalysis must be used within an AnalysisProvider")
  }
  return context
}
