// Home.tsx
"use client";

import { useState } from "react";
import { DEPARTEMENTS } from "./types/Communaute";
import type { Departement, Communaute } from "./types/Communaute";
import { motion, AnimatePresence } from "framer-motion";
import OrgChart from "./components/OrgChart";
import { DeptCard } from "./components/DeptCard";
import { CommCard } from "./components/CommCard";

export default function Home() {
  const entries = Object.entries(DEPARTEMENTS) as [
    Departement,
    ReadonlyArray<Communaute>,
  ][];

  const [selectedDept, setSelectedDept] = useState<number | null>(null);
  const [selectedComm, setSelectedComm] = useState<Communaute | null>(null);

  const reset = () => {
    setSelectedDept(null);
    setSelectedComm(null);
  };

  return (
    <div className="w-full h-screen relative overflow-hidden">
      {/* Logo réduit en haut à gauche */}
      <motion.img
        src="/Onepoint.png"
        alt="Logo mini"
        onClick={reset}
        className="fixed top-4 left-4 w-16 h-4 z-10"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      />

      <div className="w-full h-full flex items-center justify-center px-4">
        <AnimatePresence mode="wait">
          {selectedDept === null && selectedComm === null && (
            <DeptCard
              entries={entries}
              onDeptSelect={(idx) => setSelectedDept(idx)}
            />
          )}

          {selectedDept !== null && selectedComm === null && (
            <CommCard
              dept={entries[selectedDept][0]}
              comms={entries[selectedDept][1]}
              onCommSelect={(c) => setSelectedComm(c)}
              onBack={reset}
            />
          )}

          {selectedComm && (
            <motion.div
              key="orgchart"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <OrgChart selectedCommunities={[selectedComm]} />
              <motion.button
                onClick={() => setSelectedComm(null)}
                className="mt-2 text-blue-600 hover:text-blue-800 underline fixed bottom-4 left-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.3, ease: "easeOut" }}
              >
                ← Choisir une autre communauté
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
