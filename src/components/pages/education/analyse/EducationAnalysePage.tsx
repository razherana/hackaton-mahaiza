import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { useAnalysis } from "./context/useAnalysis"
import { AnalysisSidebar } from "./components/AnalysisSidebar"
import { AnalysisContent } from "./components/AnalysisContent"
import { PDFPreview } from "./components/PDFPreview"
import type { DocumentAnalysisResult, EducationDocument } from "../import/types"
import { getAnalysisByDocumentId } from "./data/analysisResults"
import { documentDatas } from "../import/data/hub"

function AnalysisPageContent() {
  const [searchParams] = useSearchParams()
  const { setSessionData } = useAnalysis()

  useEffect(() => {
    // Handle document ID (from hub selection)
    const documentIdParam = searchParams.get("documentId")
    if (documentIdParam) {
      const documentId = parseInt(documentIdParam, 10)
      const document = documentDatas.find(d => d.id === documentId)
      const analysis = getAnalysisByDocumentId(documentId)

      if (document && analysis) {
        setSessionData({
          document,
          analysis,
        })
      } else {
        console.error("Document or analysis not found for ID:", documentId)
      }
      return
    }

    // Handle legacy format (from new file upload)
    const documentParam = searchParams.get("document")
    const analysisParam = searchParams.get("analysis")

    if (documentParam && analysisParam) {
      try {
        const document: EducationDocument = JSON.parse(decodeURIComponent(documentParam))
        const analysis: DocumentAnalysisResult = JSON.parse(decodeURIComponent(analysisParam))

        setSessionData({
          document,
          analysis,
        })
      } catch (error) {
        console.error("Failed to parse session data from URL:", error)
      }
    }
  }, [searchParams, setSessionData])

  return (
    <div className="flex h-screen w-full bg-[#1b1b1b] text-white">
      <AnalysisSidebar />
      <AnalysisContent />
      <PDFPreview />
    </div>
  )
}

export function EducationAnalysePage() {
  return <AnalysisPageContent />
}
