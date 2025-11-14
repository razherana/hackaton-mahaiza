import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ArrowLeft, Calendar, X, Menu, Newspaper, Home, Search, Filter } from "lucide-react"
import ChatBot from "@/components/chatbot/ChatBot"
import "./MinistereDetailPage.css"

interface News {
  id: string
  title: string
  date: string
  author?: string
  category?: string
  summary: string
  content?: string
  image: string
  images?: string[]
  sections?: Array<{
    title: string
    content: string
  }>
}

interface MinistereData {
  id: string
  name: string
  news: News[]
}

interface MinistereEntity {
  id: string
  name: string
  type: string
  link: string
  newsFile: string
  image: string
}

export default function MinistereDetailPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [ministereData, setMinistereData] = useState<MinistereData | null>(null)
  const [allMinisteres, setAllMinisteres] = useState<MinistereEntity[]>([])
  const [selectedNews, setSelectedNews] = useState<News | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOrder, setSortOrder] = useState<"recent" | "oldest">("recent")

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer la liste des ministères/institutions
        const response = await fetch("/src/data/ministeres.json")
        const ministeresList: MinistereEntity[] = await response.json()
        setAllMinisteres(ministeresList)
        
        // Trouver l'entité correspondante par le link
        const entity = ministeresList.find((m) => m.link === location.pathname)
        
        if (entity) {
          // Charger le fichier de données correspondant
          const dataResponse = await fetch(`/src/data/${entity.newsFile}`)
          const data = await dataResponse.json()
          setMinistereData(data[0])
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [location.pathname])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const openModal = (news: News) => {
    setSelectedNews(news)
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    setSelectedNews(null)
    document.body.style.overflow = 'auto'
  }

  const filteredAndSortedNews = () => {
    if (!ministereData) return []
    
    const filtered = ministereData.news.filter(news => 
      news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      news.summary.toLowerCase().includes(searchQuery.toLowerCase())
    )
    
    return filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return sortOrder === "recent" ? dateB - dateA : dateA - dateB
    })
  }

  if (loading) {
    return (
      <div className="ministere-detail-loading">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (!ministereData) {
    return (
      <div className="ministere-detail-error">
        <h2>Données non trouvées</h2>
        <button onClick={() => navigate("/actuflash")} className="back-button">
          Retour à l'accueil
        </button>
      </div>
    )
  }

  return (
    <div className="ministere-detail-root">
      {/* Sidebar */}
      <aside className={`ministere-sidebar ${!sidebarOpen ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <Newspaper className="sidebar-icon" />
          <h2 className="sidebar-title">Navigation</h2>
        </div>
        
        <button 
          className="sidebar-nav-button" 
          onClick={() => navigate("/")}
        >
          <Home className="nav-icon" />
          Accueil
        </button>
        
        <button 
          className="sidebar-nav-button" 
          onClick={() => navigate("/actuflash")}
        >
          <ArrowLeft className="nav-icon" />
          Retour ActuFlash
        </button>

        <div className="sidebar-divider"></div>
        
        <div className="sidebar-section">
          <h3 className="sidebar-section-title">Ministères</h3>
          {allMinisteres.filter(m => m.type === "ministere").map((min) => (
            <button
              key={min.id}
              className={`sidebar-item ${location.pathname === min.link ? 'active' : ''}`}
              onClick={() => navigate(min.link)}
            >
              {min.name}
            </button>
          ))}
        </div>

        <div className="sidebar-divider"></div>

        <div className="sidebar-section">
          <h3 className="sidebar-section-title">Institutions</h3>
          {allMinisteres.filter(m => m.type === "institution").map((inst) => (
            <button
              key={inst.id}
              className={`sidebar-item ${location.pathname === inst.link ? 'active' : ''}`}
              onClick={() => navigate(inst.link)}
            >
              {inst.name}
            </button>
          ))}
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="ministere-detail-content">
        {/* Header */}
        <header className="ministere-detail-header">
          <div className="ministere-detail-header-container">
            <button 
              className="sidebar-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="menu-icon" />
            </button>
            <div className="header-content">
              <h1 className="ministere-detail-title">{ministereData.name}</h1>
              <p className="ministere-detail-subtitle">
                {ministereData.news.length} actualité{ministereData.news.length > 1 ? 's' : ''} • Dernière mise à jour aujourd'hui
              </p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="ministere-detail-main">
          <div className="ministere-detail-container">
            {/* Search and Filter Bar */}
            <div className="search-filter-bar">
              <div className="search-box">
                <Search className="search-icon" />
                <input 
                  type="text"
                  placeholder="Rechercher une actualité..."
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="filter-box">
                <Filter className="filter-icon" />
                <select 
                  className="filter-select"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as "recent" | "oldest")}
                >
                  <option value="recent">Plus récentes</option>
                  <option value="oldest">Plus anciennes</option>
                </select>
              </div>
            </div>

            <div className="news-list">
              {filteredAndSortedNews().map((news, index) => (
                <article 
                  key={news.id} 
                  className="news-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="news-card-image-wrapper">
                    <img 
                      src={news.image} 
                      alt={news.title}
                      className="news-card-image"
                      loading="lazy"
                    />
                    <div className="news-card-badge">Actualité</div>
                  </div>
                  <div className="news-card-content">
                    <div className="news-card-meta">
                      <Calendar className="meta-icon" />
                      <span className="news-card-date">{formatDate(news.date)}</span>
                      <span className="news-card-dot">•</span>
                      <span className="news-card-read-time">3 min de lecture</span>
                    </div>
                    <h2 className="news-card-title">{news.title}</h2>
                    <p className="news-card-summary">{news.summary}</p>
                    <div className="news-card-actions">
                      <button 
                        className="news-action-btn primary"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/article/${ministereData.id}/${news.id}`)
                        }}
                      >
                        Lire l'article complet
                      </button>
                      <button 
                        className="news-action-btn secondary"
                        onClick={(e) => {
                          e.stopPropagation()
                          openModal(news)
                        }}
                      >
                        Aperçu rapide
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Modal - Aperçu Rapide */}
      {selectedNews && (
        <div className="news-modal-overlay" onClick={closeModal}>
          <div className="news-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-button" onClick={closeModal}>
              <X className="close-icon" />
            </button>
            
            <div className="modal-image-wrapper">
              <img 
                src={selectedNews.image} 
                alt={selectedNews.title}
                className="modal-image"
              />
            </div>
            
            <div className="modal-content">
              <div className="modal-header-meta">
                <div className="modal-date">
                  <Calendar className="date-icon" />
                  <span>{formatDate(selectedNews.date)}</span>
                </div>
                {selectedNews.category && (
                  <span className="modal-category">{selectedNews.category}</span>
                )}
              </div>
              <h2 className="modal-title">{selectedNews.title}</h2>
              <div className="modal-divider"></div>
              <p className="modal-summary">{selectedNews.summary}</p>
              {selectedNews.sections && selectedNews.sections.length > 0 && (
                <p className="modal-body">{selectedNews.sections[0].content.substring(0, 300)}...</p>
              )}
              <button 
                className="modal-read-more"
                onClick={() => {
                  closeModal()
                  navigate(`/article/${ministereData.id}/${selectedNews.id}`)
                }}
              >
                Lire l'article complet →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chatbot */}
      <ChatBot />
    </div>
  )
}
