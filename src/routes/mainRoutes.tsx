import { AccueilPage } from "@/components/pages/accueil";
import type { RouteObject } from "react-router-dom";
import { educationRoutes } from "./educationRoutes";
import { polityVerseRoutes } from "./polityVerseRoutes";
import { actuFlashRoutes } from "./actuFlashRoutes";

export const mainRoutes: RouteObject[] = [
  {
    path: "/",
    element: <AccueilPage />
  },
  ...actuFlashRoutes,
  ...polityVerseRoutes,
  ...educationRoutes
];