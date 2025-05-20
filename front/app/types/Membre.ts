import type { Communaute } from "./Communaute";
import type { Lieu } from "./Lieu";
import type { Poste } from "./Poste";

export type Membre = {
  id: string;
  image?: string;
  nom: string;
  poste: Poste;
  communaute: Communaute;
  lieu: Lieu;
  nomManager?: string;
  telephone?: string;
  email?: string;
};
