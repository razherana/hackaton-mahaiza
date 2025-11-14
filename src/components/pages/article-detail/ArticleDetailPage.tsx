import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Calendar, User, Tag, Share2, Bookmark, ArrowUp, ArrowDown } from "lucide-react"
import { ChatBot, ChatBotButton, TextSelectionMenu } from "@/components/chatbot"
import "./ArticleDetailPage.css"

interface ArticleSection {
  title: string
  content: string
}

interface Article {
  id: string
  title: string
  date: string
  author: string
  category: string
  summary: string
  image: string
  images: string[]
  sections: ArticleSection[]
}

interface MinistereData {
  id: string
  name: string
  news: Article[]
}

export default function ArticleDetailPage() {
  const { ministereId, articleId } = useParams<{ ministereId: string; articleId: string }>()
  const navigate = useNavigate()
  const [article, setArticle] = useState<Article | null>(null)
  const [ministereName, setMinistereName] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [chatbotOpen, setChatbotOpen] = useState(false)
  const [chatbotInitialMessage, setChatbotInitialMessage] = useState<string | undefined>()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer la liste des ministères/institutions
        const response = await fetch("/src/data/ministeres.json")
        const ministeresList = await response.json()
        
        // Trouver l'entité correspondante
        const entity = ministeresList.find((m: { id: string }) => m.id === ministereId)
        
        if (entity) {
          setMinistereName(entity.name)
          
          // Charger le fichier de données correspondant
          const dataResponse = await fetch(`/src/data/${entity.newsFile}`)
          const data: MinistereData[] = await dataResponse.json()
          
          // Trouver l'article
          const foundArticle = data[0].news.find((n) => n.id === articleId)
          if (foundArticle) {
            setArticle(foundArticle)
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement de l'article:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [ministereId, articleId])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  if (loading) {
    return (
      <div className="article-detail-loading">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="article-detail-error">
        <h2>Article non trouvé</h2>
        <button onClick={() => navigate(-1)} className="back-button">
          Retour
        </button>
      </div>
    )
  }

  return (
    <div className="article-detail-root">
      {/* Hero Section */}
      <div className="article-hero">
        <div className="article-hero-overlay"></div>
        <img 
          src={article.image} 
          alt={article.title}
          className="article-hero-image"
        />
        <div className="article-hero-content">
          <div className="article-hero-header">
            <button 
              className="article-back-button"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="back-icon" />
              Retour
            </button>
            
            <div className="article-category-badge">{article.category}</div>
          </div>
          
          <h1 className="article-hero-title">{article.title}</h1>
          
          <div className="article-meta">
            <div className="meta-item">
              <Calendar className="meta-icon" />
              <span>{formatDate(article.date)}</span>
            </div>
            <div className="meta-item">
              <User className="meta-icon" />
              <span>{article.author}</span>
            </div>
            <div className="meta-item">
              <Tag className="meta-icon" />
              <span>{ministereName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="article-main">
        <div className="article-container">
          <div className="article-content">
            {/* Summary */}
            <div className="article-summary">
              <p>{article.summary}</p>
            </div>

            {/* Actions */}
            <div className="article-actions">
              <button className="action-button">
                <Share2 className="action-icon" />
                Partager
              </button>
              <button className="action-button">
                <Bookmark className="action-icon" />
                Sauvegarder
              </button>
            </div>

            {/* Sections */}
            {article.sections.map((section, index) => (
              <section key={index} className="article-section">
                <h2 className="section-title">{section.title}</h2>
                <div className="section-content">
                  {section.content.split('\n\n').map((paragraph, pIndex) => (
                    <p key={pIndex} className="section-paragraph">{paragraph}</p>
                  ))}
                </div>
                
                {/* Insert image after every 2 sections */}
                {index > 0 && index % 2 === 0 && article.images[Math.floor(index / 2)] && (
                  <div className="section-image-wrapper">
                    <img 
                      src={article.images[Math.floor(index / 2)]}
                      alt={`Illustration ${index}`}
                      className="section-image"
                    />
                  </div>
                )}
              </section>
            ))}

            {/* Footer */}
            <div className="article-footer">
              <div className="article-divider"></div>
              <p className="article-footer-text">
                Article publié par {ministereName}
              </p>
              <button 
                className="article-footer-button"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="footer-icon" />
                Retour aux actualités
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="article-sidebar">
            <div className="sidebar-card">
              <h3 className="sidebar-card-title">À propos</h3>
              <p className="sidebar-card-text">
                Cet article provient de {ministereName}. 
                Retrouvez toutes les actualités officielles sur notre plateforme.
              </p>
            </div>

            <div className="sidebar-card">
              <h3 className="sidebar-card-title">Informations</h3>
              <div className="sidebar-info-list">
                <div className="info-item">
                  <span className="info-label">Publié le</span>
                  <span className="info-value">{formatDate(article.date)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Auteur</span>
                  <span className="info-value">{article.author}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Catégorie</span>
                  <span className="info-value">{article.category}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Scroll Navigation Buttons */}
      <div className="scroll-nav-buttons">
        <button 
          className="scroll-nav-btn scroll-top"
          onClick={scrollToTop}
          title="Aller en haut"
        >
          <ArrowUp className="scroll-icon" />
        </button>
        <button 
          className="scroll-nav-btn scroll-bottom"
          onClick={scrollToBottom}
          title="Aller en bas"
        >
          <ArrowDown className="scroll-icon" />
        </button>
      </div>

      {/* Chatbot */}
      <ChatBotButton onClick={() => setChatbotOpen(true)} />
      <ChatBot 
        isOpen={chatbotOpen} 
        onClose={() => setChatbotOpen(false)}
        initialMessage={chatbotInitialMessage}
      />
      <TextSelectionMenu onAskLummy={(text) => {
        setChatbotInitialMessage(`Que penses-tu de ce texte : "${text}" ?`)
        setChatbotOpen(true)
      }} />
    </div>
  )
}
