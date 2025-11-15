// PDF highlight utility functions

export interface TextMatch {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PDFViewport {
  width: number;
  height: number;
}

export const drawHighlights = (
  context: CanvasRenderingContext2D, 
  matches: TextMatch[], 
  _viewport: PDFViewport, 
  scale: number
) => {
  context.fillStyle = 'rgba(255, 255, 0, 0.5)';
  context.strokeStyle = 'rgba(255, 200, 0, 0.8)';
  context.lineWidth = 2;
  
  matches.forEach(match => {
    const scaledX = match.x * scale;
    const scaledY = match.y * scale;
    const scaledWidth = match.width * scale;
    const scaledHeight = match.height * scale;
    
    context.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);
    context.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);
  });
  
  console.log('Drew highlights:', matches.length, 'matches at scale', scale);
};