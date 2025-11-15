import ActuFlashPage from "@/components/pages/actuflash/ActuFlashPage";
import ArticleDetailPage from "@/components/pages/article-detail";
import MinistereDetailPage from "@/components/pages/ministere-detail";
import type { RouteObject } from "react-router-dom";

export const actuFlashRoutes: RouteObject[] = [
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
  },
];