import React, { useState, useEffect } from "react";
import type { Evolution, Player, PlayerUpdate, Team } from "../../interfaces";
import { getRatingColor } from "../../utils/ratingColors";

interface EvolutionModalProps {
  isOpen: boolean;
  evolution: Evolution | null;
  players: Record<number, Player>;
  selectedTeam: Team | null;
  onClose: () => void;
  onSubmit: (evolutionData: {
    player_id: number;
    start_rating: number;
    end_rating: number;
    potential: number;
  }) => void;
}

const EvolutionModal: React.FC<EvolutionModalProps> = ({
  isOpen,
  evolution,
  players,
  // selectedTeam,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState({
    player_id: 0,
    start_rating: 0,
    end_rating: 0,
    potential: 0,
  });

  // Initialiser le formulaire quand la modale s'ouvre
  useEffect(() => {
    if (isOpen && evolution) {
      setForm({
        player_id: evolution.player_id,
        start_rating: evolution.start_rating,
        end_rating: evolution.end_rating,
        potential: evolution.potential,
      });
    } else if (isOpen) {
      setForm({
        player_id: 0,
        start_rating: 0,
        end_rating: 0,
        potential: 0,
      });
    }
  }, [isOpen, evolution]);

  // Gère la soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.player_id === 0) {
      alert("Veuillez sélectionner un joueur");
      return;
    }
    onSubmit(form);
  };

  // Convertir les joueurs en array pour le select
  const playersArray = Object.values(players);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-150 bg-green-300/10 backdrop-blur-md rounded-lg p-6 relative border-2 border-gray-500/50">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
        >
          &times;
        </button>
        <h3 className="text-lg font-bold mb-4 text-white">
          {evolution ? "Modifier" : "Ajouter"} une évolution
        </h3>
        <form
          onSubmit={handleSubmit}
          className="space-y-3 flex flex-col items-center justify-center gap-4"
        >
          <div className="w-full">
            <label className="block text-sm font-medium text-white">
              Joueur
            </label>
            <select
              className="w-full border-b rounded border-gray-300/50 px-2 py-1 text-green-300 focus:border-[#03af62] focus:outline-none focus:bg-green-300/10"
              value={form.player_id}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  player_id: parseInt(e.target.value),
                }))
              }
              required
            >
              <option value={0} className="text-gray-500">
                Sélectionner un joueur
              </option>
              {playersArray.map((player: PlayerUpdate) => (
                <option
                  key={player.player_id}
                  value={player.player_id}
                  className="text-[#79eea5] bg-green-300/10"
                >
                  {player.name} - {player.position} - {player.rating}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-white">
              Note de départ (sur 100)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              className="w-full border-b rounded border-gray-300/50 px-2 py-1 text-[#79eea5] focus:border-[#03af62] focus:outline-none"
              value={form.start_rating}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  start_rating: parseInt(e.target.value) || 0,
                }))
              }
              required
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-white">
              Note de fin (sur 100)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              className="w-full border-b rounded border-gray-300/50 px-2 py-1 text-[#79eea5] focus:border-[#03af62] focus:outline-none"
              value={form.end_rating}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  end_rating: parseInt(e.target.value) || 0,
                }))
              }
              required
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-white">
              Potentiel (sur 100)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              className="w-full border-b rounded border-gray-300/50 px-2 py-1 text-[#79eea5] focus:border-[#03af62] focus:outline-none"
              value={form.potential}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  potential: parseInt(e.target.value) || 0,
                }))
              }
              required
            />
          </div>

          {/* Aperçu de l'évolution */}
          {form.start_rating > 0 && form.end_rating > 0 && (
            <div className="w-full p-3 bg-gray-800/50 rounded-lg">
              <h4 className="text-sm font-medium text-white mb-2">
                Aperçu de l'évolution
              </h4>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-white font-medium text-xs ${getRatingColor(
                    form.start_rating
                  )}`}
                >
                  {form.start_rating}
                </span>
                <span className="text-gray-400">→</span>
                <span
                  className={`px-2 py-1 rounded-full text-white font-medium text-xs ${getRatingColor(
                    form.end_rating
                  )}`}
                >
                  {form.end_rating}
                </span>
                <span className="text-gray-400 text-xs">
                  (+{form.end_rating - form.start_rating})
                </span>
              </div>
            </div>
          )}

          <div className="w-full flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 text-white rounded-lg py-2 font-medium hover:bg-gray-700 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 transition-colors"
            >
              {evolution ? "Mettre à jour" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EvolutionModal;
