import "./Footer.css"

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">ActuFlash IA</h3>
            <p className="footer-description">
              Plateforme dédiée à rendre les informations gouvernementales transparentes 
              et accessibles au grand public malgache. Nous croyons en une citoyenneté 
              informée et engagée.
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Mission</h4>
            <p className="footer-text">
              Centraliser et diffuser les actualités officielles des institutions 
              malgaches pour favoriser la transparence et l'accès à l'information pour tous.
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">À propos</h4>
            <p className="footer-text">
              Projet développé par <strong>ITHolics</strong> dans le cadre de l'initiative 
              Mahaiza pour l'éducation civique et l'information citoyenne à Madagascar.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} <strong>ITHolics</strong>. Tous droits réservés.
          </p>
          <p className="footer-tagline">
            Pour une Madagascar informée et transparente 🇲🇬
          </p>
        </div>
      </div>
    </footer>
  )
}
