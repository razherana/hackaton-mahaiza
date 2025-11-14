import {
  BookOpenCheck,
  Landmark,
  Newspaper,
  ArrowRight,
  Sparkles
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const modules = [
  {
    title: "Étudier avec l'IA",
    subtitle: "EducHub didactique",
    description:
      "Importer vos PDF, transformer vos cours et laissez l'IA préparer résumés, quiz et fiches personnalisées.",
    points: [
      "Importer ou sélectionner un PDF comme source de leçon",
      "Résumés instantanés, quiz et fiches de notes auto-générés",
      "Chatbot pédagogique pour creuser chaque notion",
      "Analyse des points à améliorer avant les examens"
    ],
    icon: BookOpenCheck
  },
  {
    title: "Newspaper avec l'IA",
    subtitle: "Fil d'actualité intelligent",
    description:
      "Visionne les nouvelles essentielles classées par thématique avec résumés et explications pour aller droit au but.",
    points: [
      "Liste d'informations catégorisées en temps réel",
      "Résumé express + explication claire pour les pressés",
      "Chatbot pour obtenir des détails ou des sources",
      "Mode focus pour suivre uniquement ce qui compte"
    ],
    icon: Newspaper
  },
  {
    title: "Quiz Politique & Économie",
    subtitle: "Madagascar en action",
    description:
      "Renforcez votre culture civique avec des quiz, QCM et vidéos sur la politique et l'économie malgache.",
    points: [
      "Questionnaires thématiques et QCM adaptatifs",
      "Vidéos pédagogiques axées Madagascar",
      "Chemins d'apprentissage gamifiés",
      "Suivi de progression et défis hebdo"
    ],
    icon: Landmark
  }
]

export function AccueilPage() {
  return (
    <div className="min-h-screen bg-[#f8f9f7] px-4 py-8 text-[#1b1b1b]">
      <div className="mx-auto max-w-6xl space-y-16">
  <section className="relative isolate overflow-hidden rounded-[2.5rem] bg-linear-to-r from-[#3a8a2a] via-[#4ba835] to-[#1b1b1b] px-8 py-14 text-white shadow-[0_25px_60px_-30px_rgba(27,27,27,0.8)]">
          <div className="absolute inset-0 opacity-50">
            <div className="absolute -top-16 -right-10 h-64 w-64 rounded-full bg-white/15 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[#f2f7f0]/20 blur-3xl" />
          </div>
          <div className="relative grid gap-10 md:grid-cols-[minmax(0,1fr)_320px] md:items-center">
            <div className="space-y-6">
              <Badge
                variant="neutral"
                className="border-0 bg-white/10 text-xs font-semibold text-white"
              >
                Plateforme Mahaiza
              </Badge>
              <div className="flex items-center gap-4">
                <img
                  src="/logo-noback-light.png"
                  alt="Logo Mahaiza"
                  className="h-14 w-auto drop-shadow-md"
                />
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
                Bienvenue sur l'espace d'apprentissage augmenté de Mahaiza
              </h1>
              <p className="text-base text-white/80 md:text-lg">
                Trois modules complémentaires pour étudier, comprendre l'actualité et tester votre culture
                politique et économique malgache — le tout propulsé par l'IA.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button className="shadow-white/30">
                  Explorer les modules
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="secondary" className="text-[#1b1b1b]">
                  Voir une démonstration
                </Button>
              </div>
            </div>
            <div className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl">
              <p className="text-sm font-semibold uppercase text-white/70">Ce que vous pouvez faire</p>
              <ul className="mt-4 space-y-4 text-sm text-white/90">
                <li className="flex gap-3">
                  <span className="mt-0.5 h-2 w-2 rounded-full bg-white" />
                  Importer vos PDF, résumer vos cours et générer des quiz automatiques.
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 h-2 w-2 rounded-full bg-white" />
                  Recevoir un journal catégorisé avec explications ultra rapides.
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 h-2 w-2 rounded-full bg-white" />
                  Réviser la politique et l'économie de Madagascar avec vidéos et QCM.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <div className="space-y-3 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#3a8a2a]">
              Modules disponibles
            </p>
            <h2 className="text-3xl font-semibold">Choisissez votre accélérateur d'apprentissage</h2>
            <p className="text-base text-[#4d4d4d]">
              Chaque module est conçu pour un usage rapide, clair et guidé. Passez de la prise d'information à l'action
              en quelques minutes.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {modules.map((module) => {
              const Icon = module.icon
              return (
                <Card key={module.title} className="flex h-full flex-col">
                  <CardHeader className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-[#3a8a2a]/15 p-3 text-[#3a8a2a]">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <Badge variant="outline" className="text-xs text-[#3a8a2a]">
                          {module.subtitle}
                        </Badge>
                      </div>
                    </div>
                    <CardTitle>{module.title}</CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-3 text-sm text-[#4a4a4a]">
                      {module.points.map((point) => (
                        <li key={point} className="flex gap-3">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#3a8a2a]" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" className="group inline-flex items-center gap-2 px-0 text-[#3a8a2a]">
                      En savoir plus
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}