import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Upload, BookOpen, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EducationHubModal } from "./components/EducationHubModal"
import type { DocumentAnalysisResult, EducationDocument } from "./types"

export function EducationImportPage() {
  const navigate = useNavigate()
  const [isHubModalOpen, setIsHubModalOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [analysisResult, setAnalysisResult] = useState<DocumentAnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSelectedDocument = (document: EducationDocument) => {
    console.log("Selected document:", document)
    setIsHubModalOpen(false)

    // Navigate to analysis page with document ID
    const params = new URLSearchParams({
      documentId: document.id.toString()
    })
    navigate(`/education/analyse?${params.toString()}`)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setSelectedFile(file)
      setAnalysisResult(null)
      setErrorMessage(null)
    }
  }

  const handleUpload = async () => {
    if (selectedFile) {
      setIsAnalyzing(true)
      setErrorMessage(null)
      setAnalysisResult(null)

      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Import the simulation function from unified data
        const { simulateAIAnalysis } = await import("@/data/education")
        const data: DocumentAnalysisResult = simulateAIAnalysis(selectedFile.name)

        setAnalysisResult(data)
      } catch {
        setErrorMessage("Erreur lors de l'analyse du document. Réessayez.")
      } finally {
        setIsAnalyzing(false)
      }
    }
  }

  const handleGoToAnalysis = () => {
    if (!analysisResult) return

    const document: EducationDocument = {
      id: Date.now(),
      fileName: selectedFile?.name ?? analysisResult.fileName,
      description: `Analysé le ${new Date(analysisResult.createdAt).toLocaleString("fr-FR")}`,
      dateUploaded: new Date(),
    }

    const params = new URLSearchParams({
      document: encodeURIComponent(JSON.stringify(document)),
      analysis: encodeURIComponent(JSON.stringify(analysisResult)),
    })

    navigate(`/education/analyse?${params.toString()}`)
  }

  const formattedSummary = useMemo(() => analysisResult?.summaryParagraphs ?? [], [analysisResult])

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
                {errorMessage && (
                  <p className="text-sm text-red-400">
                    {errorMessage}
                  </p>
                )}
              </div>
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || isAnalyzing}
                className="w-full bg-[#3a8a2a] hover:bg-[#4ba835] text-white"
              >
                {isAnalyzing ? "Analyse en cours..." : "Analyser avec l'IA"}
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

        {analysisResult && (
          <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
            <CardHeader>
              <CardTitle className="text-[#f5f5f5]">Analyse rapide</CardTitle>
              <CardDescription className="text-[#b0b0b0]">
                {analysisResult.title ?? analysisResult.fileName} — résumé automatique généré le {new Date(analysisResult.createdAt).toLocaleString("fr-FR")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-[#2a2a2a] bg-[#0f0f0f] p-4">
                  <p className="text-sm text-[#b0b0b0]">Pages</p>
                  <p className="text-2xl font-semibold text-[#f5f5f5]">{analysisResult.pageCount ?? "—"}</p>
                </div>
                <div className="rounded-xl border border-[#2a2a2a] bg-[#0f0f0f] p-4">
                  <p className="text-sm text-[#b0b0b0]">Mots</p>
                  <p className="text-2xl font-semibold text-[#f5f5f5]">{analysisResult.wordCount.toLocaleString("fr-FR")}</p>
                </div>
                <div className="rounded-xl border border-[#2a2a2a] bg-[#0f0f0f] p-4">
                  <p className="text-sm text-[#b0b0b0]">Temps de lecture</p>
                  <p className="text-2xl font-semibold text-[#f5f5f5]">~{analysisResult.readingTimeMinutes} min</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4ba835] mb-2">Mots-clés</p>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.keywords.map((keyword) => (
                    <span key={keyword} className="rounded-full border border-[#4ba835]/40 bg-[#3a8a2a]/10 px-3 py-1 text-sm text-[#f5f5f5]">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4ba835]">Résumé</p>
                {formattedSummary.map((paragraph, index) => (
                  <p key={index} className="text-sm leading-relaxed text-[#d7d7d7]">
                    {paragraph}
                  </p>
                ))}
              </div>

              <Button
                onClick={handleGoToAnalysis}
                className="w-full bg-[#3a8a2a] hover:bg-[#4ba835] text-white"
              >
                Analyser ce document
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}