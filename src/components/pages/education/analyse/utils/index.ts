/**
 * PDF highlighting utilities
 * 
 * Usage:
 * ```tsx
 * import { drawHighlights, type TextMatch } from '@/components/pages/education/analyse/utils'
 * 
 * // Draw highlights on canvas context
 * const matches: TextMatch[] = [
 *   { text: "example", x: 100, y: 200, width: 50, height: 15 }
 * ];
 * drawHighlights(canvasContext, matches, viewport, scale);
 * ```
 */
export { drawHighlights, type TextMatch, type PDFViewport } from "./pdfHighlights";