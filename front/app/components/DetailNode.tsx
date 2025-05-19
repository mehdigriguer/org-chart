"use client";

import React from "react";
import type { OrgMember } from "../data/orgChartData";
import OrgChartNode from "./OrgChartNode";

interface DetailNodeProps {
  member: OrgMember & { phone?: string; email?: string };
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
          location={member.location}
        />
      </div>

      {/* Détails complémentaires */}
      <div className="space-y-4 text-sm text-gray-700">
        {member.email && (
          <div>
            <h4 className="font-medium text-gray-900">Email</h4>
            <p>{member.email}</p>
          </div>
        )}
        {member.phone && (
          <div>
            <h4 className="font-medium text-gray-900">Téléphone</h4>
            <p>{member.phone}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailNode;
