// app/data/orgChartData.ts
export interface OrgMember {
  id: string;
  avatarUrl: string;
  name: string;
  title: string;
  department:
    | "Direction Générale"
    | "Techstud.io"
    | "Test.it"
    | "Data.ia"
    | "Tech.ops"
    | "Cyber";
  location: string;
  managerName?: string;
}

// on importe la donnée générée
export { orgData } from "./orgChartData.generated";
