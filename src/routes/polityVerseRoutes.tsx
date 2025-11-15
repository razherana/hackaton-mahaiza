import { PolityVersePage, BuildStatePage, KnowNationPage } from "@/components/pages/polityVerse";
import type { RouteObject } from "react-router-dom";

export const polityVerseRoutes : RouteObject[] = [
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
  },
];