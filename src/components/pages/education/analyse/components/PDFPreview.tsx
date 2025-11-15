import { useAnalysis } from "../context/useAnalysis"
import { ChevronLeft, ChevronRight, File } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState } from "react"

export function PDFPreview() {
  const { sessionData, isPreviewOpen } = useAnalysis()
  const [currentPage, setCurrentPage] = useState(1)

  if (!sessionData) {
    return null
  }

  return (
    <div
      className={`overflow-hidden transition-all duration-300 ${
        isPreviewOpen ? "w-80 border-l border-[#2a2a2a]" : "w-0"
      }`}
    >
      <div className="bg-[#1a1a1a] h-full p-4 flex flex-col gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-[#f5f5f5] truncate">
            {sessionData.analysis.title ?? sessionData.analysis.fileName}
          </h3>
          <p className="text-xs text-[#b0b0b0]">
            {sessionData.analysis.pageCount ? `${currentPage} / ${sessionData.analysis.pageCount}` : "PDF"}
          </p>
        </div>

        <Card className="flex-1 bg-[#0f0f0f] border-[#2a2a2a] flex items-center justify-center overflow-hidden">
          <div className="text-center space-y-3">
            <div className="rounded-lg bg-[#3a8a2a]/25 p-4 text-[#4ba835] w-fit mx-auto">
              <File className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-[#f5f5f5]">Aperçu du PDF</p>
              <p className="text-xs text-[#b0b0b0]">
                {sessionData.analysis.fileName}
              </p>
            </div>
          </div>
        </Card>

        {sessionData.analysis.pageCount && (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex-1 border-[#2a2a2a] text-[#f5f5f5] hover:bg-[#2a2a2a]"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage(Math.min(sessionData.analysis.pageCount!, currentPage + 1))}
              disabled={currentPage === sessionData.analysis.pageCount}
              className="flex-1 border-[#2a2a2a] text-[#f5f5f5] hover:bg-[#2a2a2a]"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
