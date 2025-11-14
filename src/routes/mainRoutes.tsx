import { AccueilPage } from "@/components/pages/accueil";
import type { RouteObject } from "react-router-dom";

export const mainRoutes: RouteObject[] = [
  // ... your route definitions here
  {
    path: "/",
    element: <AccueilPage />
  }
];