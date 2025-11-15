import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Calendar, User, Tag, Share2, Bookmark, ArrowUp, ArrowDown } from "lucide-react"
import { ChatBot, ChatBotButton, TextSelectionMenu } from "@/components/chatbot"
import Logo from "@/components/common/Logo"
import Footer from "@/components/common/Footer"
import ministeresData from "@/data/ministeres.json"
import assemblee from "@/data/assemblee.json"
import senat from "@/data/senat.json"
import presidence from "@/data/presidence.json"
import ministereEducation from "@/data/ministere-education.json"
import ministereFinances from "@/data/ministere-finances.json"
import ministereInterieur from "@/data/ministere-interieur.json"
import ministereJustice from "@/data/ministere-justice.json"
import ministereSante from "@/data/ministere-sante.json"
import ministereTransport from "@/data/ministere-transport.json"
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

export default function ArticleDetailPage() {
  const { ministereId, articleId } = useParams<{ ministereId: string; articleId: string }>()
  const navigate = useNavigate()
  const [article, setArticle] = useState<Article | null>(null)
  const [ministereName, setMinistereName] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [chatbotOpen, setChatbotOpen] = useState(false)
  const [chatbotInitialMessage, setChatbotInitialMessage] = useState<string | undefined>()
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })
  }

  useEffect(() => {
    const dataMap: Record<string, any> = {
      "assemblee.json": assemblee,
      "senat.json": senat,
      "presidence.json": presidence,
      "ministere-education.json": ministereEducation,
      "ministere-finances.json": ministereFinances,
      "ministere-interieur.json": ministereInterieur,
      "ministere-justice.json": ministereJustice,
      "ministere-sante.json": ministereSante,
      "ministere-transport.json": ministereTransport,
    }

    try {
      const ministeresList = ministeresData

      // Trouver l'entité correspondante
      const entity = ministeresList.find((m: { id: string }) => m.id === ministereId)

      if (entity && dataMap[entity.newsFile]) {
        setMinistereName(entity.name)

        // Charger les données
        const data = dataMap[entity.newsFile]
        const dataArray = Array.isArray(data) ? data : [data]

        // Trouver l'article
        const foundArticle = dataArray[0].news.find((n: Article) => n.id === articleId)
        if (foundArticle) {
          setArticle(foundArticle)

          // Générer des articles similaires (plus robuste)
          const allArticles: Article[] = []
          Object.values(dataMap).forEach((ministryData) => {
            const ministryArray = Array.isArray(ministryData) ? ministryData : [ministryData]
            ministryArray.forEach((ministry: any) => {
              if (ministry.news) {
                allArticles.push(...ministry.news)
              }
            })
          })

          // Suggestions : priorité à la même catégorie, sinon par mots du titre, sinon n'importe quel autre article
          let similarArticles = allArticles.filter(a => a.id !== foundArticle.id)
          if (foundArticle.category) {
            const cat = foundArticle.category
            const byCat = similarArticles.filter(a => a.category === cat)
            if (byCat.length >= 3) similarArticles = byCat
            else if (byCat.length > 0) similarArticles = [...byCat, ...similarArticles.filter(a => a.category !== cat)]
          }
          // Si pas assez, compléter par mots du titre
          if (similarArticles.length < 3 && foundArticle.title) {
            const word = foundArticle.title.split(' ')[0].toLowerCase()
            const byWord = allArticles.filter(a => a.id !== foundArticle.id && a.title && a.title.toLowerCase().includes(word))
            similarArticles = [...similarArticles, ...byWord]
          }
          // Toujours au moins 3 si possible
          setRelatedArticles(similarArticles.slice(0, 3))
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement de l'article:", error)
    } finally {
      setLoading(false)
    }
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
      {/* Header avec Logo */}
      <header className="article-header">
        <div className="article-header-container">
          <Logo size="small" />
          <nav className="article-nav">
            <button onClick={() => navigate("/")} className="nav-link">Accueil</button>
            <button onClick={() => navigate("/actuflash")} className="nav-link">ActuFlash</button>
          </nav>
        </div>
      </header>

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
            {(article.sections || []).map((section, index) => (
              <section key={index} className="article-section">
                <h2 className="section-title">{section.title}</h2>
                <div className="section-content">
                  {section.content.split('\n\n').map((paragraph, pIndex) => (
                    <p key={pIndex} className="section-paragraph">{paragraph}</p>
                  ))}
                </div>

                {/* Insert image after every 2 sections */}
                {index > 0 && index % 2 === 0 && (article.images || [])[Math.floor(index / 2)] && (
                  <div className="section-image-wrapper">
                    <img
                      src={(article.images || [])[Math.floor(index / 2)]}
                      alt={`Illustration ${index}`}
                      className="section-image"
                    />
                  </div>
                )}
              </section>
            ))}

            {/* Footer de l'article */}
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

      {/* Articles similaires */}
      {relatedArticles.length > 0 && (
        <section className="related-articles">
          <div className="related-container">
            <h2 className="related-title">Articles similaires</h2>
            <div className="related-grid">
              {relatedArticles.map((relatedArticle) => {
                // Trouver le ministère de l'article lié (fallback sur le premier ministere si non trouvé)
                let relatedMinistry = ministeresData.find(m => m.newsFile && relatedArticle.id.startsWith(m.id))
                if (!relatedMinistry) {
                  relatedMinistry = ministeresData.find(m => m.newsFile)
                }
                return (
                  <article
                    key={relatedArticle.id}
                    className="related-card"
                    onClick={() => {
                      if (relatedMinistry) {
                        navigate(`/article/${relatedMinistry.id}/${relatedArticle.id}`)
                      }
                    }}
                  >
                    <div className="related-image-wrapper">
                      <img
                        src={relatedArticle.image}
                        alt={relatedArticle.title}
                        className="related-image"
                      />
                      <div className="related-badge">{relatedArticle.category || "Autre"}</div>
                    </div>
                    <div className="related-content">
                      <h3 className="related-article-title">{relatedArticle.title}</h3>
                      <p className="related-summary">{(relatedArticle.summary || "").substring(0, 100)}...</p>
                      <div className="related-meta">
                        <Calendar className="meta-icon" />
                        <span>{formatDate(relatedArticle.date)}</span>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      )}

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

      {/* Footer */}
      <Footer />

      {/* Chatbot */}
      <ChatBotButton movable onClick={() => setChatbotOpen(true)} />
      <ChatBot
        isOpen={chatbotOpen}
        onClose={() => setChatbotOpen(false)}
        initialMessage={chatbotInitialMessage}
      />
      <TextSelectionMenu onAskLummy={(text) => {
        setChatbotInitialMessage(`Que penses-tu de ce texte : "${text}" ?`)
        setChatbotOpen(true)
        setTimeout(() => setChatbotInitialMessage(undefined), 500)
      }} />
    </div>
  )
}