import React, { useState } from "react";
import type { Team, FormationWithPositions } from "../interfaces";

interface UpdateTeamModalProps {
  isOpen: boolean;
  team: Team | null;
  formations: FormationWithPositions[];
  onClose: () => void;
  onSubmit: (teamData: {
    name: string;
    formation_id: string | undefined;
  }) => void;
}

const UpdateTeamModal: React.FC<UpdateTeamModalProps> = ({
  isOpen,
  team,
  formations,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState({
    name: "",
    formation_id: undefined as string | undefined,
  });

  // Initialiser le formulaire quand la modale s'ouvre
  React.useEffect(() => {
    if (isOpen && team) {
      setForm({
        name: team.name,
        formation_id: team.formation_id || undefined,
      });
    }
  }, [isOpen, team]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg p-6 w-80 relative border-2 border-gray-700">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
        >
          &times;
        </button>
        <h3 className="text-lg font-bold mb-4 text-gray-900">
          Mettre à jour l'équipe
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-800">
              Nom de l'équipe
            </label>
            <input
              type="text"
              className="w-full border rounded px-2 py-1 text-gray-900"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800">
              Formation
            </label>
            <select
              className="w-full border rounded px-2 py-1 text-gray-900"
              value={form.formation_id || ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  formation_id: e.target.value || undefined,
                }))
              }
              required
            >
              <option value="">Sélectionner une formation</option>
              {formations.map((formation) => (
                <option key={formation.id} value={formation.id}>
                  {formation.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white rounded py-2 font-semibold hover:bg-green-700 transition"
          >
            Mettre à jour l'équipe
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateTeamModal;
