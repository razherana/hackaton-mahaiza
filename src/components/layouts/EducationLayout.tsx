import type { ReactNode } from "react"
import { AnalysisProvider } from "../pages/education/analyse/providers/AnalysisProvide"
import { GlobalFloatingPDF } from "../pages/education/analyse/components/GlobalFloatingPDF"

export function EducationLayout({ children }: { children: ReactNode }) {
  return (
    <AnalysisProvider>
      {children}
      <GlobalFloatingPDF />
    </AnalysisProvider>
  )
}