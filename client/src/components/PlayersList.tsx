import React from "react";
import type { Player, Team, FormationWithPositions } from "../interfaces";

interface PlayersListProps {
  players: Record<number, Player>;
  selectedTeam: Team | null;
  selectedFormation: FormationWithPositions | null;
  onPlayerClick: (index: number) => void;
  onSaveTeam: () => void;
}

const PlayersList: React.FC<PlayersListProps> = ({
  players,
  selectedTeam,
  selectedFormation,
  onPlayerClick,
  onSaveTeam,
}) => {
  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <h2 className="text-lg text-left font-semibold text-white mb-4">
        {selectedTeam
          ? `Joueurs - ${selectedTeam.name}`
          : "Joueurs sur le terrain"}
      </h2>
      <div className="w-full grid grid-cols-2 gap-3 overflow-y-auto flex-1">
        {selectedFormation?.positions.map((_, idx) => {
          const player = players[idx];
          if (!player) return null;
          return (
            <div
              key={idx}
              className={`bg-gray-50/10 rounded-lg border p-4 cursor-pointer hover:bg-gray-200/20 hover:border-[#03af62] transition-colors ${
                players[idx]?.is_captain
                  ? "border-orange-300/20 bg-orange-500/10"
                  : "border-gray-200/20"
              }`}
              onClick={() => onPlayerClick(idx)}
            >
              <div className="flex flex-row items-center gap-3">
                {player.photo ? (
                  <img
                    src={player.photo}
                    alt={player.name}
                    className="w-10 h-10 rounded-full object-cover border border-gray-300"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 text-sm">
                    {(player.name || "J")
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                )}
                <div className="text-center">
                  <div className="font-semibold text-white text-sm">
                    {player.name || "Joueur sans nom"}
                    {player.is_captain && (
                      <span className="text-orange-500 ml-1">(C)</span>
                    )}
                  </div>
                </div>
                <div className="flex-1 flex flex-row items-center justify-end">
                  <div className="flex justify-center gap-1 text-xs">
                    <span
                      className={`px-2 py-1 rounded-full text-white font-medium ${
                        (player.rating || 0) >= 80
                          ? "bg-green-600"
                          : (player.rating || 0) >= 70
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    >
                      {player.rating || 0}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-white font-medium ${
                        (player.potential || 0) >= 80
                          ? "bg-green-600"
                          : (player.potential || 0) >= 70
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    >
                      {player.potential || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {Object.keys(players).length === 0 && (
          <div className="col-span-2 text-gray-400 text-sm text-center py-8">
            Aucun joueur ajouté
          </div>
        )}
      </div>
      <div className="w-full flex justify-center mt-6 pt-4 border-t border-gray-200/10 border-dashed">
        <button
          onClick={onSaveTeam}
          className="bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-green-700 transition-colors"
        >
          {selectedTeam ? "Mettre à jour équipe" : "Sauvegarder équipe"}
        </button>
      </div>
    </div>
  );
};

export default PlayersList;
