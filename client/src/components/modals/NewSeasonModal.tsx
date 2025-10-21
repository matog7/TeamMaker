import React, { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import type {
  Season,
  SeasonCreate,
  SeasonDetailItem,
  SeasonUpdate,
} from "../../interfaces";

interface NewSeasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSeason?: (season: SeasonCreate) => void;
  onUpdateSeason?: (id: number, season: SeasonUpdate) => void;
  teamId: number;
  seasonToEdit?: Season | null;
}

const NewSeasonModal: React.FC<NewSeasonModalProps> = ({
  isOpen,
  onClose,
  onCreateSeason,
  onUpdateSeason,
  teamId,
  seasonToEdit,
}) => {
  const [formData, setFormData] = useState<SeasonCreate>({
    team_id: teamId,
    wins: 0,
    draws: 0,
    losses: 0,
    bp: 0,
    bc: 0,
    detail: [],
  });

  const [detailItem, setDetailItem] = useState<SeasonDetailItem>({
    competition: "",
    result: undefined,
  });

  const [showDetailInput, setShowDetailInput] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (seasonToEdit) {
        setFormData({
          team_id: teamId,
          wins: seasonToEdit.wins,
          draws: seasonToEdit.draws,
          losses: seasonToEdit.losses,
          bp: seasonToEdit.bp,
          bc: seasonToEdit.bc,
          detail: seasonToEdit.detail || [],
        });
      } else {
        setFormData({
          team_id: teamId,
          wins: 0,
          draws: 0,
          losses: 0,
          bp: 0,
          bc: 0,
          detail: [],
        });
      }
    }
  }, [isOpen, seasonToEdit, teamId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamId) return;
    if (seasonToEdit && onUpdateSeason) {
      onUpdateSeason(seasonToEdit.id, {
        team_id: teamId,
        wins: formData.wins,
        draws: formData.draws,
        losses: formData.losses,
        bp: formData.bp,
        bc: formData.bc,
        detail: formData.detail,
      });
    } else if (onCreateSeason) {
      onCreateSeason({ ...formData, team_id: teamId });
    }
    setFormData({
      team_id: teamId,
      wins: 0,
      draws: 0,
      losses: 0,
      bp: 0,
      bc: 0,
      detail: [],
    });
    setShowDetailInput(false);
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "wins" ||
        name === "draws" ||
        name === "losses" ||
        name === "bp" ||
        name === "bc"
          ? parseInt(value || "0")
          : value,
    }));
  };

  const handleDetailChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setDetailItem((prev) => ({ ...prev, [name]: value }));
  };

  const addDetail = () => {
    if (!detailItem.result || !detailItem.competition) return;
    setFormData((prev) => ({
      ...prev,
      detail: [...(prev.detail || []), detailItem],
    }));
    setDetailItem({ competition: "", result: undefined });
    setShowDetailInput(false);
  };

  const removeDetail = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      detail: prev.detail?.filter((_, i) => i !== index) || [],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-green-300/10 backdrop-blur-md border-2 border-gray-500/50 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-green-300" />
            {seasonToEdit ? "Modifier la Saison" : "Nouvelle Saison"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Victoires
              </label>
              <input
                type="number"
                name="wins"
                value={formData.wins}
                onChange={handleChange}
                min={0}
                className="w-full border-b px-2 py-1 border-gray-300/50 text-[#79eea5] focus:border-[#03af62] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Nuls
              </label>
              <input
                type="number"
                name="draws"
                value={formData.draws}
                onChange={handleChange}
                min={0}
                className="w-full border-b px-2 py-1 border-gray-300/50 text-[#79eea5] focus:outline-none focus:border-[#03af62]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Défaites
              </label>
              <input
                type="number"
                name="losses"
                value={formData.losses}
                onChange={handleChange}
                min={0}
                className="w-full border-b px-2 py-1 border-gray-300/50 text-[#79eea5] focus:outline-none focus:border-[#03af62]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                BP
              </label>
              <input
                type="number"
                name="bp"
                value={formData.bp || 0}
                onChange={handleChange}
                min={0}
                className="w-full border-b px-2 py-1 border-gray-300/50 text-[#79eea5] focus:outline-none focus:border-[#03af62]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                BC
              </label>
              <input
                type="number"
                name="bc"
                value={formData.bc || 0}
                onChange={handleChange}
                min={0}
                className="w-full border-b px-2 py-1 border-gray-300/50 text-[#79eea5] focus:outline-none focus:border-[#03af62]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Détails (optionnels)
              </label>
              {!showDetailInput && (
                <button
                  type="button"
                  onClick={() => setShowDetailInput(true)}
                  id="add-tag-button"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>

            {formData.detail && formData.detail.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.detail.map((d, i) => (
                  <div key={i} className="relative inline-block group">
                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs text-white bg-gray-500/30 border border-gray-400/30">
                      <span>{d.competition} </span>
                      <span className="uppercase">{d.result}</span>
                    </div>
                    <span
                      onClick={() => removeDetail(i)}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                    >
                      <X className="w-2.5 h-2.5 text-white" />
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              !showDetailInput && (
                <div className="flex items-center justify-center">
                  <p className="text-gray-400 text-sm">Aucun détail</p>
                </div>
              )
            )}

            {showDetailInput && (
              <div className="space-y-3 p-3 border border-gray-400/30 rounded-md bg-black/20">
                <input
                  type="text"
                  name="competition"
                  value={detailItem.competition || ""}
                  onChange={handleDetailChange}
                  placeholder="Compétition (ex: Ligue 1)"
                  className="w-full px-2 py-1 border-b border-gray-300/50 text-[#79eea5] focus:outline-none focus:border-[#03af62]"
                />
                <input
                  type="text"
                  name="result"
                  value={detailItem.result || ""}
                  onChange={handleDetailChange}
                  placeholder="Résultat (ex: Champion)"
                  className="w-full px-2 py-1 border-b border-gray-300/50 text-[#79eea5] focus:outline-none focus:border-[#03af62]"
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={addDetail}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                  >
                    Ajouter
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowDetailInput(false);
                      setDetailItem({ competition: "", result: undefined });
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
              {seasonToEdit ? "Mettre à jour" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewSeasonModal;
