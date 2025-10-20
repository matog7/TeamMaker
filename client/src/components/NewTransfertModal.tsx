import React, { useState } from "react";
import { X, Plus } from "lucide-react";
import type { TransfertCreate } from "../interfaces/transfert";

interface NewTransfertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTransfert: (transfert: TransfertCreate) => void;
}

const NewTransfertModal: React.FC<NewTransfertModalProps> = ({
  isOpen,
  onClose,
  onCreateTransfert,
}) => {
  const [formData, setFormData] = useState<TransfertCreate>({
    player_name: "",
    overall: 0,
    potential: 0,
    status: "liste_suivi",
    price: "",
    send_to: "",
    from: "",
    tags: [],
  });

  const [newTag, setNewTag] = useState({ name: "", color: "#3B82F6" });
  const [showTagInput, setShowTagInput] = useState(false);

  const predefinedColors = [
    "#3B82F6", // Bleu
    "#EF4444", // Rouge
    "#10B981", // Vert
    "#F59E0B", // Orange
    "#8B5CF6", // Violet
    "#EC4899", // Rose
    "#06B6D4", // Cyan
    "#84CC16", // Lime
    "#F97316", // Orange foncé
    "#6366F1", // Indigo
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.player_name && formData.price) {
      onCreateTransfert(formData);
      setFormData({
        player_name: "",
        overall: 0,
        potential: 0,
        status: "liste_suivi",
        price: "",
        send_to: "",
        from: "",
        tags: [],
      });
      setNewTag({ name: "", color: "#3B82F6" });
      setShowTagInput(false);
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

  const addTag = () => {
    if (newTag.name.trim() && formData.tags) {
      const tagExists = formData.tags.some(
        (tag) => tag.name.toLowerCase() === newTag.name.toLowerCase()
      );
      if (!tagExists) {
        setFormData((prev) => ({
          ...prev,
          tags: [...(prev.tags || []), { ...newTag, name: newTag.name.trim() }],
        }));
        setNewTag({ name: "", color: "#3B82F6" });
        setShowTagInput(false);
      }
    }
  };

  const removeTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTag((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-green-300/10 backdrop-blur-md border-2 border-gray-500/50 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-green-300" />
            Nouveau Transfert
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Joueur
            </label>
            <input
              type="text"
              name="player_name"
              value={formData.player_name}
              onChange={handleChange}
              placeholder="Ex: Jean Dupont..."
              className="w-full border-b px-2 py-1 border-gray-300/50 text-[#79eea5] focus:border-[#03af62] focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Général
            </label>
            <input
              type="text"
              name="overall"
              value={formData.overall}
              onChange={handleChange}
              placeholder="Ex: 80..."
              className="w-full border-b px-2 py-1 border-gray-300/50 text-[#79eea5] focus:border-[#03af62] focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Potentiel
            </label>
            <input
              type="text"
              name="potential"
              value={formData.potential}
              onChange={handleChange}
              placeholder="Ex: 80..."
              className="w-full border-b px-2 py-1 border-gray-300/50 text-[#79eea5] focus:border-[#03af62] focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Statut
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-black/70 border border-gray-300/50 rounded-md text-[#79eea5] focus:outline-none focus:ring-1 focus:ring-green-300"
              required
            >
              <option value="liste_suivi">Liste de suivi</option>
              <option value="liste_attente">Liste d'attente</option>
              <option value="achete">Acheté</option>
              <option value="vendu">Vendu</option>
              <option value="prete">Prêté</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Prix
            </label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Ex: 15M€, 2.5M€, Gratuit..."
              className="w-full px-2 py-1 border-b border-gray-300/50 text-[#79eea5] focus:outline-none focus:border-[#03af62]"
              required
            />
          </div>
          {formData.status === "vendu" && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Vers
              </label>
              <input
                type="text"
                name="send_to"
                value={formData.send_to}
                onChange={handleChange}
                placeholder="Ex: Real Madrid, Barcelona..."
                className="w-full px-2 py-1 border-b border-gray-300/50 text-[#79eea5] focus:outline-none focus:border-[#03af62]"
                required
              />
            </div>
          )}
          {formData.status === "achete" && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Depuis
              </label>
              <input
                type="text"
                name="from"
                value={formData.from}
                onChange={handleChange}
                placeholder="Ex: Real Madrid, Barcelona..."
                className="w-full px-2 py-1 border-b border-gray-300/50 text-[#79eea5] focus:outline-none focus:border-[#03af62]"
                required
              />
            </div>
          )}

          {/* Section Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tags
            </label>

            {/* Affichage des tags existants */}
            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map((tag, index) => (
                  <div key={index} className="relative inline-block group">
                    <div
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs text-white"
                      style={{ backgroundColor: tag.color }}
                    >
                      <span>{tag.name}</span>
                    </div>
                    <span
                      // type="button"
                      onClick={() => removeTag(index)}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                    >
                      <X className="w-2.5 h-2.5 text-white" />
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Bouton pour ajouter un tag */}
            {!showTagInput && (
              <button
                type="button"
                onClick={() => setShowTagInput(true)}
                className="flex items-center gap-2 px-3 py-2 border border-dashed border-gray-400/50 rounded-md text-gray-300 hover:text-white hover:border-gray-300 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Ajouter un tag
              </button>
            )}

            {/* Formulaire d'ajout de tag */}
            {showTagInput && (
              <div className="space-y-3 p-3 border border-gray-400/30 rounded-md bg-black/20">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={newTag.name}
                    onChange={handleTagInputChange}
                    placeholder="Nom du tag..."
                    className="w-full px-2 py-1 border-b border-gray-300/50 text-[#79eea5] focus:outline-none focus:border-[#03af62]"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-2">
                    Couleur
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {predefinedColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() =>
                          setNewTag((prev) => ({ ...prev, color }))
                        }
                        className={`w-6 h-6 rounded-full border-2 ${
                          newTag.color === color
                            ? "border-white"
                            : "border-gray-400"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={addTag}
                    disabled={!newTag.name.trim()}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm rounded transition-colors"
                  >
                    Ajouter
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowTagInput(false);
                      setNewTag({ name: "", color: "#3B82F6" });
                    }}
                    className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}
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
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTransfertModal;
