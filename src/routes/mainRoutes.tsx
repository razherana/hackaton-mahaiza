import { AccueilPage } from "@/components/pages/accueil";
import ActuFlashPage from "@/components/pages/actuflash/ActuFlashPage";
import MinistereDetailPage from "@/components/pages/ministere-detail";
import ArticleDetailPage from "@/components/pages/article-detail";
import type { RouteObject } from "react-router-dom";

export const mainRoutes: RouteObject[] = [
  {
    path: "/",
    element: <AccueilPage />
  },
  {
    path: "/actuflash",
    element: <ActuFlashPage />
  },
  {
    path: "/ministeres/:id",
    element: <MinistereDetailPage />
  },
  {
    path: "/institutions/:id",
    element: <MinistereDetailPage />
  },
  {
    path: "/article/:ministereId/:articleId",
    element: <ArticleDetailPage />
  }
];