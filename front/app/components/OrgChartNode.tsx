// app/components/OrgChartNode.tsx
"use client";

import Image from "next/image";
import { colorMap } from "../types/Communaute";
import type { Membre } from "../types/Membre";

export interface OrgChartNodeProps {
  membre: Membre;
  onClick?: () => void;
}

const OrgChartNode: React.FC<OrgChartNodeProps> = ({ membre, onClick }) => {
  const { border, bg, text } = colorMap[membre.communaute];

  return (
    <div
      onClick={onClick}
      className={`
        w-68 flex items-center space-x-4
        p-3 rounded-2xl shadow-sm
        border border-gray-200 bg-gray-100
        transition-all duration-200 ease-in-out
        cursor-pointer
        hover:${border} hover:${bg}
        hover:scale-105 hover:shadow-lg hover:z-10
      `}
    >
      {/* Avatar */}
      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
        <Image
          src={membre.image || "/images/default-avatar.png"}
          alt={membre.nom}
          width={48}
          height={48}
          unoptimized={true}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Texte */}
      <div className="flex-1 flex flex-col justify-center space-y-1 overflow-hidden">
        <h4 className="flex items-center space-x-1 text-sm font-bold truncate">
          {membre.nom}
        </h4>
        <div className="flex items-center space-x-1 text-xs truncate">
          <span className="text-gray-500 truncate">{membre.poste}</span>
          <span className={text}>•</span>
          <span className={`${text} font-medium truncate`}>
            {membre.communaute}
          </span>
        </div>
        <div className="flex items-center space-x-1 text-xs truncate">
          <span className="text-gray-500 truncate">{membre.lieu}</span>
        </div>
      </div>
    </div>
  );
};

export default OrgChartNode;
