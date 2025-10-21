import React, { useState } from "react";
import type { CompetitionCreate } from "../../interfaces";

interface NewCompetitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (competitionData: CompetitionCreate) => void;
}

const NewCompetitionModal: React.FC<NewCompetitionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState<CompetitionCreate>({
    name: "",
    season: "",
    type: "league",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name.trim() && form.season.trim()) {
      onSubmit(form);
      setForm({ name: "", season: "", type: "league" });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-96 bg-green-300/10 backdrop-blur-md rounded-lg p-6 relative border-2 border-gray-500/50">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
        >
          &times;
        </button>

        <h3 className="text-lg font-bold mb-4 text-white">
          Nouvelle Compétition
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Nom de la compétition
            </label>
            <input
              type="text"
              className="w-full border-b rounded border-gray-300/50 px-2 py-1 text-[#79eea5] focus:border-[#03af62] focus:outline-none"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ex: Ligue 1, Coupe de France..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Saison
            </label>
            <input
              type="text"
              className="w-full border-b rounded border-gray-300/50 px-2 py-1 text-[#79eea5] focus:border-[#03af62] focus:outline-none"
              value={form.season}
              onChange={(e) => setForm({ ...form, season: e.target.value })}
              placeholder="Ex: 2023-2024"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Type de compétition
            </label>
            <select
              className="w-full border-b rounded border-gray-300/50 px-2 py-1 text-green-300 focus:border-[#03af62] focus:outline-none focus:bg-green-300/10"
              value={form.type}
              onChange={(e) =>
                setForm({
                  ...form,
                  type: e.target.value as CompetitionCreate["type"],
                })
              }
            >
              <option value="league" className="text-[#79eea5] bg-green-300/10">
                Championnat
              </option>
              <option value="cup" className="text-[#79eea5]">
                Coupe
              </option>
              <option value="friendly" className="text-[#79eea5]">
                Match amical
              </option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewCompetitionModal;
