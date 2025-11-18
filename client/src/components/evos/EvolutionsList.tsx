import React, { useState, useEffect, useCallback } from "react";
import type { Evolution, Player, PlayerUpdate, Team } from "../../interfaces";
import { evolutionAPI } from "../../services/api";
import { getRatingColor } from "../../utils/ratingColors";
// import { GiChartUp } from "react-icons/gi";
import EvolutionModal from "../modals/EvolutionModal";
import { Pencil } from "lucide-react";

interface EvolutionsListProps {
  players: Record<number, Player>;
  selectedTeam: Team | null;
}

const EvolutionsList: React.FC<EvolutionsListProps> = ({
  players,
  selectedTeam,
}) => {
  const [evolutions, setEvolutions] = useState<Evolution[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvolution, setEditingEvolution] = useState<Evolution | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  // Charger les évolutions
  const loadEvolutions = useCallback(async () => {
    if (!selectedTeam) return;

    setLoading(true);
    try {
      const data = await evolutionAPI.getAll(selectedTeam.id);
      setEvolutions(data);
    } catch (error) {
      console.error("Erreur lors du chargement des évolutions:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedTeam]);

  useEffect(() => {
    loadEvolutions();
  }, [selectedTeam, loadEvolutions]);

  // Ouvrir la modale pour créer une nouvelle évolution
  const handleCreateEvolution = () => {
    setEditingEvolution(null);
    setIsModalOpen(true);
  };

  // Ouvrir la modale pour modifier une évolution
  const handleEditEvolution = (evolution: Evolution) => {
    setEditingEvolution(evolution);
    setIsModalOpen(true);
  };

  // Fermer la modale
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEvolution(null);
  };

  // Soumettre une évolution (création ou modification)
  const handleSubmitEvolution = async (evolutionData: {
    player_id: number;
    start_rating: number;
    end_rating: number;
    potential: number;
  }) => {
    if (!selectedTeam) return;

    try {
      if (editingEvolution) {
        // Mise à jour
        await evolutionAPI.update(editingEvolution.id, {
          start_rating: evolutionData.start_rating,
          end_rating: evolutionData.end_rating,
          potential: evolutionData.potential,
        });
      } else {
        // Création
        await evolutionAPI.create({
          team_id: selectedTeam.id,
          player_id: evolutionData.player_id,
          start_rating: evolutionData.start_rating,
          end_rating: evolutionData.end_rating,
          potential: evolutionData.potential,
        });
      }

      // Recharger les évolutions
      await loadEvolutions();
      handleCloseModal();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'évolution:", error);
      alert("Erreur lors de la sauvegarde de l'évolution");
    }
  };

  // Supprimer une évolution
  const handleDeleteEvolution = async (evolutionId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette évolution ?")) {
      return;
    }

    try {
      await evolutionAPI.delete(evolutionId);
      await loadEvolutions();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'évolution:", error);
      alert("Erreur lors de la suppression de l'évolution");
    }
  };

  // Obtenir les informations du joueur
  const getPlayerInfo = (playerId: number) => {
    const player = Object.values(players).find(
      (player: PlayerUpdate) => player.player_id === playerId
    );
    return player || null;
  };

  // Calculer la différence de note
  const getRatingDifference = (start: number, end: number) => {
    const diff = end - start;
    return diff > 0 ? `+${diff}` : diff.toString();
  };

  if (!selectedTeam) {
    return (
      <div className="flex-1 flex flex-col">
        <div className="flex flex-row items-center mb-4 gap-2">
          {/* <GiChartUp className="w-5 h-5 text-green-300" /> */}
          <h2 className="text-lg text-left font-semibold text-white">
            Évolutions
          </h2>
        </div>
        <div className="text-gray-400 text-sm text-center py-8">
          Veuillez sélectionner une équipe pour voir les évolutions
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex flex-row items-center justify-between mb-4">
        <div className="flex flex-row items-center gap-2">
          {/* <GiChartUp className="w-5 h-5 text-green-300" /> */}
          <h2 className="text-lg text-left font-semibold text-white">
            Évolutions - {selectedTeam.name}
          </h2>
        </div>
        <button
          onClick={handleCreateEvolution}
          className="bg-blue-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-blue-700 transition-colors text-sm"
        >
          + Ajouter une évolution
        </button>
      </div>

      {loading ? (
        <div className="text-gray-400 text-sm text-center py-8">
          Chargement des évolutions...
        </div>
      ) : evolutions.length === 0 ? (
        <div className="text-gray-400 text-sm text-center py-8">
          Aucune évolution enregistrée
        </div>
      ) : (
        <div className="w-full grid grid-cols-1 gap-3 overflow-y-auto flex-1">
          {evolutions.map((evolution) => {
            const player = getPlayerInfo(evolution.player_id);
            const ratingDiff = getRatingDifference(
              evolution.start_rating,
              evolution.end_rating
            );

            return (
              <div
                key={evolution.id}
                className="group bg-gray-50/10 rounded-lg border border-gray-200/20 p-4 hover:bg-gray-200/20 hover:border-[#03af62] transition-colors relative cursor-pointer"
                onClick={() => handleEditEvolution(evolution)}
              >
                <div className="flex flex-row items-center gap-3">
                  {player?.photo ? (
                    <img
                      src={`/uploads/${player.photo}`}
                      alt={player.name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200/20"
                    />
                  ) : (
                    <div className="min-w-10 min-h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 text-sm">
                      {(player?.name || "J")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white text-sm">
                      {player?.name || "Joueur inconnu"}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {player?.position} - {player?.age} ans
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <span
                        className={`px-2 py-1 rounded-full text-white font-medium text-xs ${getRatingColor(
                          evolution.start_rating
                        )}`}
                      >
                        {evolution.start_rating}
                      </span>
                      <span className="text-gray-400 text-xs">→</span>
                      <span
                        className={`px-2 py-1 rounded-full text-white font-medium text-xs ${getRatingColor(
                          evolution.end_rating
                        )}`}
                      >
                        {evolution.end_rating}
                      </span>
                      <span
                        className={`text-xs font-medium ${
                          parseInt(ratingDiff) > 0
                            ? "text-green-400"
                            : parseInt(ratingDiff) < 0
                            ? "text-red-400"
                            : "text-gray-400"
                        }`}
                      >
                        ({ratingDiff})
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-gray-400 text-xs">Pot:</span>
                      <span
                        className={`px-2 py-1 rounded-full text-white font-medium text-xs ${getRatingColor(
                          evolution.potential
                        )}`}
                      >
                        {evolution.potential}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Boutons d'action au hover */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                  <button
                    onClick={() => handleDeleteEvolution(evolution.id)}
                    className="bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg"
                    title="Supprimer l'évolution"
                  >
                    ×
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modale pour créer/modifier une évolution */}
      <EvolutionModal
        isOpen={isModalOpen}
        evolution={editingEvolution}
        players={players}
        selectedTeam={selectedTeam}
        onClose={handleCloseModal}
        onSubmit={handleSubmitEvolution}
      />
    </div>
  );
};

export default EvolutionsList;
