import { useState, useRef, useCallback } from "react"
import { Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAnalysis } from "../context/useAnalysis"
import type { AnalysisSessionData } from "../types"

// Component for PDF content rendering
function PDFContent({
  sessionData,
  onToggleFloating
}: {
  sessionData: AnalysisSessionData
  onToggleFloating: () => void
}) {
  if (!sessionData?.document) {
    return (
      <div className="flex items-center justify-center h-full text-[#b0b0b0]">
        <p>Aucun document sélectionné</p>
      </div>
    )
  }

  // Get title from analysis or fallback to fileName
  const documentTitle = sessionData.analysis?.title || sessionData.document.fileName

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-[#2a2a2a] bg-[#1a1a1a]">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-[#f5f5f5] truncate">
              {documentTitle}
            </h3>
            <p className="text-xs text-[#b0b0b0] truncate">
              {sessionData.document.fileName}
            </p>
          </div>

          <Button
            onClick={onToggleFloating}
            variant="ghost"
            size="sm"
            className="ml-2 h-8 w-8 p-0 text-[#b0b0b0]"
            title="Ouvrir dans une fenêtre flottante"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 bg-[#f5f5f5] overflow-auto">
        {(() => {
          // Determine PDF URL based on document or use sample
          const pdfUrl = `/pdfs/${sessionData.document.fileName}`

          return (
            <object
              data={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1&page=1&view=FitH`}
              type="application/pdf"
              className="w-full h-full border-0"
              title={`PDF Preview - ${sessionData.document.fileName}`}
            >
              <div className="flex items-center justify-center h-full text-gray-500 p-8">
                <div className="text-center space-y-4 max-w-md">
                  <div className="text-6xl mb-4">📄</div>
                  <h3 className="text-lg font-medium">PDF non disponible</h3>
                  <p className="text-sm text-gray-400">
                    Votre navigateur ne peut pas afficher ce PDF ou le fichier est indisponible.
                  </p>
                  <p className="text-sm font-medium">{sessionData.document.fileName}</p>
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                  >
                    Ouvrir dans un nouvel onglet
                  </a>
                </div>
              </div>
            </object>
          )
        })()}
      </div>
    </div>
  )
}

export function PDFPreview() {
  const { sessionData, isPreviewOpen, isFloating, setIsFloating } = useAnalysis()
  const [sidebarWidth, setSidebarWidth] = useState(384) // 96 * 4 = 384px (w-96)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const [isResizingSidebar, setIsResizingSidebar] = useState(false)

  // Sidebar resize handlers
  const handleSidebarResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizingSidebar(true)

    const handleSidebarResize = (e: MouseEvent) => {
      const newWidth = Math.max(250, Math.min(800, window.innerWidth - e.clientX))
      setSidebarWidth(newWidth)
    }

    const handleSidebarResizeEnd = () => {
      setIsResizingSidebar(false)
      document.removeEventListener('mousemove', handleSidebarResize)
      document.removeEventListener('mouseup', handleSidebarResizeEnd)
    }

    document.addEventListener('mousemove', handleSidebarResize)
    document.addEventListener('mouseup', handleSidebarResizeEnd)
  }, [])

  // Don't render sidebar if preview is not open, no session data, or in floating mode
  if (!isPreviewOpen || !sessionData || isFloating) {
    return null
  }

  // Sidebar preview mode (original)
  return (
    <aside
      ref={sidebarRef}
      className={`border-l border-[#2a2a2a] bg-[#0f0f0f] h-full relative ${isResizingSidebar ? 'select-none' : ''
        }`}
      style={{ width: sidebarWidth }}
    >
      {/* Resize handle for sidebar */}
      <div
        className={`absolute left-0 top-0 w-1 h-full cursor-col-resize transition-colors z-10 ${isResizingSidebar ? 'bg-[#4a4a4a]' : 'bg-transparent hover:bg-[#4a4a4a]'
          }`}
        onMouseDown={handleSidebarResizeStart}
        title="Redimensionner la barre latérale"
      />

      <PDFContent
        sessionData={sessionData}
        onToggleFloating={() => setIsFloating(true)}
      />
    </aside>
  )
}