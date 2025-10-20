import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { Injury, InjuryCreate, PlayerUpdate } from "../interfaces";

interface NewInjuryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateInjury?: (injury: InjuryCreate) => void;
  onUpdateInjury?: (id: number, injury: Partial<InjuryCreate>) => void;
  injuryToEdit?: Injury | null;
  players: PlayerUpdate[];
}

const NewInjuryModal: React.FC<NewInjuryModalProps> = ({
  isOpen,
  onClose,
  onCreateInjury,
  onUpdateInjury,
  injuryToEdit,
  players,
}) => {
  const [formData, setFormData] = useState<InjuryCreate>({
    player_id: 0,
    injury: "",
    duration: "",
  });

  useEffect(() => {
    if (isOpen) {
      if (injuryToEdit) {
        setFormData({
          player_id: injuryToEdit.player_id,
          injury: injuryToEdit.injury,
          duration: injuryToEdit.duration,
        });
      } else {
        setFormData({
          player_id: 0,
          injury: "",
          duration: "",
        });
      }
    }
  }, [isOpen, injuryToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.player_id && formData.injury && formData.duration) {
      if (injuryToEdit && onUpdateInjury) {
        onUpdateInjury(injuryToEdit.id, formData);
      } else if (onCreateInjury) {
        onCreateInjury(formData);
      }
      setFormData({
        player_id: 0,
        injury: "",
        duration: "",
      });
      onClose();
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "player_id" ? parseInt(value) : value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-green-300/10 backdrop-blur-md border-2 border-gray-500/50 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">
            {injuryToEdit ? "Modifier la blessure" : "Ajouter une blessure"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Joueur
            </label>
            <select
              name="player_id"
              value={formData.player_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border-b border-gray-300/50 text-[#79eea5] focus:outline-none focus:border-[#03af62] bg-transparent"
              required
            >
              <option value={0} className="text-gray-500">
                Sélectionner un joueur
              </option>
              {players.map((player) => (
                <option
                  key={player.player_id}
                  value={player.player_id}
                  className="text-[#79eea5] bg-green-300/10"
                >
                  {player.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Blessure
            </label>
            <input
              type="text"
              name="injury"
              value={formData.injury}
              onChange={handleChange}
              placeholder="Ex: Entorse de la cheville, Fracture du tibia..."
              className="w-full px-3 py-2 border-b border-gray-300/50 text-[#79eea5] focus:outline-none focus:border-[#03af62] bg-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Durée
            </label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="Ex: 2 semaines, 1 mois, 3 mois..."
              className="w-full px-3 py-2 border-b border-gray-300/50 text-[#79eea5] focus:outline-none focus:border-[#03af62] bg-transparent"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
            >
              {injuryToEdit ? "Mettre à jour" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewInjuryModal;
