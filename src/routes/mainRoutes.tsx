import { AccueilPage } from "@/components/pages/accueil";
import type { RouteObject } from "react-router-dom";
import { educationRoutes } from "./educationRoutes";

export const mainRoutes: RouteObject[] = [
  // ... your route definitions here
  {
    path: "/",
    element: <AccueilPage />
  },
  ...educationRoutes
];