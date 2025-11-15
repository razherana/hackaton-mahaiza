import type { RouteObject } from "react-router-dom";
import { EducationLayout } from "../components/layouts/EducationLayout";
import { EducationImportPage } from "../components/pages/education/import";
import { EducationAnalysePage } from "../components/pages/education/analyse";
import { EducationQuizPage } from "../components/pages/education/quiz";

export const educationRoutes: RouteObject[] = [
  {
    path: "education/",
    element: <EducationLayout><EducationImportPage /></EducationLayout>
  },
  {
    path: "education/import/",
    element: <EducationLayout><EducationImportPage /></EducationLayout>
  },
  {
    path: "education/analyse/",
    element: <EducationLayout><EducationAnalysePage /></EducationLayout>
  },
  {
    path: "education/quiz/",
    element: <EducationLayout><EducationQuizPage /></EducationLayout>
  },
];