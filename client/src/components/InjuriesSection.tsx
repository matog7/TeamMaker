import React, { useState, useEffect, useCallback } from "react";
import { Plus, AlertTriangle } from "lucide-react";
import type { Injury, InjuryCreate, PlayerUpdate } from "../interfaces";
import { injuryAPI } from "../services/api";
import NewInjuryModal from "./modals/NewInjuryModal";
import toast from "react-hot-toast";

interface InjuriesSectionProps {
  teamId: number;
  players: PlayerUpdate[];
}

const InjuriesSection: React.FC<InjuriesSectionProps> = ({
  teamId,
  players,
}) => {
  const [injuries, setInjuries] = useState<Injury[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInjury, setEditingInjury] = useState<Injury | null>(null);

  const load = useCallback(async () => {
    try {
      const injuriesList = await injuryAPI.getAll(teamId);
      setInjuries(injuriesList);
    } catch (error) {
      console.error("Erreur lors du chargement des blessures:", error);
      toast.error("Erreur lors du chargement des blessures");
    }
  }, [teamId]);

  useEffect(() => {
    if (teamId) {
      load();
    }
  }, [teamId, load]);

  const onCreateInjury = async (injuryData: InjuryCreate) => {
    try {
      const newInjury = await injuryAPI.create(injuryData);
      setInjuries((prev) => [newInjury, ...prev]);
      toast.success("Blessure ajoutée avec succès !", {
        duration: 3000,
        position: "top-right",
        style: {
          background: "#10B981",
          color: "#fff",
        },
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erreur lors de la création de la blessure:", error);
      toast.error("Erreur lors de la création de la blessure", {
        duration: 3000,
        position: "top-right",
        style: {
          background: "#EF4444",
          color: "#fff",
        },
      });
    }
  };

  const onUpdateInjury = async (
    id: number,
    injuryData: Partial<InjuryCreate>
  ) => {
    try {
      const updatedInjury = await injuryAPI.update(id, injuryData);
      setInjuries((prev) =>
        prev.map((injury) => (injury.id === id ? updatedInjury : injury))
      );
      toast.success("Blessure mise à jour avec succès !", {
        duration: 3000,
        position: "top-right",
        style: {
          background: "#10B981",
          color: "#fff",
        },
      });
      setIsModalOpen(false);
      setEditingInjury(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la blessure:", error);
      toast.error("Erreur lors de la mise à jour de la blessure", {
        duration: 3000,
        position: "top-right",
        style: {
          background: "#EF4444",
          color: "#fff",
        },
      });
    }
  };

  const onDeleteInjury = async (injuryId: number) => {
    try {
      await injuryAPI.delete(injuryId);
      setInjuries((prev) => prev.filter((injury) => injury.id !== injuryId));
      toast.success("Blessure supprimée avec succès !", {
        duration: 3000,
        position: "top-right",
        style: {
          background: "#10B981",
          color: "#fff",
        },
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de la blessure:", error);
      toast.error("Erreur lors de la suppression de la blessure", {
        duration: 3000,
        position: "top-right",
        style: {
          background: "#EF4444",
          color: "#fff",
        },
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          Blessures
        </h2>
        <button
          onClick={() => {
            setEditingInjury(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Ajouter
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {injuries.length === 0 ? (
          <div className="text-gray-400 text-sm text-center py-8">
            Aucune blessure enregistrée
          </div>
        ) : (
          <div className="space-y-3">
            {injuries.map((injury) => (
              <div
                key={injury.id}
                className="bg-gray-50/10 border-gray-200/20 rounded-lg border p-4 hover:bg-gray-200/20 hover:border-red-500/50 transition-colors relative group"
                onClick={() => {
                  setEditingInjury(injury);
                  setIsModalOpen(true);
                }}
              >
                {/* Bouton de suppression */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteInjury(injury.id);
                  }}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shadow-lg"
                  title="Supprimer la blessure"
                >
                  ×
                </button>

                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <div className="text-white font-medium">
                      {injury.injury}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {players.find((p) => p.player_id === injury.player_id)
                        ?.name || "Joueur inconnu"}
                    </div>
                    <div className="text-red-400 text-sm font-medium">
                      Durée: {injury.duration}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <NewInjuryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingInjury(null);
        }}
        onCreateInjury={onCreateInjury}
        onUpdateInjury={onUpdateInjury}
        injuryToEdit={editingInjury}
        players={players}
      />
    </div>
  );
};

export default InjuriesSection;
