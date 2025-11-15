import { useState, useEffect, useRef } from "react"
import { Send, Trash2, Menu, X, Plus } from "lucide-react"
// import Logo from "../common/Logo"
import "./ChatBot.css"
import chatbotData from "@/data/chatbot-qa.json"

interface Message {
  id: number
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

interface ChatBotProps {
  isOpen: boolean
  onClose: () => void
  initialMessage?: string
}

export default function ChatBot({ isOpen, onClose, initialMessage }: ChatBotProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [inputMessage, setInputMessage] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const chatbotRef = useRef<HTMLDivElement>(null)

  const createNewConversation = () => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: "Nouvelle conversation",
      messages: [
        {
          id: 1,
          text: "Bonjour ! Je suis Lummy, votre assistant IA pour ActuFlash Madagascar 🐒 Comment puis-je vous aider aujourd'hui ?",
          sender: "bot",
          timestamp: new Date()
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    }
    setConversations(prev => [newConv, ...prev])
    setCurrentConversationId(newConv.id)
  }

  // Charger les conversations depuis localStorage au montage
  useEffect(() => {
    const savedConversations = localStorage.getItem("lummy-conversations")
    if (savedConversations) {
      try {
        const parsed = JSON.parse(savedConversations)
        const loadedConversations = parsed.map((conv: Conversation) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          updatedAt: new Date(conv.updatedAt),
          messages: conv.messages.map((msg: Message) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }))
        setConversations(loadedConversations)
        if (loadedConversations.length > 0) {
          setCurrentConversationId(loadedConversations[0].id)
        }
      } catch (e) {
        createNewConversation()
      }
    } else {
      createNewConversation()
    }
  }, [])

