import { MessageCircle } from "lucide-react"
import "./ChatBotButton.css"

interface ChatBotButtonProps {
  onClick: () => void
}

export default function ChatBotButton({ onClick }: ChatBotButtonProps) {
  return (
    <button className="chatbot-floating-btn" onClick={onClick} title="Discuter avec Lummy">
      <MessageCircle size={28} />
      <span className="chatbot-badge">IA</span>
    </button>
  )
}
