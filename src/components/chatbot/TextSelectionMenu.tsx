import { useEffect, useState } from "react"
import { MessageCircle } from "lucide-react"
import "./TextSelectionMenu.css"

interface TextSelectionMenuProps {
  onAskLummy: (selectedText: string) => void
}

export default function TextSelectionMenu({ onAskLummy }: TextSelectionMenuProps) {
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null)
  const [selectedText, setSelectedText] = useState("")

  useEffect(() => {
    const handleSelection = (e: MouseEvent) => {
      // Attendre un court instant pour s'assurer que la sélection est terminée
      setTimeout(() => {
        const selection = window.getSelection()
        const text = selection?.toString().trim()

        if (text && text.length > 0 && e.button === 2) { // Clic droit
          const range = selection?.getRangeAt(0)
          const rect = range?.getBoundingClientRect()

          if (rect) {
            setMenuPosition({
              x: e.clientX,
              y: e.clientY
            })
            setSelectedText(text)
          }
        }
      }, 10)
    }

    const handleContextMenu = (e: MouseEvent) => {
      const selection = window.getSelection()
      const text = selection?.toString().trim()
      
      if (text && text.length > 0) {
        e.preventDefault() // Empêcher le menu contextuel par défaut si du texte est sélectionné
      }
    }

    const handleClickOutside = () => {
      setMenuPosition(null)
    }

    document.addEventListener("mousedown", handleSelection)
    document.addEventListener("contextmenu", handleContextMenu)
    document.addEventListener("click", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleSelection)
      document.removeEventListener("contextmenu", handleContextMenu)
      document.removeEventListener("click", handleClickOutside)
    }
  }, [])

  const handleAskLummy = () => {
    onAskLummy(selectedText)
    setMenuPosition(null)
    // Désélectionner le texte
    const selection = window.getSelection()
    if (selection) {
      selection.removeAllRanges()
    }
  }

  if (!menuPosition) return null

  return (
    <div
      className="text-selection-menu"
      style={{
        position: "fixed",
        left: `${menuPosition.x}px`,
        top: `${menuPosition.y}px`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <button className="selection-menu-btn" onClick={handleAskLummy}>
        <MessageCircle size={16} />
        <span>Demander à Lummy</span>
      </button>
    </div>
  )
}
