import React from "react";
import type { Player } from "../interfaces";
import { Plus } from "lucide-react";
import Flag from "react-world-flags";
import { shortNationalities } from "../config/consts";

interface SubstitutesSectionProps {
  subs: Record<number, Player>;
  nbOfPlayers: number;
  onAddSubstitute: (index: number) => void;
  onPlayerClick: (index: number) => void;
}

const SubstitutesSection: React.FC<SubstitutesSectionProps> = ({
  subs,
  nbOfPlayers,
  onAddSubstitute,
  onPlayerClick,
}) => {
  return (
    <div className="bg-green-300/10 rounded-lg border border-gray-500/50 p-6 flex-1 flex flex-col border-dashed bg-blur-md">
      <div className="flex flex-row items-center justify-between mb-4">
        <h2 className="text-lg text-left font-semibold text-white">
          Remplaçants
        </h2>
        <button
          onClick={() => onAddSubstitute(nbOfPlayers + 1)}
          className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          <Plus className="w-4 h-4" />
          Ajouter un remplaçant
        </button>
      </div>
      {Object.keys(subs).length === 0 ? (
        <div className="flex flex-col items-center justify-center">
          <div className="text-gray-400 text-sm text-center py-8">
            Aucun remplaçant
          </div>
        </div>
      ) : (
        <div className="w-full grid grid-cols-2 gap-3 overflow-y-auto flex-1 justify-center items-center">
          {Object.values(subs)
            .filter(
              (player) => player.position_order && player.position_order < 100
            )
            .map((player) => (
              <div
                key={player.id}
                className="group bg-gray-50/10 rounded-lg border p-4 cursor-pointer hover:bg-gray-200/20 hover:border-[#03af62] transition-colors relative border-gray-200/20"
                onClick={() => onPlayerClick(player.id)}
              >
                <div className="flex flex-row items-center gap-3">
                  {player.photo ? (
                    <img
                      src={`/uploads/${player.photo}`}
                      alt={player.name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200/20"
                    />
                  ) : (
                    <div className="min-w-10 min-h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 text-sm">
                      {(player.name || "J")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                  )}
                  <div className="absolute text-xs font-bold text-[#79eea5]/20 top-0 left-1 items-center justify-center">
                    #{player.position_order}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white text-sm truncate">
                      {player.name || "Joueur sans nom"}
                      {player.is_captain && (
                        <span className="text-orange-500 ml-1">(C)</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {player.nationality && (
                        <Flag
                          code={shortNationalities[player.nationality]}
                          className="w-4 h-4"
                        />
                      )}
                      <span className="text-gray-400 text-xs">
                        {player.position}
                      </span>
                      <span className="text-gray-400 text-xs">
                        - {player.age} ans
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="flex justify-center gap-1 text-xs">
                      <span
                        className={`px-2 py-1 rounded-full text-white font-medium ${
                          (player.rating || 0) > 80
                            ? "bg-green-700"
                            : (player.rating || 0) > 70 &&
                              (player.rating || 0) <= 80
                            ? "bg-green-500"
                            : (player.rating || 0) > 65 &&
                              (player.rating || 0) <= 70
                            ? "bg-yellow-400"
                            : (player.rating || 0) > 60 &&
                              (player.rating || 0) <= 65
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      >
                        {player.rating || 0}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-white font-medium ${
                          (player.potential || 0) >= 80
                            ? "bg-green-700"
                            : (player.potential || 0) > 70 &&
                              (player.potential || 0) <= 80
                            ? "bg-green-500"
                            : (player.potential || 0) > 65 &&
                              (player.potential || 0) <= 70
                            ? "bg-yellow-400"
                            : (player.potential || 0) > 60 &&
                              (player.potential || 0) <= 65
                            ? "bg-yellow-500"
                            : (player.potential || 0) >= 50 &&
                              (player.potential || 0) < 60
                            ? "bg-orange-500"
                            : "bg-red-500"
                        }`}
                      >
                        {player.potential || 0}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Bouton de suppression au hover */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // onRemovePlayer(idx);
                  }}
                  className="absolute top-0.5 right-0.5 opacity-1 group-hover:opacity-100 transition-opacity duration-200 bg-red-500 hover:bg-red-600 text-white rounded-full w-2 h-2 flex items-center justify-center text-xs font-bold shadow-lg"
                  title="Supprimer le joueur"
                >
                  ×
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default SubstitutesSection;
