"use client";
import { useState } from "react";
import { DEPARTEMENTS } from "./types/Communaute";
import type { Departement, Communaute } from "./types/Communaute";
import { motion, AnimatePresence } from "framer-motion";
import OrgChart from "./components/OrgChart";

export default function Home() {
  const entries = Object.entries(DEPARTEMENTS) as [
    Departement,
    ReadonlyArray<Communaute>,
  ][];

  const [selectedDept, setSelectedDept] = useState<number | null>(null);
  const [selectedComm, setSelectedComm] = useState<Communaute | null>(null);

  const handleDeptSelect = (idx: number) => setSelectedDept(idx);
  const handleCommSelect = (c: Communaute) => setSelectedComm(c);
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

      {/* Contenu principal */}
      <div className="w-full h-full flex items-center justify-center px-4">
        <AnimatePresence mode="wait">
          {selectedDept === null && selectedComm === null && (
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
                  onClick={() => handleDeptSelect(idx)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="cursor-pointer p-6 bg-white rounded-2xl shadow-lg flex items-center justify-center h-40"
                >
                  <h2 className="text-2xl font-semibold">{dept}</h2>
                </motion.div>
              ))}
            </motion.div>
          )}

          {selectedDept !== null && selectedComm === null && (
            <motion.div
              key="comms"
              className="w-full max-w-3xl p-8 bg-white rounded-2xl shadow-lg min-h-[350px] flex flex-col justify-between"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* Titre collé en haut */}
              <h2 className="text-3xl font-bold text-center">
                {entries[selectedDept][0]}
              </h2>

              {/* Wrapper qui prend tout l’espace restant */}
              <div className="flex-grow flex items-center justify-center">
                <ul className="flex flex-wrap justify-center items-center gap-2">
                  {entries[selectedDept][1].map((c) => (
                    <li
                      key={c}
                      onClick={() => handleCommSelect(c)}
                      className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full text-xl"
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bouton collé en bas */}
              <motion.button
                onClick={reset}
                className="underline text-blue-600 hover:text-blue-800 mx-auto"
              >
                ← Retour
              </motion.button>
            </motion.div>
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
