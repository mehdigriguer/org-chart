"use client";

import React from "react";

const ALL_LOCATIONS = ["Paris", "Bordeaux", "Casablanca"] as const;

interface LocationFilterProps {
  selected: string[];
  onToggle: (loc: string) => void;
}

export default function LocationFilter({
  selected,
  onToggle,
}: LocationFilterProps) {
  return (
    <aside className="fixed top-4 left-1/2 transform -translate-x-1/2 flex flex-row gap-2 z-50">
      {ALL_LOCATIONS.map((loc) => (
        <button
          key={loc}
          onClick={() => onToggle(loc)}
          className={`px-4 py-2 w-32 text-black border rounded transition-all duration-200 ease-in-out whitespace-nowrap shadow-lg 
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
    </aside>
  );
}
