import { useRef, useState, useEffect } from "react"
import { MessageCircle } from "lucide-react"
import "./ChatBotButton.css"


interface ChatBotButtonProps {
  onClick: () => void
  movable?: boolean
}

export default function ChatBotButton({ onClick, movable }: ChatBotButtonProps) {
  // Persistance de la position dans le localStorage
  const STORAGE_KEY = 'chatbot-btn-pos-v1';
  const getInitialPos = () => {
    if (typeof window === 'undefined') return { x: 30, y: 30 };
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          return parsed;
        }
      } catch {}
    }
    // Par défaut en bas à droite
    const btnW = 60, btnH = 60;
    return { x: window.innerWidth - btnW - 30, y: window.innerHeight - btnH - 30 };
  };

  const [pos, setPos] = useState<{x: number, y: number}>(() => getInitialPos());
  // Ref pour suivre la position courante pendant le drag
  const dragPosRef = useRef<{x: number, y: number}>(pos);
  const [dragging, setDragging] = useState(false)
  const dragOffset = useRef<{x: number, y: number}>({ x: 0, y: 0 })

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!movable) return
    setDragging(true)
    dragOffset.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y
    }
    e.preventDefault()
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging) return;
    let newX = e.clientX - dragOffset.current.x;
    let newY = e.clientY - dragOffset.current.y;
    // Limiter aux bords de l'écran
    const btnW = 60, btnH = 60;
    const maxX = window.innerWidth - btnW - 10;
    const maxY = window.innerHeight - btnH - 10;
    newX = Math.max(10, Math.min(newX, maxX));
    newY = Math.max(10, Math.min(newY, maxY));
    dragPosRef.current = { x: newX, y: newY };
    setPos({ x: newX, y: newY });
    // Sauvegarde la position en temps réel
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ x: newX, y: newY }));
  };

  const handleMouseUp = () => {
    if (!movable) return setDragging(false);
    // Snap to nearest edge (horizontal OU vertical, le plus proche)
    const btnW = 60, btnH = 60;
    const maxX = window.innerWidth - btnW - 10;
    const maxY = window.innerHeight - btnH - 10;
    // Utilise la dernière position du drag
    let snapX = dragPosRef.current.x;
    let snapY = dragPosRef.current.y;
    // Distance to each edge
    const distLeft = snapX;
    const distRight = maxX - snapX;
    const distTop = snapY;
    const distBottom = maxY - snapY;
    const minH = Math.min(distLeft, distRight);
    const minV = Math.min(distTop, distBottom);
    if (minH < minV) {
      // Snap horizontal
      snapX = distLeft < distRight ? 10 : maxX;
    } else {
      // Snap vertical
      snapY = distTop < distBottom ? 10 : maxY;
    }
    setPos({ x: snapX, y: snapY });
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ x: snapX, y: snapY }));
    dragPosRef.current = { x: snapX, y: snapY };
    setDragging(false);
  };

  // Attach/detach listeners
  useEffect(() => {
    if (!movable) return;
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    // eslint-disable-next-line
  }, [dragging, movable]);

  return (
    <button
      className={movable ? `chatbot-floating-btn${dragging ? " dragging" : ""}` : "chatbot-button"}
      onClick={onClick}
      title="Parler à Lummy"
      style={
        movable
          ? {
              left: pos.x + 'px',
              top: pos.y + 'px',
              position: 'fixed',
              zIndex: 9999
            }
          : undefined
      }
      onMouseDown={handleMouseDown}
    >
      <MessageCircle size={28} />
    </button>
  );
}
