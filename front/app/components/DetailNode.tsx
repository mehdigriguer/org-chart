// src/components/DetailNode.tsx
"use client";

import React from "react";
import type { OrgMember } from "../data/orgChartData";
import OrgChartNode from "./OrgChartNode";

interface DetailNodeProps {
  member: OrgMember;
  onClose: () => void;
}

const DetailNode: React.FC<DetailNodeProps> = ({ member, onClose }) => {
  return (
    <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
      {/* Bouton fermer */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl leading-none"
        aria-label="Fermer"
      >
        &times;
      </button>

      {/* En-tête avec OrgChartNode */}
      <div className="mb-6">
        <OrgChartNode
          avatarUrl={member.avatarUrl}
          name={member.name}
          title={member.title}
          department={member.department}
        />
      </div>

      {/* Détails complémentaires */}
      <div className="space-y-4 text-sm text-gray-700">
        {/* Exemple de champs supplémentaires */}
        <div>
          <h4 className="font-medium text-gray-900">Email</h4>
          <p>prenom.nom@entreprise.com</p>
        </div>
        <div>
          <h4 className="font-medium text-gray-900">Téléphone</h4>
          <p>+33 1 23 45 67 89</p>
        </div>
        {member.children && member.children.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900">Équipe directe</h4>
            <ul className="list-disc list-inside space-y-1">
              {member.children.map((c) => (
                <li key={c.id}>
                  <span className="font-medium">{c.name}</span> — {c.title}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailNode;
