import { useState, useRef, useCallback, useEffect } from "react"
import { Minimize2, Move, Search, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAnalysis } from "../context/useAnalysis"
import type { 
  SearchResult, 
  PDFDocumentProxy, 
  RenderTask
} from "../types"
import { drawHighlights, type TextMatch } from "../utils/pdfHighlights"

interface DragState {
  isDragging: boolean
  startX: number
  startY: number
  startLeft: number
  startTop: number
}

// PDF Viewer Component with search for floating window
function FloatingPDFViewer({ fileName, className }: { fileName: string; className?: string }) {
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [scale, setScale] = useState<number>(1.5);
  const [searchText, setSearchText] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [currentHighlights, setCurrentHighlights] = useState<TextMatch[]>([]);
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const highlightCanvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<RenderTask | null>(null);
  const scriptLoadedRef = useRef<boolean>(false);
  const currentRenderIdRef = useRef<number>(0);

  const loadPDFFromUrl = useCallback(async (url: string) => {
    if (!window.pdfjsLib) {
      setError('PDF.js library not loaded yet. Please try again.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      setPdfDoc(pdf);
      setTotalPages(pdf.numPages);
      setCurrentPage(1);
      setIsLoading(false);
    } catch (err) {
      setError(`Failed to load PDF: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsLoading(false);
    }
  }, []);

  const renderPage = useCallback(async (pdf: PDFDocumentProxy, pageNum: number) => {
    // Generate a unique render ID for this render operation
    const renderId = ++currentRenderIdRef.current;

    // Cancel any existing render task
    if (renderTaskRef.current) {
      try {
        // Try to cancel the render task if it has a cancel method
        if (renderTaskRef.current.cancel) {
          renderTaskRef.current.cancel();
        }
        // Wait for the promise to resolve/reject
        await renderTaskRef.current.promise.catch(() => {
          // Ignore cancellation errors
        });
      } catch {
        // Ignore any errors from cancellation
      }
      renderTaskRef.current = null;
    }

    // Check if this render is still current
    if (currentRenderIdRef.current !== renderId) {
      return;
    }

    if (isRendering) {
      return;
    }

    try {
      setIsRendering(true);
      const page = await pdf.getPage(pageNum);
      const canvas = canvasRef.current;
      const highlightCanvas = highlightCanvasRef.current;

      if (!canvas || !highlightCanvas) {
        setIsRendering(false);
        return;
      }

      const context = canvas.getContext('2d');
      const highlightContext = highlightCanvas.getContext('2d');
      if (!context || !highlightContext) {
        setIsRendering(false);
        return;
      }

      const viewport = page.getViewport({ scale });
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      highlightCanvas.height = viewport.height;
      highlightCanvas.width = viewport.width;

      // Clear both canvases
      context.clearRect(0, 0, canvas.width, canvas.height);
      highlightContext.clearRect(0, 0, highlightCanvas.width, highlightCanvas.height);

      // Start render
      const renderTask = page.render({
        canvasContext: context,
        viewport: viewport
      });
      renderTaskRef.current = renderTask;

      await renderTask.promise;

      // Only proceed if this render is still current
      if (currentRenderIdRef.current !== renderId) {
        return;
      }

      // Only proceed if this is still the current render task
      if (renderTaskRef.current === renderTask) {
        renderTaskRef.current = null;
      }

      // Draw highlights if any for current page
      if (currentHighlights.length > 0) {
        drawHighlights(highlightContext, currentHighlights, viewport, scale);
      }

      setIsRendering(false);
    } catch (err) {
      setIsRendering(false);
      if (err && typeof err === 'object' && 'name' in err && err.name !== 'RenderingCancelledException') {
        setError(`Failed to render page: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }
  }, [scale, currentHighlights, isRendering]);

  // Load PDF.js library
  useEffect(() => {
    if (scriptLoadedRef.current) return;

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.async = true;
    script.onload = () => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        scriptLoadedRef.current = true;
        // Auto-load PDF if fileName is provided
        if (fileName) {
          loadPDFFromUrl(`/pdfs/${fileName}`);
        }
      }
    };
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [fileName, loadPDFFromUrl]);

  // Render page when PDF or page changes
  useEffect(() => {
    if (pdfDoc && currentPage && !isLoading) {
      // Use a timeout to avoid synchronous setState within effect
      const timeoutId = setTimeout(() => {
        renderPage(pdfDoc, currentPage);
      }, 0);
      return () => {
        clearTimeout(timeoutId);
        // Cancel any ongoing render task
        if (renderTaskRef.current) {
          renderTaskRef.current.promise.catch(() => { });
          renderTaskRef.current = null;
        }
      };
    }
  }, [pdfDoc, currentPage, renderPage, isLoading]);

  // Cleanup effect to cancel render tasks on unmount
  useEffect(() => {
    return () => {
      if (renderTaskRef.current) {
        renderTaskRef.current.promise.catch(() => { });
        renderTaskRef.current = null;
      }
    };
  }, []);

  const goToPage = (pageNum: number, highlights: TextMatch[] = []) => {
    if (pdfDoc && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      setCurrentHighlights(highlights);
    }
  };

  const searchInPDF = async (text: string) => {
    if (!pdfDoc || !text.trim()) {
      setSearchResults([]);
      setCurrentHighlights([]);
      return;
    }

    setIsSearching(true);
    const results: SearchResult[] = [];
    const searchLower = text.toLowerCase();

    try {
      for (let i = 1; i <= totalPages; i++) {
        const page = await pdfDoc.getPage(i);
        const textContent = await page.getTextContent();
        const viewport = page.getViewport({ scale: 1.0 });

        const pageText = textContent.items.map(item => item.str).join(' ');
        const matches: TextMatch[] = [];

        if (pageText.toLowerCase().includes(searchLower)) {
          textContent.items.forEach((item) => {
            const itemTextLower = item.str.toLowerCase();
            if (itemTextLower.includes(searchLower)) {
              const transform = item.transform;
              const fontSize = Math.sqrt(transform[2] * transform[2] + transform[3] * transform[3]);

              matches.push({
                text: item.str,
                x: transform[4],
                y: viewport.height - transform[5] - fontSize,
                width: item.width,
                height: fontSize * 1.2
              });
            }
          });

          const index = pageText.toLowerCase().indexOf(searchLower);
          const start = Math.max(0, index - 30);
          const end = Math.min(pageText.length, index + searchLower.length + 30);

          results.push({
            page: i,
            preview: '...' + pageText.substring(start, end) + '...',
            matches: matches
          });
        }
      }

      setSearchResults(results);
      setIsSearching(false);

      if (results.length > 0) {
        goToPage(results[0].page, results[0].matches);
      }
    } catch (err) {
      setError(`Search failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsSearching(false);
    }
  };

  const handleSearch = () => {
    searchInPDF(searchText);
  };

  const handleZoomIn = () => {
    const newScale = Math.min(scale + 0.25, 3);
    setScale(newScale);
  };

  const handleZoomOut = () => {
    const newScale = Math.max(scale - 0.25, 0.5);
    setScale(newScale);
  };

  return (
    <div className={`h-full bg-[#0f0f0f] ${className}`}>
      <div className="h-full flex flex-col">
        {/* Error Message */}
        {error && (
          <div className="p-2 bg-red-900/50 border border-red-600 text-red-300 text-xs">
            {error}
          </div>
        )}

        {pdfDoc && (
          <>
            {/* Search Bar */}
            <div className="p-2 border-b border-[#2a2a2a] bg-[#1a1a1a]">
              <div className="flex gap-1">
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Rechercher..."
                  className="flex-1 px-2 py-1 text-xs bg-[#2a2a2a] border border-[#3a3a3a] rounded text-[#f5f5f5] placeholder-[#b0b0b0] focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <Button
                  onClick={handleSearch}
                  disabled={isSearching}
                  variant="outline"
                  size="sm"
                  className="px-2 text-xs bg-[#2a2a2a] border-[#3a3a3a] text-[#f5f5f5] hover:bg-[#3a3a3a] h-7"
                >
                  <Search className="h-3 w-3 mr-1" />
                  {isSearching ? '...' : 'OK'}
                </Button>
              </div>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="p-2 bg-[#1a1a1a] border-b border-[#2a2a2a] max-h-20 overflow-auto">
                <div className="text-xs font-medium mb-1 text-[#f5f5f5]">
                  {searchResults.length} résultat(s):
                </div>
                <div className="space-y-1">
                  {searchResults.map((result) => (
                    <button
                      key={result.page}
                      onClick={() => goToPage(result.page, result.matches)}
                      className="w-full text-left p-1 bg-[#2a2a2a] rounded hover:bg-[#3a3a3a] transition text-xs"
                    >
                      <span className="font-medium text-blue-400">P{result.page}</span>
                      <p className="text-[#b0b0b0] truncate">{result.preview}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {searchResults.length === 0 && searchText && !isSearching && (
              <div className="p-2 bg-yellow-900/30 border-b border-yellow-600/30 text-yellow-300 text-xs">
                Aucun résultat pour "{searchText}"
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center justify-between p-2 border-b border-[#2a2a2a] bg-[#1a1a1a]">
              <div className="flex items-center gap-1">
                <Button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                  variant="outline"
                  size="sm"
                  className="h-6 w-6 p-0 bg-[#2a2a2a] border-[#3a3a3a] text-[#f5f5f5] hover:bg-[#3a3a3a]"
                >
                  <ChevronLeft className="h-3 w-3" />
                </Button>
                <span className="text-xs text-[#f5f5f5] font-medium px-1">
                  {currentPage}/{totalPages}
                </span>
                <Button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  variant="outline"
                  size="sm"
                  className="h-6 w-6 p-0 bg-[#2a2a2a] border-[#3a3a3a] text-[#f5f5f5] hover:bg-[#3a3a3a]"
                >
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  onClick={handleZoomOut}
                  variant="outline"
                  size="sm"
                  className="h-6 w-6 p-0 bg-[#2a2a2a] border-[#3a3a3a] text-[#f5f5f5] hover:bg-[#3a3a3a]"
                >
                  <ZoomOut className="h-3 w-3" />
                </Button>
                <span className="text-xs text-[#f5f5f5] font-medium px-1">{Math.round(scale * 100)}%</span>
                <Button
                  onClick={handleZoomIn}
                  variant="outline"
                  size="sm"
                  className="h-6 w-6 p-0 bg-[#2a2a2a] border-[#3a3a3a] text-[#f5f5f5] hover:bg-[#3a3a3a]"
                >
                  <ZoomIn className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* PDF Canvas */}
            <div className="flex-1 bg-[#f5f5f5] overflow-auto">
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <canvas ref={canvasRef} className="mx-auto" />
                <canvas
                  ref={highlightCanvasRef}
                  className="mx-auto"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    pointerEvents: 'none'
                  }}
                />
              </div>
            </div>
          </>
        )}

        {!pdfDoc && !isLoading && (
          <div className="flex-1 flex items-center justify-center text-[#b0b0b0]">
            <div className="text-center">
              <div className="text-2xl mb-2">📄</div>
              <p className="text-xs">Chargement du PDF...</p>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex-1 flex items-center justify-center text-[#b0b0b0]">
            <div className="text-center">
              <div className="text-2xl mb-2 animate-pulse">📄</div>
              <p className="text-xs">Chargement en cours...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
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
      <div className="h-full pb-12">
        <FloatingPDFViewer fileName={sessionData.document.fileName} />
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