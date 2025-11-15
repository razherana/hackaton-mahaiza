import { AccueilPage } from "@/components/pages/accueil";
import { PolityVersePage } from "@/components/pages/polityVerse";
import { BuildStatePage } from "@/components/pages/polityVerse/BuildStatePage";
import { KnowNationPage } from "@/components/pages/polityVerse/KnowNationPage";
import type { RouteObject } from "react-router-dom";

export const mainRoutes: RouteObject[] = [
  // ... your route definitions here
  {
    path: "/",
    element: <AccueilPage />
  },
  {
    path: "/polity-verse",
    element: <PolityVersePage />
  },
  {
    path: "/polity-verse/build",
    element: <BuildStatePage />
  },
  {
    path: "/polity-verse/know-nation",
    element: <KnowNationPage />
  }
];