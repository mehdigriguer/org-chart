import xlsx from "xlsx";
import fs from "fs";
import prettier from "prettier";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

// Import sans extension, ts-node gère lui-même la résolution
import type { Membre } from "../types/Membre";
import { POSTES } from "../types/Poste.ts";
import { COMMUNAUTES } from "../types/Communaute.ts";
import { LIEUX } from "../types/Lieu.ts";
import type { Communaute } from "../types/Communaute.ts";
import type { Poste } from "../types/Poste.ts";
import type { Lieu } from "../types/Lieu.ts";

// 1. Reconstituer __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 2. Récupérer tous les fichiers Excel du dossier data
const dataDir = resolve(__dirname, "..", "data");
const excelFiles = fs
  .readdirSync(dataDir)
  .filter((file) => file.endsWith(".xlsx"))
  .map((file) => resolve(dataDir, file));

// 3. Définitions et utilitaires de normalisation
const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD") // décompose les accents
    .replace(/\p{Diacritic}/gu, "") // supprime les diacritiques
    .replace(/['’]/g, " ") // remplace apostrophes par un espace
    .replace(/\s+/g, " ") // normalise espaces
    .trim();

// 4. Préparer des maps pour comparaison insensible à la casse, accents et apostrophes
const posteMap = new Map<string, Poste>(POSTES.map((p) => [normalize(p), p]));
const communauteMap = new Map<string, Communaute>(
  COMMUNAUTES.map((c) => [normalize(c), c])
);
const lieuMap = new Map<string, Lieu>(LIEUX.map((l) => [normalize(l), l]));

// 5. Extraction et agrégation des données
let members: Membre[] = [];

excelFiles.forEach((excelPath) => {
  const workbook = xlsx.readFile(excelPath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json<Record<string, string>>(sheet, {
    header: [
      "Employé",
      "Poste",
      "Organisation hiérarchique",
      "Téléphone",
      "E-mail",
      "Site",
    ],
    range: 2,
    defval: "",
  });

  rows.forEach((r) => {
    const nom = r["Employé"].trim();
    if (!nom) return;

    // --- poste & communauté ---
    const rawPoste = r["Poste"]
      .trim()
      .replace(/\(absent\)$/i, "")
      .trim();
    if (/Contingent Worker/i.test(rawPoste)) return;
    const normPoste = normalize(rawPoste);
    let poste: Poste | undefined;
    for (const [key, orig] of posteMap) {
      if (normPoste.startsWith(key)) {
        poste = orig;
        break;
      }
    }
    if (!poste) {
      console.warn(`⚠️ Poste non reconnu pour ${nom} : "${rawPoste}"`);
      return;
    }

    // --- manager ---
    const orgField = r["Organisation hiérarchique"].trim();
    let nomManager: string | undefined;
    const match = orgField.match(/\(([^)]+)\)/);
    if (match) {
      nomManager = match[1].trim();
    } else if (orgField) {
      nomManager = orgField;
    }

    // --- communauté ---
    const commPart = rawPoste
      .slice(poste.length)
      .trim()
      .replace(/\(absent\)$/i, "")
      .trim();
    let communaute: Communaute | undefined;
    if (commPart) {
      const normComm = normalize(commPart);
      communaute = communauteMap.get(normComm);
    }
    if (!communaute && nomManager) {
      const manager = members.find((m) => m.nom === nomManager);
      if (manager) communaute = manager.communaute;
    }
    if (!communaute) {
      console.warn(`⚠️ Communauté non reconnue pour ${nom} : "${commPart}"`);
      return;
    }

    // --- lieu ---
    const rawLieu = r["Site"].trim();
    const normLieu = normalize(rawLieu);
    const lieu = lieuMap.get(normLieu);
    if (!lieu) {
      console.warn(`⚠️ Lieu non reconnu pour ${nom} : "${rawLieu}"`);
      return;
    }

    // --- téléphone & email ---
    const telephone = r["Téléphone"].trim().replace(/\s*\(.*\)$/, "");
    const email = r["E-mail"].trim();

    members.push({
      id: `member_${members.length + 1}`,
      nom,
      poste,
      communaute,
      lieu,
      ...(nomManager && { nomManager }),
      telephone,
      email,
    });
  });
});

// 6. Forcer le poste de David LAYANI en CEO et supprimer l'attribut nomManager
members = members.map((m) =>
  m.nom === "David LAYANI"
    ? { ...m, poste: "CEO" as Poste, nomManager: undefined }
    : m
);

// 7. Génération et écriture du fichier TypeScript
const content = `// ce fichier est généré automatiquement. NE PAS MODIFIER à la main.
import { Membre } from "../types/Membre";

export const orgData: Membre[] = ${JSON.stringify(members, null, 2)};`;

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
