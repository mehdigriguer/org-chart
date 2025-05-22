// CommCard.tsx
"use client";

import { motion } from "framer-motion";
import type { Departement, Communaute } from "../types/Communaute";

interface CommCardProps {
  dept: Departement;
  comms: ReadonlyArray<Communaute>;
  onCommSelect: (c: Communaute) => void;
  onBack: () => void;
}

export function CommCard({ dept, comms, onCommSelect, onBack }: CommCardProps) {
  return (
    <motion.div
      key="comms"
      className="w-full max-w-3xl p-8 bg-white rounded-2xl shadow-lg min-h-[350px] flex flex-col justify-between"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <h2 className="text-3xl font-bold text-center">{dept}</h2>

      <div className="flex-grow flex items-center justify-center">
        <ul className="flex flex-wrap justify-center items-center gap-2">
          {comms.map((c) => (
            <li
              key={c}
              onClick={() => onCommSelect(c)}
              className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full text-xl"
            >
              {c}
            </li>
          ))}
        </ul>
      </div>

      <motion.button
        onClick={onBack}
        className="underline text-blue-600 hover:text-blue-800 mx-auto"
      >
        ← Retour
      </motion.button>
    </motion.div>
  );
}
