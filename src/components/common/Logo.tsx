import { useNavigate } from "react-router-dom"
import "./Logo.css"

export default function Logo({ size }: { size?: "large" | "small" }) {
  const navigate = useNavigate()
  return (
    <div className={`app-logo${size === "large" ? " app-logo-large" : ""}`} onClick={() => navigate("/actuflash")}> 
      <img src="/images/actuflash-logo.png" alt="ActuFlash IA Logo" className="logo-img" onError={e => { e.currentTarget.style.display = 'none'; }} />
      <span className="logo-text">ActuFlash IA</span>
    </div>
  )
}
