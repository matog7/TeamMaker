import React, { useState, useEffect } from "react";
import type { PlayerUpdate, PlayerStats, Competition } from "../interfaces";
import { Save, Edit3, Trophy } from "lucide-react";
import toast from "react-hot-toast";
import { playerStatsAPI } from "../services/api";

interface PlayerStatsTableProps {
    players: Record<number, PlayerUpdate>;
    subs: Record<number, PlayerUpdate>;
    selectedCompetition: Competition | null;
    onStatsUpdate: (playerId: number, stats: Partial<PlayerStats>) => void;
}

interface EditableCellProps {
    value: number | undefined;
    onUpdate: (value: number) => void;
    isEditing: boolean;
    onToggleEdit: () => void;
    isBest?: boolean;
}

const EditableCell: React.FC<EditableCellProps> = ({
    value,
    onUpdate,
    isEditing,
    onToggleEdit,
    isBest = false
}) => {
    const [tempValue, setTempValue] = useState(value?.toString() || "");

    useEffect(() => {
        setTempValue(value?.toString() || "");
    }, [value]);

    const handleSave = () => {
        const numValue = parseInt(tempValue) || 0;
        onUpdate(numValue);
        onToggleEdit();
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSave();
        } else if (e.key === "Escape") {
            setTempValue(value?.toString() || "");
            onToggleEdit();
        }
    };

    // Styles conditionnels
    const getCellStyles = () => {
        if (isBest) {
            return "bg-yellow-500/20 border border-yellow-400/50";
        }
        return "hover:bg-green-300/10";
    };

    const getTextStyles = () => {
        if (isBest) {
            return "text-yellow-300 font-semibold";
        }
        return "text-white";
    };

    if (isEditing) {
        return (
            <input
                type="number"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyPress}
                className={`w-full px-2 py-1 text-center bg-green-300/20 border border-green-500 rounded text-white text-sm ${getCellStyles()}`}
                autoFocus
            />
        );
    }

    return (
        <div
            className={`flex items-center justify-center gap-1 px-2 py-1 rounded ${getCellStyles()} cursor-pointer`}
            onClick={onToggleEdit}
        >
            <span className={`text-sm ${getTextStyles()}`}>{value || 0}</span>
            <Edit3 className="w-3 h-3 text-green-400 opacity-0 group-hover:opacity-100" />
        </div>
    );
};

