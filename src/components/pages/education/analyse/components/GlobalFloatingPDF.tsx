import { useState, useRef, useCallback, useEffect } from "react"
import { Minimize2, Move } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAnalysis } from "../context/useAnalysis"

interface DragState {
  isDragging: boolean
  startX: number
  startY: number
  startLeft: number
  startTop: number
}

export function GlobalFloatingPDF() {
  const { 
    sessionData, 
    isPreviewOpen, 
    isFloating, 
    setIsFloating, 
    floatingPosition, 
    setFloatingPosition, 
    floatingSize, 
    setFloatingSize 
  } = useAnalysis()
  
  const dragRef = useRef<HTMLDivElement>(null)
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startX: 0,
    startY: 0,
    startLeft: 0,
    startTop: 0
  })

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!dragRef.current) return

    const rect = dragRef.current.getBoundingClientRect()
    setDragState({
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      startLeft: rect.left,
      startTop: rect.top
    })
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragState.isDragging) return

    const deltaX = e.clientX - dragState.startX
    const deltaY = e.clientY - dragState.startY

    setFloatingPosition({
      x: Math.max(0, Math.min(window.innerWidth - floatingSize.width, dragState.startLeft + deltaX)),
      y: Math.max(0, Math.min(window.innerHeight - floatingSize.height, dragState.startTop + deltaY))
    })
  }, [dragState, floatingSize, setFloatingPosition])

  const handleMouseUp = useCallback(() => {
    setDragState(prev => ({ ...prev, isDragging: false }))
  }, [])

  // Add event listeners for mouse move and up when dragging
  useEffect(() => {
    if (dragState.isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [dragState.isDragging, handleMouseMove, handleMouseUp])

  // Don't render if not floating, no preview open, or no session data
  if (!isFloating || !isPreviewOpen || !sessionData?.document) {
    return null
  }

  // Get title from analysis or fallback to fileName
  const documentTitle = sessionData.analysis?.title || sessionData.document.fileName

  return (
    <div
      ref={dragRef}
      className="fixed z-50 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg shadow-2xl overflow-hidden"
      style={{
        left: floatingPosition.x,
        top: floatingPosition.y,
        width: floatingSize.width,
        height: floatingSize.height,
        cursor: dragState.isDragging ? 'grabbing' : 'default'
      }}
    >
      {/* Floating window header */}
      <div
        className="flex items-center justify-between p-3 bg-[#1a1a1a] border-b border-[#2a2a2a] cursor-grab select-none"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <Move className="h-4 w-4 text-[#b0b0b0]" />
          <span className="text-sm font-medium text-[#f5f5f5]">
            Aperçu PDF - {documentTitle}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            onClick={() => setIsFloating(false)}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-[#b0b0b0] hover:bg-[#2a2a2a]"
            title="Ancrer dans la barre latérale"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Floating window content */}
      <div className="h-full pb-12 bg-[#f5f5f5] overflow-auto">
        {(() => {
          // Determine PDF URL based on document
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

      {/* Resize handles */}
      {/* Bottom-right corner resize */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-tl z-10"
        onMouseDown={(e) => {
          e.stopPropagation()
          e.preventDefault()
          const startX = e.clientX
          const startY = e.clientY
          const startWidth = floatingSize.width
          const startHeight = floatingSize.height

          const handleResize = (e: MouseEvent) => {
            e.preventDefault()
            const deltaX = e.clientX - startX
            const deltaY = e.clientY - startY
            const newWidth = Math.max(300, Math.min(window.innerWidth - floatingPosition.x, startWidth + deltaX))
            const newHeight = Math.max(200, Math.min(window.innerHeight - floatingPosition.y, startHeight + deltaY))
            setFloatingSize({ width: newWidth, height: newHeight })
          }

          const handleResizeEnd = () => {
            document.removeEventListener('mousemove', handleResize)
            document.removeEventListener('mouseup', handleResizeEnd)
            document.body.style.cursor = ''
            document.body.style.userSelect = ''
          }

          document.body.style.cursor = 'se-resize'
          document.body.style.userSelect = 'none'
          document.addEventListener('mousemove', handleResize)
          document.addEventListener('mouseup', handleResizeEnd)
        }}
      />

      {/* Right edge resize */}
      <div
        className="absolute top-0 right-0 w-2 h-full cursor-e-resize bg-transparent hover:bg-[#4a4a4a] transition-colors z-10"
        onMouseDown={(e) => {
          e.stopPropagation()
          e.preventDefault()
          const startX = e.clientX
          const startWidth = floatingSize.width

          const handleResize = (e: MouseEvent) => {
            e.preventDefault()
            const deltaX = e.clientX - startX
            const newWidth = Math.max(300, Math.min(window.innerWidth - floatingPosition.x, startWidth + deltaX))
            setFloatingSize({ width: newWidth, height: floatingSize.height })
          }

          const handleResizeEnd = () => {
            document.removeEventListener('mousemove', handleResize)
            document.removeEventListener('mouseup', handleResizeEnd)
            document.body.style.cursor = ''
            document.body.style.userSelect = ''
          }

          document.body.style.cursor = 'e-resize'
          document.body.style.userSelect = 'none'
          document.addEventListener('mousemove', handleResize)
          document.addEventListener('mouseup', handleResizeEnd)
        }}
      />

      {/* Bottom edge resize */}
      <div
        className="absolute bottom-0 left-0 w-full h-2 cursor-s-resize bg-transparent hover:bg-[#4a4a4a] transition-colors z-10"
        onMouseDown={(e) => {
          e.stopPropagation()
          e.preventDefault()
          const startY = e.clientY
          const startHeight = floatingSize.height

          const handleResize = (e: MouseEvent) => {
            e.preventDefault()
            const deltaY = e.clientY - startY
            const newHeight = Math.max(200, Math.min(window.innerHeight - floatingPosition.y, startHeight + deltaY))
            setFloatingSize({ width: floatingSize.width, height: newHeight })
          }

          const handleResizeEnd = () => {
            document.removeEventListener('mousemove', handleResize)
            document.removeEventListener('mouseup', handleResizeEnd)
            document.body.style.cursor = ''
            document.body.style.userSelect = ''
          }

          document.body.style.cursor = 's-resize'
          document.body.style.userSelect = 'none'
          document.addEventListener('mousemove', handleResize)
          document.addEventListener('mouseup', handleResizeEnd)
        }}
      />

      {/* Left edge resize */}
      <div
        className="absolute top-0 left-0 w-2 h-full cursor-w-resize bg-transparent hover:bg-[#4a4a4a] transition-colors z-10"
        onMouseDown={(e) => {
          e.stopPropagation()
          e.preventDefault()
          const startX = e.clientX
          const startWidth = floatingSize.width
          const startLeft = floatingPosition.x

          const handleResize = (e: MouseEvent) => {
            e.preventDefault()
            const deltaX = e.clientX - startX
            const newWidth = Math.max(300, startWidth - deltaX)
            const newLeft = Math.max(0, Math.min(startLeft + deltaX, startLeft + startWidth - 300))

            setFloatingSize({ width: newWidth, height: floatingSize.height })
            setFloatingPosition({ x: newLeft, y: floatingPosition.y })
          }

          const handleResizeEnd = () => {
            document.removeEventListener('mousemove', handleResize)
            document.removeEventListener('mouseup', handleResizeEnd)
            document.body.style.cursor = ''
            document.body.style.userSelect = ''
          }

          document.body.style.cursor = 'w-resize'
          document.body.style.userSelect = 'none'
          document.addEventListener('mousemove', handleResize)
          document.addEventListener('mouseup', handleResizeEnd)
        }}
      />

      {/* Top edge resize */}
      <div
        className="absolute top-0 left-0 w-full h-2 cursor-n-resize bg-transparent hover:bg-[#4a4a4a] transition-colors z-10"
        onMouseDown={(e) => {
          e.stopPropagation()
          e.preventDefault()
          const startY = e.clientY
          const startHeight = floatingSize.height
          const startTop = floatingPosition.y

          const handleResize = (e: MouseEvent) => {
            e.preventDefault()
            const deltaY = e.clientY - startY
            const newHeight = Math.max(200, startHeight - deltaY)
            const newTop = Math.max(0, Math.min(startTop + deltaY, startTop + startHeight - 200))

            setFloatingSize({ width: floatingSize.width, height: newHeight })
            setFloatingPosition({ x: floatingPosition.x, y: newTop })
          }

          const handleResizeEnd = () => {
            document.removeEventListener('mousemove', handleResize)
            document.removeEventListener('mouseup', handleResizeEnd)
            document.body.style.cursor = ''
            document.body.style.userSelect = ''
          }

          document.body.style.cursor = 'n-resize'
          document.body.style.userSelect = 'none'
          document.addEventListener('mousemove', handleResize)
          document.addEventListener('mouseup', handleResizeEnd)
        }}
      />

      {/* Corner resize handles */}
      {/* Top-left corner resize */}
      <div
        className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-br z-10"
        onMouseDown={(e) => {
          e.stopPropagation()
          e.preventDefault()
          const startX = e.clientX
          const startY = e.clientY
          const startWidth = floatingSize.width
          const startHeight = floatingSize.height
          const startLeft = floatingPosition.x
          const startTop = floatingPosition.y

          const handleResize = (e: MouseEvent) => {
            e.preventDefault()
            const deltaX = e.clientX - startX
            const deltaY = e.clientY - startY

            const newWidth = Math.max(300, startWidth - deltaX)
            const newHeight = Math.max(200, startHeight - deltaY)
            const newLeft = Math.max(0, Math.min(startLeft + deltaX, startLeft + startWidth - 300))
            const newTop = Math.max(0, Math.min(startTop + deltaY, startTop + startHeight - 200))

            setFloatingSize({ width: newWidth, height: newHeight })
            setFloatingPosition({ x: newLeft, y: newTop })
          }

          const handleResizeEnd = () => {
            document.removeEventListener('mousemove', handleResize)
            document.removeEventListener('mouseup', handleResizeEnd)
            document.body.style.cursor = ''
            document.body.style.userSelect = ''
          }

          document.body.style.cursor = 'nw-resize'
          document.body.style.userSelect = 'none'
          document.addEventListener('mousemove', handleResize)
          document.addEventListener('mouseup', handleResizeEnd)
        }}
      />

      {/* Top-right corner resize */}
      <div
        className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-bl z-10"
        onMouseDown={(e) => {
          e.stopPropagation()
          e.preventDefault()
          const startX = e.clientX
          const startY = e.clientY
          const startWidth = floatingSize.width
          const startHeight = floatingSize.height
          const startTop = floatingPosition.y

          const handleResize = (e: MouseEvent) => {
            e.preventDefault()
            const deltaX = e.clientX - startX
            const deltaY = e.clientY - startY

            const newWidth = Math.max(300, Math.min(window.innerWidth - floatingPosition.x, startWidth + deltaX))
            const newHeight = Math.max(200, startHeight - deltaY)
            const newTop = Math.max(0, Math.min(startTop + deltaY, startTop + startHeight - 200))

            setFloatingSize({ width: newWidth, height: newHeight })
            setFloatingPosition({ x: floatingPosition.x, y: newTop })
          }

          const handleResizeEnd = () => {
            document.removeEventListener('mousemove', handleResize)
            document.removeEventListener('mouseup', handleResizeEnd)
            document.body.style.cursor = ''
            document.body.style.userSelect = ''
          }

          document.body.style.cursor = 'ne-resize'
          document.body.style.userSelect = 'none'
          document.addEventListener('mousemove', handleResize)
          document.addEventListener('mouseup', handleResizeEnd)
        }}
      />

      {/* Bottom-left corner resize */}
      <div
        className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-tr z-10"
        onMouseDown={(e) => {
          e.stopPropagation()
          e.preventDefault()
          const startX = e.clientX
          const startY = e.clientY
          const startWidth = floatingSize.width
          const startHeight = floatingSize.height
          const startLeft = floatingPosition.x

          const handleResize = (e: MouseEvent) => {
            e.preventDefault()
            const deltaX = e.clientX - startX
            const deltaY = e.clientY - startY

            const newWidth = Math.max(300, startWidth - deltaX)
            const newHeight = Math.max(200, Math.min(window.innerHeight - floatingPosition.y, startHeight + deltaY))
            const newLeft = Math.max(0, Math.min(startLeft + deltaX, startLeft + startWidth - 300))

            setFloatingSize({ width: newWidth, height: newHeight })
            setFloatingPosition({ x: newLeft, y: floatingPosition.y })
          }

          const handleResizeEnd = () => {
            document.removeEventListener('mousemove', handleResize)
            document.removeEventListener('mouseup', handleResizeEnd)
            document.body.style.cursor = ''
            document.body.style.userSelect = ''
          }

          document.body.style.cursor = 'sw-resize'
          document.body.style.userSelect = 'none'
          document.addEventListener('mousemove', handleResize)
          document.addEventListener('mouseup', handleResizeEnd)
        }}
      />
    </div>
  )
}