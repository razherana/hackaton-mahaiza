import { BookOpen, Eye, EyeOff, LogOut, BookMarked } from "lucide-react"
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
  const { isPreviewOpen, setIsPreviewOpen, sessionData } = useAnalysis()
  const [isQuitDialogOpen, setIsQuitDialogOpen] = useState(false)
  const navigate = useNavigate()

  const handleQuitConfirm = () => {
    setIsQuitDialogOpen(false)
    navigate("/education/import")
  }

  return (
    <>
      <aside className="w-64 border-r border-[#3a8a2a] bg-[#1b1b1b] py-6 px-4 flex flex-col gap-4 h-full">
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white px-2">
            Apprendre
          </h3>

          <Button
            onClick={() => navigate(sessionData?.document?.id ? `/education/quiz?documentId=${sessionData.document.id}` : "/education/quiz")}
            variant="outline"
            className="w-full justify-start gap-2 border-[#3a8a2a] text-white hover:bg-[#3a8a2a]"
          >
            <BookOpen className="h-4 w-4" />
            Try Quiz
          </Button>

          <Button
            onClick={() => navigate(sessionData?.document?.id ? `/education/review-points?documentId=${sessionData.document.id}` : "/education/review-points")}
            variant="outline"
            className="w-full justify-start gap-2 border-[#3a8a2a] text-white hover:bg-[#3a8a2a]"
          >
            <BookMarked className="h-4 w-4" />
            Points à réviser
          </Button>
        </div>

        <div className="space-y-2 mt-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white px-2">
            Options
          </h3>

          <Button
            onClick={() => setIsPreviewOpen(!isPreviewOpen)}
            variant="outline"
            className="w-full justify-start gap-2 border-[#3a8a2a] text-white hover:bg-[#3a8a2a]"
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

        <div className="mt-auto space-y-2 pt-4 border-t border-[#3a8a2a]">
          <Button
            onClick={() => setIsQuitDialogOpen(true)}
            variant="outline"
            className="w-full justify-start gap-2 border-[#3a8a2a] text-[#3a8a2a] hover:bg-[#3a8a2a] hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Quitter la session
          </Button>
        </div>
      </aside>

      <Dialog open={isQuitDialogOpen} onOpenChange={setIsQuitDialogOpen}>
        <DialogContent className="bg-[#1b1b1b] border-[#3a8a2a] text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Quitter la session</DialogTitle>
            <DialogDescription className="text-white">
              Êtes-vous sûr de vouloir quitter ? Vos données de session seront perdues.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end mt-4">
            <Button
              onClick={() => setIsQuitDialogOpen(false)}
              variant="outline"
              className="border-[#3a8a2a] text-white hover:bg-[#3a8a2a]"
            >
              Annuler
            </Button>
            <Button
              onClick={handleQuitConfirm}
              className="bg-[#3a8a2a] text-white hover:bg-[#3a8a2a]"
            >
              Quitter
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
