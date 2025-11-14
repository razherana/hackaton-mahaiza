import type { RouteObject } from "react-router-dom";

export const educationRoutes: RouteObject[] = [
  {
    path: "education/",
    element: await import("../components/pages/education/import").then(module => <module.EducationImportPage />)
  },
  {
    path: "education/import/",
    element: await import("../components/pages/education/import").then(module => <module.EducationImportPage />)
  },
];