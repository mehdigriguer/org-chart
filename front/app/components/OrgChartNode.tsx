// src/components/OrgChartNode.tsx
"use client";

import React from "react";
import Image from "next/image";

export interface OrgChartNodeProps {
  avatarUrl: string;
  name: string;
  title: string;
  department:
    | "Direction Générale"
    | "Techstud.io"
    | "Test.it"
    | "Data.ia"
    | "Tech.ops"
    | "Cyber";
  location: string;
  onClick?: () => void; // ← nouveau prop
}

const colorMap = {
  "Direction Générale": {
    border: "border-blue-500",
    bg: "bg-blue-100",
    text: "text-blue-500",
  },
  "Techstud.io": {
    border: "border-red-500",
    bg: "bg-red-100",
    text: "text-red-500",
  },
  "Test.it": {
    border: "border-orange-500",
    bg: "bg-orange-100",
    text: "text-orange-500",
  },
  "Data.ia": {
    border: "border-green-500",
    bg: "bg-green-100",
    text: "text-green-500",
  },
  "Tech.ops": {
    border: "border-purple-500",
    bg: "bg-purple-100",
    text: "text-purple-500",
  },
  Cyber: {
    border: "border-pink-500",
    bg: "bg-pink-100",
    text: "text-pink-500",
  },
};

const OrgChartNode: React.FC<OrgChartNodeProps> = ({
  avatarUrl,
  name,
  title,
  department,
  location,
  onClick, // ← onClick reçu
}) => {
  const { border, bg, text } = colorMap[department];

  return (
    <div
      onClick={onClick} // ← gestion du clic
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
          src={avatarUrl}
          alt={name}
          width={48}
          height={48}
          unoptimized={true}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Texte */}
      <div className="flex-1 flex flex-col justify-center space-y-1 overflow-hidden">
        <h4 className="flex items-center space-x-1 text-sm font-bold truncate">
          {name}
        </h4>
        <div className="flex items-center space-x-1 text-xs truncate">
          <span className="text-gray-500 truncate">{title}</span>
          <span className={text}>•</span>
          <span className={`${text} font-medium truncate`}>{department}</span>
        </div>
        <div className="flex items-center space-x-1 text-xs truncate">
          <span className="text-gray-500 truncate">{location}</span>
        </div>
      </div>
    </div>
  );
};

export default OrgChartNode;
