// generateOrgData.ts
import xlsx from "xlsx";
import fs from "fs";
import prettier from "prettier";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

// 1. Reconstituer __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 2. Chemin absolu vers le fichier Excel
const excelPath = resolve(__dirname, "..", "data", "tech.ops.xlsx");

// 3. Lecture du workbook et de la première feuille
const workbook = xlsx.readFile(excelPath);
const sheet = workbook.Sheets[workbook.SheetNames[0]];

// 4. Définition des en-têtes et extraction des lignes (sauter les 2 premières lignes)
const headers = [
  "Employé",
  "Matricule de l'employé",
  "Poste",
  "Organisation hiérarchique",
  "Téléphone",
  "E-mail",
  "Site",
] as const;
type Row = Record<(typeof headers)[number], string>;

const rows: Row[] = xlsx.utils.sheet_to_json<Row>(sheet, {
  header: Array.from(headers),
  range: 2, // sauter les 2 premières lignes
  defval: "",
});

// 5. Type Dept. et mapping

type Department =
  | "Direction Générale"
  | "Techstud.io"
  | "Test.it"
  | "Data.ia"
  | "Tech.ops"
  | "Cyber";
function mapDepartment(poste: string): Department {
  const p = poste.toLowerCase();
  if (/\btech\.ops\b/.test(p) || /\bcloud\.op\b/.test(p)) return "Tech.ops";
  if (/\bcyber\b/.test(p)) return "Cyber";
  if (/\bdata\b/.test(p)) return "Data.ia";
  if (/\btest\b/.test(p)) return "Test.it";
  if (/\btechstud\b/.test(p)) return "Techstud.io";
  if (/\bpartner\b/.test(p)) return "Direction Générale";
  return "Tech.ops";
}

// 6. Construction des membres

interface OrgMemberExtended {
  id: string;
  name: string;
  title: string;
  department: Department;
  location: string;
  avatarUrl: string; // ajouté pour satisfaire OrgMember
  phone: string; // ajouté pour le téléphone
  email: string; // ajouté pour l'email
  managerName?: string;
}

const members: OrgMemberExtended[] = rows
  .map((r, index) => {
    const name = r["Employé"].trim();
    if (!name) return null;

    const poste = r["Poste"].trim();
    const title = poste.split(/\s+/)[0] || "";
    const department = mapDepartment(poste);
    const location = r["Site"].trim();

    // Nettoyage du téléphone : garder seulement le numéro, supprimer tout ce qui suit une parenthèse
    const rawPhone = r["Téléphone"].trim();
    const phone = rawPhone.replace(/\s*\(.*\)$/, "");

    const email = r["E-mail"].trim();

    const orgField = r["Organisation hiérarchique"].trim();
    const match = orgField.match(/\(([^)]+)\)\s*$/);
    const managerName = match?.[1].trim();

    return {
      id: `member_${index + 1}`,
      name,
      title,
      department,
      location,
      avatarUrl: "", // valeur par défaut
      phone,
      email,
      ...(managerName && { managerName }),
    };
  })
  .filter((m): m is OrgMemberExtended => m !== null);

// 6a. Ajouter le CEO
members.push({
  id: "member_ceo",
  name: "David LAYANI",
  title: "CEO",
  department: "Direction Générale",
  location: "",
  avatarUrl: "",
  phone: "",
  email: "",
});

// 7. Génération du contenu TypeScript
const content = `// ce fichier est généré automatiquement. NE PAS MODIFIER à la main.
import { OrgMember } from "../data/orgChartData";

// managerName relie chaque employé à son manager. Le CEO n'a pas de managerName.
export const orgData: (OrgMember & { managerName?: string; phone: string; email: string })[] = ${JSON.stringify(
  members,
  null,
  2
)};
`;

// 8. Formatage et écriture du fichier généré
(async () => {
  try {
    const formatted = await prettier.format(content, { parser: "typescript" });
    const outPath = resolve(
      __dirname,
      "..",
      "data",
      "orgChartData.generated.ts"
    );
    fs.writeFileSync(outPath, formatted, "utf-8");
    console.log("✅ orgChartData.generated.ts créé à :", outPath);
  } catch (error) {
    console.error("❌ Erreur lors de la génération :", error);
    process.exit(1);
  }
})();
