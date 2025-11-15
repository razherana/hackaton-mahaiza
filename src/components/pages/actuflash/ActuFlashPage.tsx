import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { TrendingUp, Clock } from "lucide-react"
import { ChatBot, ChatBotButton, TextSelectionMenu } from "@/components/chatbot"
import Logo from "@/components/common/Logo"
import Footer from "@/components/common/Footer"
import ministeresData from "@/data/ministeres.json"
import "./ActuFlashPage.css"

export default function ActuFlashPage() {
  const ministeres = ministeresData
  const [currentTime, setCurrentTime] = useState(new Date())
  const [chatbotOpen, setChatbotOpen] = useState(false)
  const [chatbotInitialMessage, setChatbotInitialMessage] = useState<string | undefined>()

  useEffect(() => {

    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = () => {
    return currentTime.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const formatDate = () => {
    return currentTime.toLocaleDateString('fr-FR', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleAskLummy = (selectedText: string) => {
    setChatbotInitialMessage(`Que penses-tu de ce texte : "${selectedText}" ?`)
    setChatbotOpen(true)
    // Nettoyer le message initial après un court délai pour permettre au chatbot de le lire
    setTimeout(() => setChatbotInitialMessage(undefined), 500)
  }

  return (
    <div className="actuflash-root">
      {/* Header Section */}
      <header className="actuflash-header">
        <div className="actuflash-header-container">
          <div className="actuflash-header-top">
            <Logo size="large" />
            <div className="actuflash-datetime">
              <Clock className="actuflash-clock-icon" />
              <div className="actuflash-time-wrapper">
                <span className="actuflash-time">{formatTime()}</span>
                <span className="actuflash-date">{formatDate()}</span>
              </div>
            </div>
          </div>
          <p className="actuflash-tagline">
            L'actualité des institutions malgaches en temps réel
          </p>
        </div>
      </header>

      {/* Hero Section */}
      <section className="actuflash-hero">
        <div className="actuflash-hero-container">
          <h2 className="actuflash-hero-title">Bienvenue sur ActuFlash IA</h2>
          <p className="actuflash-hero-subtitle">
            Votre source d'information officielle sur les institutions malgaches
          </p>
          <div className="actuflash-hero-stats">
            <div className="hero-stat">
              <span className="stat-number">9</span>
              <span className="stat-label">Institutions couvertes</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">18+</span>
              <span className="stat-label">Articles disponibles</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Mise à jour en continu</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="actuflash-main">
        <div className="actuflash-container">
          <section className="actuflash-section">
            <div className="actuflash-section-header">
              <h2 className="actuflash-section-title">
                <TrendingUp className="actuflash-section-icon" />
                Ministères & Institutions
              </h2>
              <div className="actuflash-section-line"></div>
            </div>

            <div className="actuflash-grid">
              {ministeres.map((min, index) => (
                <Link 
                  to={min.link} 
                  key={min.id} 
                  className="actuflash-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="actuflash-card-image-wrapper">
                    <img 
                      src={min.image} 
                      alt={min.name}
                      className="actuflash-card-image"
                      loading="lazy"
                    />
                    <div className="actuflash-card-overlay"></div>
                  </div>
                  <div className="actuflash-card-body">
                    <span className="actuflash-card-badge">
                      {min.type === "ministere" ? "Ministère" : "Institution"}
                    </span>
                    <h3 className="actuflash-card-title">{min.name}</h3>
                    <div className="actuflash-card-footer">
                      <span className="actuflash-card-link-text">Voir les actualités →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Chatbot */}
      <ChatBotButton onClick={() => setChatbotOpen(true)} />
      <ChatBot 
        isOpen={chatbotOpen} 
        onClose={() => setChatbotOpen(false)}
        initialMessage={chatbotInitialMessage}
      />
      <TextSelectionMenu onAskLummy={handleAskLummy} />
    </div>
  )
}
