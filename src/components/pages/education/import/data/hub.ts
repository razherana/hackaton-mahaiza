import type { EducationDocument } from "../types";

export const documentDatas: EducationDocument[] = [
  {
    id: 1,
    fileName: "Mathématiques_Algèbre_Base.pdf",
    description: "Introduction aux concepts fondamentaux de l'algèbre, équations du premier degré et résolution de problèmes.",
    dateUploaded: new Date("2024-10-15"),
  },
  {
    id: 2,
    fileName: "Histoire_Madagascar_Colonisation.pdf",
    description: "L'histoire de Madagascar pendant la période coloniale française (1896-1960) et les mouvements d'indépendance.",
    dateUploaded: new Date("2024-11-02"),
  },
  {
    id: 3,
    fileName: "Physique_Mécanique_Classique.pdf",
    description: "Cours de physique sur la mécanique classique : forces, mouvement et lois de Newton.",
    dateUploaded: new Date("2024-11-08"),
  },
  {
    id: 4,
    fileName: "Économie_Madagascar_Développement.pdf",
    description: "Analyse économique du développement de Madagascar : secteurs clés, défis et opportunités.",
    dateUploaded: new Date("2024-11-10"),
  },
  {
    id: 5,
    fileName: "Littérature_Française_XIXe.pdf",
    description: "Panorama de la littérature française du XIXe siècle : romantisme, réalisme et naturalisme.",
    dateUploaded: new Date("2024-11-12"),
  },
];
