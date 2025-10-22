import React, { useState, useEffect } from "react";
import {
  Check,
  Plus,
  Trash2,
  Target,
  Cctv,
  CircleDotDashed,
} from "lucide-react";
import type { Objective, ObjectiveCreate, ObjectiveCategory } from "../../interfaces";
import { objectiveAPI } from "../../services/api";
import toast from "react-hot-toast";

interface ObjectivesSectionProps {
  teamId?: number;
}

interface NewObjectiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (objective: ObjectiveCreate) => void;
  teamId?: number;
}

const NewObjectiveModal: React.FC<NewObjectiveModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  teamId,
}) => {
  const [formData, setFormData] = useState<ObjectiveCreate>({
    title: "",
    description: "",
    priority: "medium",
    category: "general",
    team_id: teamId,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Le titre est requis");
      return;
    }
    onSubmit(formData);
    setFormData({
      title: "",
      description: "",
      priority: "medium",
      category: "general",
      team_id: teamId,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50  flex items-center justify-center z-50">
      <div className="bg-green-300/10 backdrop-blur-md border-2 border-gray-500/50 rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-xl font-bold text-white mb-4">Nouvel Objectif</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Titre *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-2 py-1 border-b border-gray-300/50 text-[#79eea5] focus:border-[#03af62] focus:outline-none"
              placeholder="Titre de l'objectif"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-2 py-1 border border-gray-300/50 text-[#79eea5] rounded-md focus:outline-none focus:border-[#03af62]"
              placeholder="Description de l'objectif (optionnel)"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Priorité
              </label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority: e.target.value as "low" | "medium" | "high",
                  })
                }
                className="w-full px-3 py-2 bg-black/70 border border-gray-300/50 rounded-md text-[#79eea5] focus:outline-none focus:ring-1 focus:ring-green-300"
              >
                <option value="low">Faible</option>
                <option value="medium">Moyenne</option>
                <option value="high">Élevée</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Catégorie
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value as ObjectiveCategory,
                  })
                }
                className="w-full px-3 py-2 bg-black/70 border border-gray-300/50 rounded-md text-[#79eea5] focus:outline-none focus:ring-1 focus:ring-green-300"
              >
                <option value="general">Général</option>
                <option value="team">Équipe</option>
                <option value="player">Joueur</option>
                <option value="transfer">Transfert</option>
                <option value="competition">Compétition</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ObjectivesSection: React.FC<ObjectivesSectionProps> = ({ teamId }) => {
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [loading, setLoading] = useState(true);
  const [newObjectiveModalOpen, setNewObjectiveModalOpen] = useState(false);

  const fetchObjectives = async () => {
    try {
      setLoading(true);
      const teamObjectives = teamId ? await objectiveAPI.getByTeam(teamId) : [];

      setObjectives(teamObjectives);
    } catch (error) {
      console.error("Erreur lors du chargement des objectifs:", error);
      toast.error("Erreur lors du chargement des objectifs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchObjectives();
  }, [teamId]);

  const handleCreateObjective = async (objectiveData: ObjectiveCreate) => {
    try {
      const newObjective = await objectiveAPI.create(objectiveData);

      if (objectiveData.team_id) {
        setObjectives((prev) => [...prev, newObjective]);
        toast.success("Objectif créé avec succès !");
      }

      setNewObjectiveModalOpen(false);
    } catch (error) {
      console.error("Erreur lors de la création de l'objectif:", error);
      toast.error("Erreur lors de la création de l'objectif");
    }
  };

  const handleToggleComplete = async (objective: Objective) => {
    try {
      const updatedObjective = await objectiveAPI.update(objective.id, {
        completed: !objective.completed,
      });

      if (objective.team_id) {
        setObjectives((prev) =>
          prev.map((obj) => (obj.id === objective.id ? updatedObjective : obj))
        );
        toast.success(
          `Objectif ${updatedObjective.completed ? "complété" : "réactivé"} !`
        );
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'objectif:", error);
      toast.error("Erreur lors de la mise à jour de l'objectif");
    }
  };

  const handleDeleteObjective = async (objective: Objective) => {
    // if (!confirm('Êtes-vous sûr de vouloir supprimer cet objectif ?')) {
    //     return;
    // }

    try {
      await objectiveAPI.delete(objective.id);

      if (objective.team_id) {
        setObjectives((prev) => prev.filter((obj) => obj.id !== objective.id));
        toast.success("Objectif supprimé avec succès !");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'objectif:", error);
      toast.error("Erreur lors de la suppression de l'objectif");
    }
  };

  const renderObjectiveList = (
    objectivesList: Objective[],
    title: string,
    category: string
  ) => (
    <div className="mb-6">
      <h4 className="text-lg font-semibold text-gray-300 mb-3 flex items-center gap-2">
        {category === "team" ? (
          <CircleDotDashed className="w-5 h-5" />
        ) : (
          <Cctv className="w-5 h-5" />
        )}
        {title}
      </h4>

      {objectivesList.filter((objective) => objective.category === category)
        .length === 0 ? (
        <p className="text-gray-400 text-sm">Aucun objectif pour le moment</p>
      ) : (
        <div className="space-y-2">
          {objectivesList
            .filter((objective) => objective.category === category)
            .map((objective) => (
              <div
                key={objective.id}
                className={`p-3 rounded-lg border transition-all ${
                  objective.completed
                    ? "bg-gray-300/10 border-gray-600 opacity-60"
                    : "bg-gray-50/10 border-gray-200/20 hover:border-[#03af62] transition-colors"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1 mt-1">
                    <span
                      onClick={() => handleToggleComplete(objective)}
                      className={`cursor-pointer w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        objective.completed
                          ? "bg-green-300 border-green-300 text-white"
                          : "border-gray-400 hover:border-green-300"
                      }`}
                    >
                      {objective.completed && <Check className="w-3 h-3" />}
                    </span>
                    <h5
                      className={`font-medium ${
                        objective.completed
                          ? "line-through text-gray-400"
                          : "text-white"
                      }`}
                    >
                      {objective.title}
                    </h5>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        objective.priority === "high"
                          ? "bg-red-900/30 text-red-400"
                          : objective.priority === "medium"
                          ? "bg-yellow-900/30 text-yellow-400"
                          : "bg-green-900/30 text-green-400"
                      }`}
                    >
                      {objective.priority === "high"
                        ? "Élevée"
                        : objective.priority === "medium"
                        ? "Moyenne"
                        : "Faible"}
                    </span>

                    <div className="flex items-center">
                      {objective.description && (
                        <p
                          className={`text-sm ${
                            objective.completed
                              ? "text-gray-500"
                              : "text-gray-300"
                          }`}
                        >
                          {objective.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteObjective(objective)}
                    // className=" text-gray-400 hover:text-red-400 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="bg-green-300/10 rounded-lg border border-gray-500/50 p-6 flex-1 flex flex-col border-dashed bg-blur-md">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Target className="w-6 h-6 text-green-300" />
          Objectifs
        </h3>
        <button
          onClick={() => setNewObjectiveModalOpen(true)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Nouvel objectif
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {renderObjectiveList(
          objectives,
          teamId ? "Objectifs de l'équipe" : "Objectifs généraux",
          "team"
        )}
        {teamId &&
          renderObjectiveList(objectives, "Objectifs généraux", "general")}
      </div>

      <NewObjectiveModal
        isOpen={newObjectiveModalOpen}
        onClose={() => setNewObjectiveModalOpen(false)}
        onSubmit={handleCreateObjective}
        teamId={teamId}
      />
    </div>
  );
};

export default ObjectivesSection;
