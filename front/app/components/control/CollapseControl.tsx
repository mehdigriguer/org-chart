// CollapseControl.tsx
"use client";

import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

export interface CollapseControlProps {
  isExpanded: boolean;
  onToggle: () => void;
  childrenCount: number;
}

const CollapseControl: React.FC<CollapseControlProps> = ({
  isExpanded,
  onToggle,
  childrenCount,
}) => (
  <div className="w-full flex justify-center">
    <button
      onClick={onToggle}
      className="flex items-center bg-white px-3 py-1 rounded-full 
      shadow shadow-sm transform transition-all duration-200 ease-in-out
      hover:scale-105 hover:shadow-lg hover:z-10"
    >
      {isExpanded ? (
        <>
          <span className="text-sm text-gray-500">Collapse</span>
          <ChevronUp className="w-4 h-4 text-gray-400 ml-1" />
        </>
      ) : (
        <>
          <span className="text-sm text-gray-500">+{childrenCount}</span>
          <ChevronDown className="w-4 h-4 text-gray-400 ml-1" />
        </>
      )}
    </button>
  </div>
);

export default CollapseControl;
