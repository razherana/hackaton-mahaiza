import { BookOpen, Eye, EyeOff, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAnalysis } from "../context/useAnalysis"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export function AnalysisSidebar() {
  const { isPreviewOpen, setIsPreviewOpen } = useAnalysis()
  const [isQuitDialogOpen, setIsQuitDialogOpen] = useState(false)
  const navigate = useNavigate()

  const handleQuitConfirm = () => {
    setIsQuitDialogOpen(false)
    navigate("/education/import")
  }

  return (
    <>
      <aside className="w-64 border-r border-[#2a2a2a] bg-[#1a1a1a] py-6 px-4 flex flex-col gap-4 h-full">
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b0b0b0] px-2">
            Apprendre
          </h3>

          <Button
            variant="outline"
            className="w-full justify-start gap-2 border-[#2a2a2a] text-[#f5f5f5] hover:bg-[#2a2a2a]"
          >
            <BookOpen className="h-4 w-4" />
            Try Quiz
          </Button>
        </div>

        <div className="space-y-2 mt-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b0b0b0] px-2">
            Options
          </h3>

          <Button
            onClick={() => setIsPreviewOpen(!isPreviewOpen)}
            variant="outline"
            className="w-full justify-start gap-2 border-[#2a2a2a] text-[#f5f5f5] hover:bg-[#2a2a2a]"
          >
            {isPreviewOpen ? (
              <>
                <Eye className="h-4 w-4" />
                Masquer l'aperçu
              </>
            ) : (
              <>
                <EyeOff className="h-4 w-4" />
                Afficher l'aperçu
              </>
            )}
          </Button>
        </div>

        <div className="mt-auto space-y-2 pt-4 border-t border-[#2a2a2a]">
          <Button
            onClick={() => setIsQuitDialogOpen(true)}
            variant="outline"
            className="w-full justify-start gap-2 border-[#2a2a2a] text-red-400 hover:bg-red-400/10 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            Quitter la session
          </Button>
        </div>
      </aside>

      <Dialog open={isQuitDialogOpen} onOpenChange={setIsQuitDialogOpen}>
        <DialogContent className="bg-[#1a1a1a] border-[#2a2a2a] text-[#f5f5f5]">
          <DialogHeader>
            <DialogTitle className="text-[#f5f5f5]">Quitter la session</DialogTitle>
            <DialogDescription className="text-[#b0b0b0]">
              Êtes-vous sûr de vouloir quitter ? Vos données de session seront perdues.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end mt-4">
            <Button
              onClick={() => setIsQuitDialogOpen(false)}
              variant="outline"
              className="border-[#2a2a2a] text-[#f5f5f5] hover:bg-[#2a2a2a]"
            >
              Annuler
            </Button>
            <Button
              onClick={handleQuitConfirm}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Quitter
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
