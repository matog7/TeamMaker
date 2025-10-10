import React from "react";
import type { Player } from "../interfaces";

interface SubstitutesSectionProps {
  subs: Record<number, Player>;
}

const SubstitutesSection: React.FC<SubstitutesSectionProps> = ({ subs }) => {
  return (
    <div className="bg-green-300/10 rounded-lg border border-gray-500/50 p-6 flex-1 flex flex-col border-dashed bg-blur-md">
      <h2 className="text-lg text-left font-semibold text-white mb-4">
        Remplaçants
      </h2>
      {Object.keys(subs).length === 0 ? (
        <div className="text-gray-400 text-sm text-center py-8">
          Aucun remplaçant
        </div>
      ) : (
        <div className="w-full grid grid-cols-2 gap-3 overflow-y-auto flex-1 justify-center items-center">
          {Object.values(subs).map((player) => (
            <div key={player.id}>{player.name}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubstitutesSection;
