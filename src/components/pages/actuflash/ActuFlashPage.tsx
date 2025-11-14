import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Newspaper, TrendingUp, Clock } from "lucide-react"
import ChatBot from "@/components/chatbot/ChatBot"
import "./ActuFlashPage.css"

interface Ministere {
  id: string
  name: string
  type: string
  link: string
  newsFile: string
  image: string
}

export default function ActuFlashPage() {
  const [ministeres, setMinisteres] = useState<Ministere[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    fetch("/src/data/ministeres.json")
      .then((res) => res.json())
      .then((data) => setMinisteres(data))

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

  return (
    <div className="actuflash-root">
      {/* Header Section */}
      <header className="actuflash-header">
        <div className="actuflash-header-container">
          <div className="actuflash-header-top">
            <div className="actuflash-branding">
              <Newspaper className="actuflash-icon" />
              <h1 className="actuflash-logo">ActuFlash IA</h1>
            </div>
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
      <footer className="actuflash-footer">
        <div className="actuflash-footer-content">
          <p className="actuflash-footer-text">© 2025 ActuFlash IA - Plateforme Mahaiza</p>
          <p className="actuflash-footer-subtext">Informations officielles des institutions malgaches</p>
        </div>
      </footer>

      {/* Chatbot */}
      <ChatBot />
    </div>
  )
}
