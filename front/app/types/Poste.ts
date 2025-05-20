// app/types/Poste.ts

// Liste exhaustive des postes
export const POSTES = [
  "Apprentice",
  "Stagiaire",
  "Intern",
  "Associate",
  "Expert Associate",
  "Conseillère Experte",
  "Secrétaire Générale",
  "Leader",
  "Partner",
  "CEO",
] as const;

// Le type Poste est dérivé directement de ce tableau
export type Poste = (typeof POSTES)[number];
