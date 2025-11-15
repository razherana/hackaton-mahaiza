import { useState } from "react"
import { FileText, Calendar, ArrowRight } from "lucide-react"
import { getAllDocuments } from "@/data/education"
import type { EducationDocument } from "../types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export interface EducationHubModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectedDocument: (document: EducationDocument) => void
}

export function EducationHubModal({ 
  open, 
  onOpenChange, 
  onSelectedDocument 
}: EducationHubModalProps) {
  const [docs] = useState(getAllDocuments())

  const handleDocumentSelect = (doc: EducationDocument) => {
    onSelectedDocument(doc)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl bg-[#1a1a1a] border-[#2a2a2a] text-[#f5f5f5]">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl text-[#f5f5f5]">Hub de documents</DialogTitle>
          <DialogDescription className="text-[#b0b0b0]">
            Sélectionnez un document existant pour commencer votre analyse avec l'IA
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
          {docs.map((doc) => (
            <Card key={doc.id} className="bg-[#0f0f0f] border-[#2a2a2a] hover:border-[#4ba835]/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-[#3a8a2a]/25 p-2 text-[#4ba835]">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-base text-[#f5f5f5]">{doc.fileName}</CardTitle>
                      <div className="flex items-center gap-2 text-xs text-[#b0b0b0]">
                        <Calendar className="h-3 w-3" />
                        <span>Uploadé le {doc.dateUploaded.toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs text-[#4ba835] border-[#4ba835]/50">
                    PDF
                  </Badge>
                </div>
                {doc.description && (
                  <CardDescription className="text-[#b0b0b0] mt-2">
                    {doc.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="pt-0">
                <Button
                  onClick={() => handleDocumentSelect(doc)}
                  className="w-full bg-[#3a8a2a] hover:bg-[#4ba835] text-white group"
                >
                  Analyser ce document
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}