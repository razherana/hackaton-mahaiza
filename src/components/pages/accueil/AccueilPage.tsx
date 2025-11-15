import Logo from "@/components/common/Logo"
import Footer from "@/components/common/Footer"
import { Link } from "react-router-dom"
import "./AccueilPage.css"

export function AccueilPage() {
  return (
    <div className="accueil-root">
      <header className="accueil-header">
        <Logo />
      </header>

      <main className="accueil-main">
        <section className="accueil-hero">
          <h1 className="accueil-title">Bienvenue sur ActuFlash IA</h1>
          <p className="accueil-subtitle">
            Votre source d'information officielle sur les institutions malgaches
          </p>
          <Link to="/actuflash" className="accueil-cta">
            Accéder à ActuFlash
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  )
}
