import { AccueilPage } from "@/components/pages/accueil";
import type { RouteObject } from "react-router-dom";
import { educationRoutes } from "./educationRoutes";
import { polityVerseRoutes } from "./polityVerseRoutes";

export const mainRoutes: RouteObject[] = [
  // ... your route definitions here
  {
    path: "/",
    element: <AccueilPage />
  },
  ...polityVerseRoutes,
  ...educationRoutes
];