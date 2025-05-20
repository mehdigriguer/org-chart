// app/types/Lieu.ts

// Liste exhaustive des lieux
export const LIEUX = [
  "Paris",
  "Lyon",
  "Nantes",
  "Rennes",
  "Strasbourg",
  "Aix-en-Provence",
] as const;

// Le type Lieu est dérivé directement de ce tableau
export type Lieu = (typeof LIEUX)[number];
