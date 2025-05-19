// generateOrgData.ts
import xlsx from "xlsx";
import fs from "fs";
import prettier from "prettier";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

// 1. Reconstituer __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 2. Récupérer tous les fichiers Excel du dossier data
const dataDir = resolve(__dirname, "..", "data");
const excelFiles = fs
  .readdirSync(dataDir)
  .filter((file) => file.endsWith(".xlsx"))
  .map((file) => resolve(dataDir, file));

// 3. Définir les en-têtes et type de ligne
const headers = [
  "Employé",
  "Poste",
  "Organisation hiérarchique",
  "Téléphone",
  "E-mail",
  "Site",
] as const;
type Row = Record<(typeof headers)[number], string>;

// 4. Mapping des départements

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

// 5. Interface étendue

interface OrgMemberExtended {
  id: string;
  name: string;
  title: string;
  department: Department;
  location: string;
  avatarUrl: string;
  phone: string;
  email: string;
  managerName?: string;
}

// 6. Extraction et agrégation des données
let members: OrgMemberExtended[] = [];
excelFiles.forEach((excelPath) => {
  const workbook = xlsx.readFile(excelPath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows: Row[] = xlsx.utils.sheet_to_json<Row>(sheet, {
    header: Array.from(headers),
    range: 2, // sauter les 2 premières lignes
    defval: "",
  });

  const fileMembers = rows
    .map((r, index) => {
      const name = r["Employé"].trim();
      if (!name) return null;

      const poste = r["Poste"].trim();
      const title = poste.split(/\s+/)[0] || "";
      const department = mapDepartment(poste);
      const location = r["Site"].trim();

      // Nettoyage du téléphone
      const rawPhone = r["Téléphone"].trim();
      const phone = rawPhone.replace(/\s*\(.*\)$/, "");

      const email = r["E-mail"].trim();

      // Extraction du managerName depuis des parenthèses, quel que soit le format précédent
      const orgField = r["Organisation hiérarchique"].trim();
      const managerMatch = orgField.match(/\(([^)]+)\)/);
      const managerName = managerMatch?.[1].trim();

      return {
        id: `member_${members.length + index + 1}`,
        name,
        title,
        department,
        location,
        avatarUrl: "",
        phone,
        email,
        ...(managerName && { managerName }),
      };
    })
    .filter((m): m is OrgMemberExtended => m !== null);

  members = members.concat(fileMembers);
});

// 7. Ajouter le CEO
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

// 8. Génération et écriture du fichier TypeScript
const content = `// ce fichier est généré automatiquement. NE PAS MODIFIER à la main.
import { OrgMember } from "../data/orgChartData";

export const orgData: (OrgMember & { managerName?: string; phone: string; email: string })[] = ${JSON.stringify(
  members,
  null,
  2
)};
`;

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
