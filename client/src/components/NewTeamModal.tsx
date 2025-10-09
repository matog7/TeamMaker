import React, { useState } from "react";
import type { FormationWithPositions } from "../interfaces";

interface NewTeamModalProps {
  isOpen: boolean;
  formations: FormationWithPositions[];
  selectedFormation: FormationWithPositions | null;
  onClose: () => void;
  onSubmit: (teamData: { name: string; formation_id: string | null }) => void;
}

const NewTeamModal: React.FC<NewTeamModalProps> = ({
  isOpen,
  formations,
  selectedFormation,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState({
    name: "",
    formation_id: selectedFormation?.id?.toString() || null,
  });

  // Initialiser le formulaire quand la modale s'ouvre
  React.useEffect(() => {
    if (isOpen) {
      setForm({
        name: "",
        formation_id: selectedFormation?.id?.toString() || null,
      });
    }
  }, [isOpen, selectedFormation]);

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
          Créer une nouvelle équipe
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
              placeholder="Ex: Équipe A, Real Madrid..."
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
                  formation_id: e.target.value || null,
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
            Créer l'équipe
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewTeamModal;
