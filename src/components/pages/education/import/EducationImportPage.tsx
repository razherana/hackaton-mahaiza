import { useState } from "react"
import { Upload, BookOpen, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EducationHubModal } from "./components/EducationHubModal"
import type { EducationDocument } from "./types"

export function EducationImportPage() {
  const [isHubModalOpen, setIsHubModalOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleSelectedDocument = (document: EducationDocument) => {
    console.log("Selected document:", document)
    setIsHubModalOpen(false)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setSelectedFile(file)
    }
  }

  const handleUpload = async () => {
    if (selectedFile) {
      console.log("Uploading file:", selectedFile.name)
      // TODO: Implement actual upload logic
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] px-4 py-8 text-[#f5f5f5]">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="space-y-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#4ba835]">
            TurboCours IA
          </p>
          <h1 className="text-3xl font-semibold text-[#f5f5f5]">Importez votre document pour commencer</h1>
          <p className="text-base text-[#b0b0b0]">
            Uploadez un PDF pour générer automatiquement des résumés, quiz et fiches personnalisées.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Upload New Document */}
          <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
            <CardHeader className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[#3a8a2a]/25 p-3 text-[#4ba835]">
                  <Upload className="h-6 w-6" />
                </div>
              </div>
              <CardTitle className="text-[#f5f5f5]">Nouveau document</CardTitle>
              <CardDescription className="text-[#b0b0b0]">
                Uploadez un fichier PDF depuis votre ordinateur
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="bg-[#0f0f0f] border-[#2a2a2a] text-[#f5f5f5] file:bg-[#3a8a2a]/25 file:text-[#4ba835] file:border-0"
                />
                {selectedFile && (
                  <p className="text-sm text-[#4ba835]">
                    Fichier sélectionné: {selectedFile.name}
                  </p>
                )}
              </div>
              <Button 
                onClick={handleUpload}
                disabled={!selectedFile}
                className="w-full bg-[#3a8a2a] hover:bg-[#4ba835] text-white"
              >
                Analyser avec l'IA
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Choose from Hub */}
          <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
            <CardHeader className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[#3a8a2a]/25 p-3 text-[#4ba835]">
                  <BookOpen className="h-6 w-6" />
                </div>
              </div>
              <CardTitle className="text-[#f5f5f5]">Documents existants</CardTitle>
              <CardDescription className="text-[#b0b0b0]">
                Choisissez parmi les documents déjà disponibles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setIsHubModalOpen(true)}
                variant="outline"
                className="w-full border-[#4ba835]/50 text-[#4ba835] hover:bg-[#3a8a2a]/25"
              >
                Parcourir le hub
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <EducationHubModal 
          open={isHubModalOpen}
          onOpenChange={setIsHubModalOpen}
          onSelectedDocument={handleSelectedDocument} 
        />
      </div>
    </div>
  )
}