  // Sauvegarder les conversations dans localStorage
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem("lummy-conversations", JSON.stringify(conversations))
    }
  }, [conversations])

  const currentConversation = conversations.find(c => c.id === currentConversationId)

  // Scroll automatique vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [currentConversation?.messages])

  // Traiter le message initial si fourni (une seule fois)
  useEffect(() => {
    if (initialMessage && isOpen && currentConversationId && inputMessage === "") {
      setInputMessage(initialMessage)
      // Auto-focus sur le textarea
      setTimeout(() => {
        textareaRef.current?.focus()
        // Positionner le curseur à la fin
        const length = initialMessage.length
        textareaRef.current?.setSelectionRange(length, length)
      }, 100)
    }
  }, [initialMessage, isOpen, currentConversationId])

  const findBestAnswer = (question: string): string => {
    const lowerQuestion = question.toLowerCase()
    
    // Rechercher dans la base de questions/réponses
    const qaData = chatbotData as Array<{
      id: number
      question: string
      answer: string
      keywords: string[]
    }>

    let bestMatch: { answer: string } | null = null
    let bestScore = 0

    for (const qa of qaData) {
      let score = 0
      
      // Comparer avec les mots-clés
      for (const keyword of qa.keywords) {
        if (lowerQuestion.includes(keyword.toLowerCase())) {
          score += 2
        }
      }
      
      // Comparer avec la question
      const questionWords = qa.question.toLowerCase().split(" ")
      for (const word of questionWords) {
        if (word.length > 3 && lowerQuestion.includes(word)) {
          score += 1
        }
      }
      
      if (score > bestScore) {
        bestScore = score
        bestMatch = qa
      }
    }

    if (bestMatch && bestScore > 2) {
      return bestMatch.answer
    }

    // Réponse par défaut
    return "Je ne suis pas sûr de bien comprendre votre question. Pouvez-vous reformuler ou être plus précis ? Vous pouvez me demander des informations sur les ministères, les actualités récentes, ou comment utiliser ActuFlash IA ! 😊"
  }

  const handleSendMessage = (messageText?: string) => {
    const text = messageText || inputMessage.trim()
    if (!text || !currentConversationId) return

    // Ajouter le message de l'utilisateur
    const userMessage: Message = {
      id: Date.now(),
      text,
      sender: "user",
      timestamp: new Date()
    }

    setConversations(prev => prev.map(conv => {
      if (conv.id === currentConversationId) {
        const updatedMessages = [...conv.messages, userMessage]
        // Mettre à jour le titre de la conversation si c'est le premier message utilisateur
        const title = conv.messages.filter(m => m.sender === "user").length === 0
          ? text.substring(0, 40) + (text.length > 40 ? "..." : "")
          : conv.title

        return {
          ...conv,
          messages: updatedMessages,
          title,
          updatedAt: new Date()
        }
      }
      return conv
    }))

    setInputMessage("")

    // Simuler un délai de "réflexion"
    setTimeout(() => {
      const answer = findBestAnswer(text)
      const botMessage: Message = {
        id: Date.now() + 1,
        text: answer,
        sender: "bot",
        timestamp: new Date()
      }

      setConversations(prev => prev.map(conv => {
        if (conv.id === currentConversationId) {
          return {
            ...conv,
            messages: [...conv.messages, botMessage],
            updatedAt: new Date()
          }
        }
        return conv
      }))
    }, 800)
  }

  const deleteConversation = (convId: string) => {
    setConversations(prev => prev.filter(c => c.id !== convId))
    if (currentConversationId === convId) {
      const remaining = conversations.filter(c => c.id !== convId)
      if (remaining.length > 0) {
        setCurrentConversationId(remaining[0].id)
      } else {
        createNewConversation()
      }
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "À l'instant"
    if (minutes < 60) return `Il y a ${minutes} min`
    if (hours < 24) return `Il y a ${hours}h`
    if (days < 7) return `Il y a ${days}j`
    return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })
  }

  // Initialiser la position au premier rendu
  useEffect(() => {
    if (position === null && chatbotRef.current) {
      const initialX = window.innerWidth - chatbotRef.current.offsetWidth - 20
      const initialY = window.innerHeight - chatbotRef.current.offsetHeight - 100
      setPosition({ x: Math.max(0, initialX), y: Math.max(0, initialY) })
    }
  }, [isOpen, position])

  // Gestion du drag & drop
  const handleMouseDown = (e: React.MouseEvent) => {
    // Ne pas déclencher le drag sur les zones interactives
    const target = e.target as HTMLElement
    if (
      target.closest('.chatbot-input, .chatbot-messages, .conversations-list, .chatbot-send-btn, .chatbot-close, .chatbot-sidebar-toggle, button')
    ) {
      return
    }

    if (position) {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      })
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && position) {
        const newX = e.clientX - dragStart.x
        const newY = e.clientY - dragStart.y

        // Limites de l'écran
        const maxX = window.innerWidth - (chatbotRef.current?.offsetWidth || 900)
        const maxY = window.innerHeight - (chatbotRef.current?.offsetHeight || 600)

        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY))
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragStart, position])

  if (!isOpen) return null

  return (
    <div
      ref={chatbotRef}
      className={`chatbot-container ${isDragging ? "dragging" : ""}`}
      style={position ? {
        left: `${position.x}px`,
        top: `${position.y}px`
      } : undefined}
      onMouseDown={handleMouseDown}
    >
      {/* Sidebar pour l'historique */}
      <aside className={`chatbot-sidebar ${!sidebarOpen ? "collapsed" : ""}`}>
          <div className="sidebar-header">
            <h3 className="sidebar-title">Conversations</h3>
            <button 
              className="sidebar-new-btn"
              onClick={createNewConversation}
              title="Nouvelle conversation"
            >
              <Plus size={20} />
            </button>
          </div>

          <div className="conversations-list">
            {conversations.map(conv => (
              <div
                key={conv.id}
                className={`conversation-item ${conv.id === currentConversationId ? "active" : ""}`}
                onClick={() => setCurrentConversationId(conv.id)}
              >
                <div className="conversation-info">
                  <h4 className="conversation-title">{conv.title}</h4>
                  <p className="conversation-time">{formatTime(conv.updatedAt)}</p>
                </div>
                <button
                  className="conversation-delete"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteConversation(conv.id)
                  }}
                  title="Supprimer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </aside>

        {/* Zone de chat principale */}
        <div className="chatbot-main">
          {/* Header */}
          <div className="chatbot-header">
            <button
              className="chatbot-sidebar-toggle"
              onClick={(e) => {
                e.stopPropagation()
                setSidebarOpen(!sidebarOpen)
              }}
            >
              <Menu size={20} />
            </button>

            <div className="chatbot-header-info chatbot-header-center">
              <img src="/images/lemur.png" alt="Lummy" className="chatbot-lummy-avatar" />
              <div>
                <h2 className="chatbot-title">Lummy</h2>
                <p className="chatbot-subtitle">Assistant IA ActuFlash</p>
              </div>
            </div>

            <button
              className="chatbot-close"
              onClick={(e) => {
                e.stopPropagation()
                onClose()
              }}
              title="Fermer"
            >
              <X size={20} />
            </button>
          </div>



          {/* Messages */}
          <div className="chatbot-messages">
            {currentConversation?.messages.map(message => (
              <div
                key={message.id}
                className={`message ${message.sender === "user" ? "message-user" : "message-bot"}`}
              >
                <div className="message-content">
                  <p className="message-text">{message.text}</p>
                  <span className="message-time">
                    {message.timestamp.toLocaleTimeString("fr-FR", { 
                      hour: "2-digit", 
                      minute: "2-digit" 
                    })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chatbot-input-area">
            <textarea
              ref={textareaRef}
              className="chatbot-input"
              placeholder="Posez une question à Lummy..."
              value={inputMessage}
              onChange={(e) => {
                setInputMessage(e.target.value)
                // Auto-resize
                e.target.style.height = 'auto'
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              rows={1}
            />
            <button
              className="chatbot-send-btn"
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim()}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
    </div>
  )
}
