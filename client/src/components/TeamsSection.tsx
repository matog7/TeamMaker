import React from "react";
import moment from "moment";
import { CaptionsOff } from "lucide-react";
import type { Team } from "../interfaces";

interface TeamsSectionProps {
  teams: Team[];
  selectedTeam: Team | null;
  onTeamSelect: (team: Team) => void;
  onNewTeamClick: () => void;
  onUpdateTeamClick: (team: Team) => void;
  onDeselectTeam: () => void;
}

const TeamsSection: React.FC<TeamsSectionProps> = ({
  teams,
  selectedTeam,
  onTeamSelect,
  onNewTeamClick,
  onUpdateTeamClick,
  onDeselectTeam,
}) => {
  return (
    <div className="bg-green-300/10 rounded-lg border border-gray-500/50 p-6 border-dashed bg-blur-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Équipes</h2>
        {selectedTeam ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateTeamClick(selectedTeam)}
              className="bg-black/80 text-sm text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 cursor-pointer transition-colors"
            >
              Mettre à jour équipe
            </button>
            <CaptionsOff
              className="w-6 h-6 hover:text-[#03af62] cursor-pointer transition-colors"
              onClick={onDeselectTeam}
            />
          </div>
        ) : (
          <button
            onClick={onNewTeamClick}
            className="bg-black/80 text-sm text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 cursor-pointer transition-colors"
          >
            + Nouvelle équipe
          </button>
        )}
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {teams.map((team) => (
          <button
            key={team.id}
            onClick={() => onTeamSelect(team)}
            className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${
              selectedTeam?.id === team.id ? "isHighlighted" : "notHighlighted"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{team.name}</span>
              <div className="flex items-center gap-2">
                {team.updated_at ? (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    {moment(team.updated_at).format("DD MMMM YYYY à HH:mm")}
                  </span>
                ) : (
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                    Vide
                  </span>
                )}
              </div>
            </div>
            {selectedTeam?.id === team.id && (
              <div className="text-sm text-gray-400">
                {selectedTeam?.formation_id}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TeamsSection;
