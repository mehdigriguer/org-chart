// DeptCard.tsx
"use client";

import { motion } from "framer-motion";
import type { Departement, Communaute } from "../types/Communaute";

interface DeptCardProps {
  entries: [Departement, ReadonlyArray<Communaute>][];
  onDeptSelect: (idx: number) => void;
}

export function DeptCard({ entries, onDeptSelect }: DeptCardProps) {
  return (
    <motion.div
      key="cards"
      className="grid grid-cols-2 gap-6"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {entries.map(([dept], idx) => (
        <motion.div
          key={dept}
          onClick={() => onDeptSelect(idx)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="cursor-pointer p-6 bg-white rounded-2xl shadow-lg flex items-center justify-center h-40"
        >
          <h2 className="text-2xl font-semibold">{dept}</h2>
        </motion.div>
      ))}
    </motion.div>
  );
}
