"use client";

import React, { useMemo, useState } from "react";
import { orgData } from "../data/orgChartData";

interface LocationFilterProps {
  selected: string[];
  onToggle: (loc: string) => void;
}

export default function LocationFilter({
  selected,
  onToggle,
}: LocationFilterProps) {
  // Extraire les localisations uniques depuis les données orgData
  const ALL_LOCATIONS = useMemo(() => {
    const locations = orgData.map((member) => member.location);
    return Array.from(new Set(locations));
  }, []);

  // Ordonner pour mettre les sélectionnées en premier
  const orderedLocations = useMemo(() => {
    const selectedSet = new Set(selected);
    const selectedFirst = ALL_LOCATIONS.filter((loc) => selectedSet.has(loc));
    const others = ALL_LOCATIONS.filter((loc) => !selectedSet.has(loc));
    return [...selectedFirst, ...others];
  }, [ALL_LOCATIONS, selected]);

  // Pagination pour n'afficher que 4 localisations à la fois
  const [startIndex, setStartIndex] = useState(0);
  const pageSize = 4;
  const endIndex = startIndex + pageSize;
  const visibleLocations = orderedLocations.slice(startIndex, endIndex);

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - pageSize, 0));
  };

  const handleNext = () => {
    setStartIndex((prev) =>
      Math.min(prev + pageSize, orderedLocations.length - pageSize)
    );
  };

  return (
    <aside className="fixed top-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 z-50">
      <button
        onClick={handlePrev}
        disabled={startIndex === 0}
        className="px-2 py-1 text-xl font-bold disabled:opacity-30"
      >
        ‹
      </button>

      <div className="flex flex-row gap-2">
        {visibleLocations.map((loc) => (
          <button
            key={loc}
            onClick={() => onToggle(loc)}
            className={`px-4 py-2 w-36 text-sm text-black border rounded transition-all duration-200 ease-in-out whitespace-nowrap shadow-lg
              hover:bg-blue-200 hover:border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
              hover:shadow-lg hover:scale-105
              ${
                selected.includes(loc)
                  ? "bg-blue-200 border-blue-800"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
          >
            {loc}
          </button>
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={endIndex >= orderedLocations.length}
        className="px-2 py-1 text-xl font-bold disabled:opacity-30"
      >
        ›
      </button>
    </aside>
  );
}
