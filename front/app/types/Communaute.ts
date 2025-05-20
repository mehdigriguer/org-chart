// app/types/Communaute.ts

/**
 * Définition des départements et des communautés (CCP)
 * --------------------------------------------------
 * ➜ On écrit CHAQUE communauté une seule fois, à l’intérieur de son département.
 * ➜ Les autres structures (COMMUNAUTES, types, maps…) sont générées automatiquement.
 */

export const DEPARTEMENTS = {
  /** Expertises techniques & fonctionnelles */
  Expertises: [
    "Architecture",
    "Cloud.op",
    "Cyber",
    "Data.io",
    "Data.IA",
    "Deal, Risk & Finance",
    "Innovative Strategy",
    "Link Up",
    "Strat Op",
    "tech.ops",
    "Tech Advantage",
    "Techstud.io",
    "Test.IT",
  ],

  /** Offres & domaines orientés marché */
  Marchés: [
    "BSA",
    "Cloud Next",
    "CRX",
    "Expérience Collaborateurs",
    "Places & Smart cities",
  ],

  /** Fonctions support internes */
  Support: [
    "Commercial & Business Development",
    "Communications",
    "Direction Générale",
    "Système d'Information",
    "Evénementiel",
    "Finance",
    "Institut",
    "Juridique",
    "Ressources Humaines",
    "Services généraux",
    "SI Métier",
  ],

  /** Secteurs d’activité servis */
  Secteurs: ["BFA", "IDEAS", "SMT", "SP"],
} as const satisfies Record<string, readonly string[]>;

// --------------------------------------------------
// Union de toutes les communautés (déduit des départements)
// --------------------------------------------------

export const COMMUNAUTES = [
  ...DEPARTEMENTS.Expertises,
  ...DEPARTEMENTS.Marchés,
  ...DEPARTEMENTS.Support,
  ...DEPARTEMENTS.Secteurs,
] as const;

// Le type Communaute est dérivé directement des valeurs de DEPARTEMENTS
export type Communaute = (typeof COMMUNAUTES)[number];

// --------------------------------------------------
// Mapping Communauté → Département
// --------------------------------------------------

export type Departement = keyof typeof DEPARTEMENTS;

export const departementByCommunaute: Record<Communaute, Departement> = (
  Object.entries(DEPARTEMENTS) as [Departement, readonly Communaute[]][]
).reduce(
  (acc, [dept, communities]) => {
    communities.forEach((comm) => {
      acc[comm] = dept;
    });
    return acc;
  },
  {} as Record<Communaute, Departement>
);

// --------------------------------------------------
// Gestion des couleurs d’affichage (tags, badges, etc.)
// --------------------------------------------------

export type CouleurCommunaute = {
  border: string;
  bg: string;
  text: string;
};

const baseColors = [
  "blue",
  "red",
  "orange",
  "green",
  "purple",
  "pink",
  "gray",
  "teal",
  "amber",
  "cyan",
] as const;

export const colorMap: Record<Communaute, CouleurCommunaute> =
  COMMUNAUTES.reduce(
    (acc, comm, idx) => {
      const color = baseColors[idx % baseColors.length];
      acc[comm] = {
        border: `border-${color}-500`,
        bg: `bg-${color}-100`,
        text: `text-${color}-500`,
      };
      return acc;
    },
    {} as Record<Communaute, CouleurCommunaute>
  );
