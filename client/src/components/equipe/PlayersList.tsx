import React from "react";
import type { Player, Team, FormationWithPositions } from "../../interfaces";
import { shortNationalities } from "../../config/consts";
import { getRatingColor } from "../../utils/ratingColors";
import Flag from "react-world-flags";
import { GiTeamDowngrade } from "react-icons/gi";

interface PlayersListProps {
  players: Record<number, Player>;
  selectedTeam: Team | null;
  selectedFormation: FormationWithPositions | null;
  onPlayerClick: (index: number) => void;
  onRemovePlayer: (index: number) => void;
  onSaveTeam: () => void;
}

const PlayersList: React.FC<PlayersListProps> = ({
  players,
  selectedTeam,
  selectedFormation,
  onPlayerClick,
  onRemovePlayer,
  onSaveTeam,
}) => {
  return (
    <div className="flex-1 flex flex-col ">
      <div className="flex flex-row items-center mb-4 gap-2">
        <GiTeamDowngrade className="w-5 h-5 text-green-300" />
        <h2 className="text-lg text-left font-semibold text-white">
          {selectedTeam
            ? `Joueurs - ${selectedTeam.name}`
            : "Joueurs sur le terrain"}
        </h2>
      </div>
      <div className="w-full grid grid-cols-2 gap-3 overflow-y-auto flex-1 justify-center items-center">
        {selectedFormation?.positions.map((_, idx) => {
          const player = players[idx];
          if (!player) return null;
          return (
            <div
              key={idx}
              className={`group  ${
                players[idx]?.is_loaned
                  ? "bg-blue-500/10"
                  : players[idx]?.arrived_in_course
                  ? "bg-green-500/10"
                  : players[idx]?.is_promoted
                  ? "bg-yellow-500/10"
                  : "bg-gray-50/10"
              } rounded-lg border p-4 cursor-pointer hover:bg-gray-200/20 hover:border-[#03af62] transition-colors relative ${
                players[idx]?.is_captain
                  ? "border-orange-300/20 bg-orange-500/10"
                  : players[idx]?.is_loaned
                  ? "border-blue-500/50"
                  : players[idx]?.arrived_in_course
                  ? "border-green-500/50"
                  : players[idx]?.is_promoted
                  ? "border-yellow-500/50"
                  : "border-gray-200/20"
              }`}
              onClick={() => onPlayerClick(idx)}
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
                  #{idx + 1}
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
                      className={`px-2 py-1 rounded-full text-white font-medium ${getRatingColor(
                        player.rating
                      )}`}
                    >
                      {player.rating || 0}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-white font-medium ${getRatingColor(
                        player.potential
                      )}`}
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
                  onRemovePlayer(idx);
                }}
                className="absolute top-0.5 right-0.5 opacity-1 group-hover:opacity-100 transition-opacity duration-200 bg-red-500 hover:bg-red-600 text-white rounded-full w-2 h-2 flex items-center justify-center text-xs font-bold shadow-lg"
                title="Supprimer le joueur"
              >
                ×
              </button>
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
