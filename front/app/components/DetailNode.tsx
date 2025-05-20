// DetailMembre.tsx

"use client";

import React from "react";
import type { Membre } from "../types/Membre";
import OrgChartNode from "./OrgChartNode";

interface DetailNodeProps {
  membre: Membre;
  onClose: () => void;
}

const DetailNode: React.FC<DetailNodeProps> = ({ membre, onClose }) => {
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
        <OrgChartNode membre={membre} />
      </div>

      {/* Détails complémentaires */}
      <div className="space-y-4 text-sm text-gray-700">
        {membre.email && (
          <div>
            <h4 className="font-medium text-gray-900">Email</h4>
            <p>{membre.email}</p>
          </div>
        )}
        {membre.telephone && (
          <div>
            <h4 className="font-medium text-gray-900">Téléphone</h4>
            <p>{membre.telephone}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailNode;
