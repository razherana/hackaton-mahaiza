import { useAnalysis } from "../context/useAnalysis"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function AnalysisContent() {
  const { sessionData } = useAnalysis()

  if (!sessionData) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-[#b0b0b0]">Sélectionnez un document pour commencer</p>
      </div>
    )
  }

  const { analysis } = sessionData

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6">
      <div className="max-w-3xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-[#f5f5f5]">
            {analysis.title ?? analysis.fileName}
          </h1>
          <p className="text-[#b0b0b0]">
            Analysé le {new Date(analysis.createdAt).toLocaleString("fr-FR")}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
            <CardContent className="pt-6">
              <div className="space-y-1">
                <p className="text-sm text-[#b0b0b0]">Pages</p>
                <p className="text-2xl font-semibold text-[#f5f5f5]">{analysis.pageCount ?? "—"}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
            <CardContent className="pt-6">
              <div className="space-y-1">
                <p className="text-sm text-[#b0b0b0]">Mots</p>
                <p className="text-2xl font-semibold text-[#f5f5f5]">
                  {analysis.wordCount.toLocaleString("fr-FR")}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
            <CardContent className="pt-6">
              <div className="space-y-1">
                <p className="text-sm text-[#b0b0b0]">Temps de lecture</p>
                <p className="text-2xl font-semibold text-[#f5f5f5]">~{analysis.readingTimeMinutes} min</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Keywords */}
        {analysis.keywords.length > 0 && (
          <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
            <CardHeader>
              <CardTitle className="text-[#f5f5f5]">Mots-clés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {analysis.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full border border-[#4ba835]/40 bg-[#3a8a2a]/10 px-3 py-1 text-sm text-[#f5f5f5]"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary */}
        <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
          <CardHeader>
            <CardTitle className="text-[#f5f5f5]">Résumé</CardTitle>
            <CardDescription className="text-[#b0b0b0]">
              Résumé automatique généré par l'IA
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysis.summaryParagraphs.map((paragraph, index) => (
              <p key={index} className="text-sm leading-relaxed text-[#d7d7d7]">
                {paragraph}
              </p>
            ))}
          </CardContent>
        </Card>

        {/* Excerpt */}
        {analysis.excerpt && (
          <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
            <CardHeader>
              <CardTitle className="text-[#f5f5f5]">Extrait</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-[#d7d7d7] italic">
                "{analysis.excerpt}"
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
