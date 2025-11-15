import React, { useState, useRef, useCallback, useEffect } from "react"
import { Maximize2, Search, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAnalysis } from "../context/useAnalysis"
import type {
  AnalysisSessionData,
  SearchResult,
  PDFDocumentProxy,
  RenderTask
} from "../types"
import { drawHighlights, type TextMatch } from "../utils/pdfHighlights"

// PDF Viewer Component with search
function PDFViewer({ fileName, className }: { fileName: string; className?: string }) {
  const { currentHighlightRequest } = useAnalysis()
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

  const goToPage = useCallback((pageNum: number, highlights: TextMatch[] = []) => {
    if (pdfDoc && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      setCurrentHighlights(highlights);
    }
  }, [pdfDoc, totalPages]);

  const searchInPDF = useCallback(async (text: string) => {
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
  }, [pdfDoc, totalPages, goToPage]);

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

  // Handle highlight requests from external sources (like review points)
  useEffect(() => {
    if (currentHighlightRequest && pdfDoc) {
      // Use setTimeout to avoid synchronous state update in effect
      setTimeout(() => {
        setSearchText(currentHighlightRequest.searchText)
        if (currentHighlightRequest.page) {
          goToPage(currentHighlightRequest.page, currentHighlightRequest.matches || [])
        } else {
          // Perform search if no specific page is provided
          searchInPDF(currentHighlightRequest.searchText)
        }
      }, 0)
    }
  }, [currentHighlightRequest, pdfDoc, goToPage, searchInPDF])

  return (
    <div className={`h-screen bg-[#0f0f0f] ${className}`}>
      <div className="h-full flex flex-col">
        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-900/50 border border-red-600 text-red-300 text-sm">
            {error}
          </div>
        )}

        {pdfDoc && (
          <>
            {/* Search Bar */}
            <div className="p-3 border-b border-[#2a2a2a] bg-[#1a1a1a]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Rechercher dans le PDF..."
                  className="flex-1 px-3 py-1.5 text-sm bg-[#2a2a2a] border border-[#3a3a3a] rounded text-[#f5f5f5] placeholder-[#b0b0b0] focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <Button
                  onClick={handleSearch}
                  disabled={isSearching}
                  variant="outline"
                  size="sm"
                  className="px-3 text-xs bg-[#2a2a2a] border-[#3a3a3a] text-[#f5f5f5] hover:bg-[#3a3a3a]"
                >
                  <Search className="h-3 w-3 mr-1" />
                  {isSearching ? 'Recherche...' : 'Rechercher'}
                </Button>
              </div>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="p-3 bg-[#1a1a1a] border-b border-[#2a2a2a]">
                <h3 className="text-xs font-medium mb-2 text-[#f5f5f5]">
                  Trouvé sur {searchResults.length} page(s):
                </h3>
                <div className="space-y-1 max-h-24 overflow-auto">
                  {searchResults.map((result) => (
                    <button
                      key={result.page}
                      onClick={() => goToPage(result.page, result.matches)}
                      className="w-full text-left p-2 bg-[#2a2a2a] rounded hover:bg-[#3a3a3a] transition text-xs"
                    >
                      <span className="font-medium text-blue-400">Page {result.page}</span>
                      <p className="text-[#b0b0b0] truncate">{result.preview}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {searchResults.length === 0 && searchText && !isSearching && (
              <div className="p-3 bg-yellow-900/30 border-b border-yellow-600/30 text-yellow-300 text-xs">
                Aucun résultat pour "{searchText}"
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center justify-between p-3 border-b border-[#2a2a2a] bg-[#1a1a1a]">
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0 bg-[#2a2a2a] border-[#3a3a3a] text-[#f5f5f5] hover:bg-[#3a3a3a]"
                >
                  <ChevronLeft className="h-3 w-3" />
                </Button>
                <span className="text-xs text-[#f5f5f5] font-medium">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0 bg-[#2a2a2a] border-[#3a3a3a] text-[#f5f5f5] hover:bg-[#3a3a3a]"
                >
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={handleZoomOut}
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0 bg-[#2a2a2a] border-[#3a3a3a] text-[#f5f5f5] hover:bg-[#3a3a3a]"
                >
                  <ZoomOut className="h-3 w-3" />
                </Button>
                <span className="text-xs text-[#f5f5f5] font-medium">{Math.round(scale * 100)}%</span>
                <Button
                  onClick={handleZoomIn}
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0 bg-[#2a2a2a] border-[#3a3a3a] text-[#f5f5f5] hover:bg-[#3a3a3a]"
                >
                  <ZoomIn className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* PDF Canvas */}
            <div className="flex-1 bg-[#f5f5f5] overflow-auto h-full">
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
              <div className="text-4xl mb-4">📄</div>
              <p className="text-sm">Chargement du PDF...</p>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex-1 flex items-center justify-center text-[#b0b0b0]">
            <div className="text-center">
              <div className="text-4xl mb-4 animate-pulse">📄</div>
              <p className="text-sm">Chargement en cours...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

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
    <div className="h-screen flex flex-col overflow-hidden">
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

      <div className="flex-1">
        <PDFViewer fileName={sessionData.document.fileName} />
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