const PlayerStatsTable: React.FC<PlayerStatsTableProps> = ({
    players,
    subs,
    selectedCompetition,
    onStatsUpdate
}) => {
    const [editingCell, setEditingCell] = useState<{ playerId: number, stat: string } | null>(null);
    const [playerStats, setPlayerStats] = useState<Record<number, PlayerStats>>({});
    const [isSaving, setIsSaving] = useState(false);

    // Fonction pour fusionner les joueurs
    const getAllPlayers = () => {
        const allPlayers = { ...players };
        let nextIndex = Object.keys(players).length;
        Object.values(subs).forEach((player) => {
            allPlayers[nextIndex] = player;
            nextIndex++;
        });
        return allPlayers;
    };

    // Initialiser les stats pour chaque joueur
    useEffect(() => {
        const allPlayers = getAllPlayers();
        const fetchStats = async () => {
            try {
                const getStats: PlayerStats[] = await playerStatsAPI.getAllStats(allPlayers, selectedCompetition?.id);
                console.log("les stats récupérées", getStats);

                const initialStats: Record<number, PlayerStats> = {};

                // D'abord, initialiser tous les joueurs avec des valeurs par défaut
                Object.values(allPlayers).forEach((player) => {
                    const playerId = player.player_id || player.id;
                    if (playerId && playerId !== 0) {
                        initialStats[playerId] = {
                            player_id: playerId,
                            competition_id: selectedCompetition?.id,
                            matches_played: 0,
                            goals: 0,
                            assists: 0,
                        };
                    }
                });

                // Ensuite, mettre à jour avec les stats existantes
                getStats.forEach((stat: PlayerStats) => {
                    const playerId = stat.player_id;
                    if (playerId && initialStats[playerId]) {
                        initialStats[playerId] = {
                            ...initialStats[playerId],
                            ...stat,
                        };
                    }
                });

                console.log("stats finales", initialStats);
                setPlayerStats(initialStats);
            } catch (error) {
                console.error("Erreur lors de la récupération des statistiques:", error);
                // En cas d'erreur, initialiser avec des valeurs par défaut
                const defaultStats: Record<number, PlayerStats> = {};
                Object.values(allPlayers).forEach((player) => {
                    const playerId = player.player_id || player.id;
                    if (playerId && playerId !== 0) {
                        defaultStats[playerId] = {
                            player_id: playerId,
                            competition_id: selectedCompetition?.id,
                            matches_played: 0,
                            goals: 0,
                            assists: 0,
                        };
                    }
                });
                setPlayerStats(defaultStats);
            }
        };
        fetchStats();
    }, [players, subs, selectedCompetition]);

    const handleStatUpdate = (playerId: number, stat: string, value: number) => {
        console.log("le joueur", playerId, stat, value);
        setPlayerStats(prev => ({
            ...prev,
            [playerId]: {
                ...prev[playerId],
                [stat]: value
            }
        }));
        onStatsUpdate(playerId, { [stat]: value });
    };

    const toggleEdit = (playerId: number, stat: string) => {
        setEditingCell(editingCell?.playerId === playerId && editingCell?.stat === stat ? null : { playerId, stat });
    };

    const handleSaveStats = async () => {
        setIsSaving(true);
        try {
            const allPlayers = getAllPlayers();
            const statsToSave: PlayerStats[] = [];

            // Préparer les statistiques à sauvegarder
            Object.values(allPlayers).forEach((player) => {
                const playerId = player.player_id || player.id;
                if (playerId && playerId !== 0 && playerStats[playerId]) {
                    const stats = playerStats[playerId];
                    // Ne sauvegarder que si les stats ont des valeurs > 0
                    if ((stats.matches_played || 0) > 0 || (stats.goals || 0) > 0 || (stats.assists || 0) > 0) {
                        statsToSave.push({
                            ...stats,
                            team_id: player.team_id,
                            competition_id: selectedCompetition?.id,
                        });
                    }
                }
            });

            if (statsToSave.length > 0) {
                console.log("Sauvegarde des statistiques:", statsToSave);
                await playerStatsAPI.saveMultipleStats(statsToSave);

                toast.success("Statistiques sauvegardées avec succès !", {
                    duration: 3000,
                    position: "top-right",
                    style: {
                        background: "#10B981",
                        color: "#fff",
                    },
                });
            } else {
                toast.error("Aucune statistique à sauvegarder", {
                    duration: 2000,
                    position: "top-right",
                    style: {
                        background: "#EF4444",
                        color: "#fff",
                    },
                });
            }
        } catch (error) {
            console.error("Erreur lors de la sauvegarde:", error);
            toast.error("Erreur lors de la sauvegarde des statistiques", {
                duration: 3000,
                position: "top-right",
                style: {
                    background: "#EF4444",
                    color: "#fff",
                },
            });
        } finally {
            setIsSaving(false);
        }
    };

    const statsColumns = [
        { key: "matches_played", label: "Matchs", width: "w-16" },
        { key: "goals", label: "Buts", width: "w-16" },
        { key: "assists", label: "Passes D", width: "w-16" },
    ];

    const allPlayers = getAllPlayers();

    // Calculer les meilleures statistiques pour la mise en valeur
    const getBestStats = () => {
        const stats = Object.values(playerStats);
        if (stats.length === 0) {
            return { matches_played: 0, goals: 0, assists: 0 };
        }
        return {
            matches_played: Math.max(...stats.map(s => s.matches_played || 0)),
            goals: Math.max(...stats.map(s => s.goals || 0)),
            assists: Math.max(...stats.map(s => s.assists || 0)),
        };
    };

    const bestStats = getBestStats();


    if (Object.keys(allPlayers).length === 0) {
        return (
            <div className="text-gray-400 text-center py-8">
                Aucun joueur dans l'équipe
            </div>
        );
    }

    return (
        <div className="bg-green-300/10 rounded-lg border border-gray-500/50 p-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <Trophy className="w-5 h-5 text-green-300" />
                    <div>
                        <h3 className="text-lg font-semibold text-white">Statistiques des Joueurs</h3>
                        {selectedCompetition ? (
                            <p className="text-sm text-gray-400">
                                {selectedCompetition.name}
                            </p>
                        ) : (
                            <p className="text-sm text-gray-400">Toutes les compétitions</p>
                        )}
                    </div>
                </div>
                <button
                    onClick={handleSaveStats}
                    disabled={isSaving}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${isSaving
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700 text-white"
                        }`}
                >
                    <Save className="w-4 h-4" />
                    {isSaving ? "Sauvegarde..." : "Sauvegarder"}
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-600">
                            <th className="text-left py-2 px-2 text-white font-medium sticky left-0 bg-green-300/20">
                                Joueur
                            </th>
                            {statsColumns.map((column) => (
                                <th key={column.key} className={`text-center py-2 px-1 text-white font-medium ${column.width}`}>
                                    {column.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.values(allPlayers).map((player) => {
                            const playerId = player.player_id || player.id;
                            if (!playerId || playerId === 0) return null;

                            const stats = playerStats[playerId];
                            const isEditing = editingCell?.playerId === playerId;

                            return (
                                <tr key={player.id} className="border-b border-gray-700/50 hover:bg-green-300/5 group ">
                                    <td className="sticky left-0 bg-green-300/10 py-2 px-2">
                                        <div className="flex items-center gap-2">
                                            {player.photo ? (
                                                <img
                                                    src={`/uploads/${player.photo}`}
                                                    alt={player.name}
                                                    className="w-6 h-6 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-xs text-white">
                                                    {player.name?.charAt(0) || "?"}
                                                </div>
                                            )}
                                            <div>
                                                <div className="text-white text-sm font-medium">
                                                    {player.name}
                                                </div>
                                                <div className="text-gray-400 text-xs">
                                                    {player.position} • {player.rating}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    {statsColumns.map((column) => {
                                        const cellValue = stats?.[column.key as keyof PlayerStats] as number || 0;
                                        const isBest = cellValue === bestStats[column.key as keyof typeof bestStats] && cellValue > 0;

                                        return (
                                            <td key={column.key} className="py-1">
                                                <EditableCell
                                                    value={cellValue}
                                                    onUpdate={(value) => handleStatUpdate(playerId, column.key, value)}
                                                    isEditing={isEditing && editingCell?.stat === column.key}
                                                    onToggleEdit={() => toggleEdit(playerId, column.key)}
                                                    isBest={isBest}
                                                />
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PlayerStatsTable;
