import React from "react";
import type { Competition } from "../interfaces";
import { Plus, Trophy, Calendar, Target, Users } from "lucide-react";

interface CompetitionSelectorProps {
    competitions: Competition[];
    selectedCompetition: Competition | null;
    onCompetitionSelect: (competition: Competition | null) => void;
    onNewCompetition: () => void;
}

const CompetitionSelector: React.FC<CompetitionSelectorProps> = ({
    competitions,
    selectedCompetition,
    onCompetitionSelect,
    onNewCompetition,
}) => {

    const getCompetitionIcon = (type: Competition["type"]) => {
        switch (type) {
            case "league":
                return <Trophy className="w-4 h-4" />;
            case "cup":
                return <Target className="w-4 h-4" />;
            case "championship":
                return <Users className="w-4 h-4" />;
            case "friendly":
                return <Calendar className="w-4 h-4" />;
            default:
                return <Trophy className="w-4 h-4" />;
        }
    };

    const getCompetitionTypeLabel = (type: Competition["type"]) => {
        switch (type) {
            case "league":
                return "Championnat";
            case "cup":
                return "Coupe";
            case "championship":
                return "Championnat";
            case "friendly":
                return "Amical";
            default:
                return type;
        }
    };

    return (
        <div className="bg-green-300/10 rounded-lg border border-gray-500/50 p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Compétitions</h3>
                <button
                    onClick={onNewCompetition}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Nouvelle
                </button>
            </div>

            <div className="space-y-2">
                {/* Option "Toutes les compétitions" */}
                <div
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${!selectedCompetition
                        ? "bg-green-600/30 border border-green-500"
                        : "bg-gray-700/30 hover:bg-gray-600/30"
                        }`}
                    onClick={() => onCompetitionSelect({
                        id: 0,
                        name: "Toutes les compétitions",
                        season: "",
                        type: "league",
                        created_at: "",
                        updated_at: "",
                    })}
                >
                    <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-green-400" />
                        <div>
                            <div className="text-white font-medium">Toutes les compétitions</div>
                            <div className="text-gray-400 text-xs">Vue d'ensemble</div>
                        </div>
                    </div>
                </div>

                {/* Liste des compétitions */}
                {competitions.map((competition) => (
                    <div
                        key={competition.id}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${selectedCompetition?.id === competition.id
                            ? "bg-green-600/30 border border-green-500"
                            : "bg-gray-700/30 hover:bg-gray-600/30"
                            }`}
                        onClick={() => onCompetitionSelect(competition)}
                    >
                        <div className="flex items-center gap-2">
                            {getCompetitionIcon(competition.type)}
                            <div>
                                <div className="text-white font-medium">{competition.name}</div>
                                <div className="text-gray-400 text-xs">
                                    {getCompetitionTypeLabel(competition.type)} • {competition.season}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {competitions.length === 0 && (
                    <div className="text-gray-400 text-center py-4">
                        Aucune compétition créée
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompetitionSelector;
