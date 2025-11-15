import { useRef, useState, useEffect } from "react"
import { MessageCircle } from "lucide-react"
import "./ChatBotButton.css"

interface ChatBotButtonProps {
  onClick: () => void
  movable?: boolean
}

export default function ChatBotButton({ onClick, movable }: ChatBotButtonProps) {
  const [pos, setPos] = useState<{x: number, y: number}>({ x: 30, y: 30 })
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
    if (!dragging) return
    let newX = e.clientX - dragOffset.current.x
    let newY = e.clientY - dragOffset.current.y
    // Limiter aux bords de l'écran
    const btnW = 60, btnH = 60
    const maxX = window.innerWidth - btnW - 10
    const maxY = window.innerHeight - btnH - 10
    newX = Math.max(10, Math.min(newX, maxX))
    newY = Math.max(10, Math.min(newY, maxY))
    setPos({ x: newX, y: newY })
  }

  const handleMouseUp = () => {
    if (!movable) return setDragging(false)
    // Snap to nearest edge
    const btnW = 60, btnH = 60
    const maxX = window.innerWidth - btnW - 10
    const maxY = window.innerHeight - btnH - 10
    let snapX = pos.x
    let snapY = pos.y
    // Snap horizontal
    if (pos.x < window.innerWidth / 2) snapX = 10
    else snapX = maxX
    // Snap vertical si très haut ou très bas
    if (pos.y < 40) snapY = 10
    else if (pos.y > maxY - 40) snapY = maxY
    setPos({ x: snapX, y: snapY })
    setDragging(false)
  }

  // Attach/detach listeners
  useEffect(() => {
    if (!movable) return
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
    } else {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
    // eslint-disable-next-line
  }, [dragging, movable])

  return (
    <button
      className={movable ? `chatbot-floating-btn${dragging ? " dragging" : ""}` : "chatbot-button"}
      onClick={onClick}
      title="Parler à Lummy"
      style={movable ? { left: pos.x, top: pos.y } : undefined}
      onMouseDown={handleMouseDown}
    >
      <MessageCircle size={28} />
    </button>
  )
}
