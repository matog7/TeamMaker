import React, { useCallback, useEffect, useState } from "react";
import { Plus, Trophy } from "lucide-react";
import type { Season, SeasonCreate, SeasonUpdate } from "../interfaces";
import { seasonAPI } from "../services/api";
import NewSeasonModal from "./modals/NewSeasonModal";
import toast from "react-hot-toast";

interface SeasonsSectionProps {
  teamId: number;
}

const SeasonsSection: React.FC<SeasonsSectionProps> = ({ teamId }) => {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSeason, setEditingSeason] = useState<Season | null>(null);

  const load = useCallback(async () => {
    if (!teamId) return;
    const data = await seasonAPI.getByTeam(teamId);
    setSeasons(data);
  }, [teamId]);

  useEffect(() => {
    load();
  }, [load]);

  const onCreateSeason = async (payload: SeasonCreate) => {
    try {
      const created = await seasonAPI.create(payload);
      setSeasons((prev) => [created, ...prev]);
      toast.success("Saison créée avec succès !");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la création de la saison");
    }
  };

  const onUpdateSeason = async (id: number, payload: SeasonUpdate) => {
    try {
      const updated = await seasonAPI.update(id, payload);
      setSeasons((prev) => prev.map((s) => (s.id === id ? updated : s)));
      toast.success("Saison mise à jour avec succès !");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la mise à jour de la saison");
    }
  };

  const onDeleteSeason = async (id: number) => {
    try {
      await seasonAPI.delete(id);
      setSeasons((prev) => prev.filter((s) => s.id !== id));
      toast.success("Saison supprimée avec succès !");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la suppression de la saison");
    }
  };

  const totalMatches = (s: Season) =>
    (s.wins || 0) + (s.draws || 0) + (s.losses || 0);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-green-300" />
          Saisons
        </h2>
        <button
          onClick={() => {
            setEditingSeason(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouvelle
        </button>
      </div>

      {seasons.length === 0 ? (
        <div className="text-gray-400 text-center text-sm py-8">
          Aucune saison
        </div>
      ) : (
        <div className="space-y-3">
          {seasons.map((s) => (
            <div
              key={s.id}
              className="bg-gray-50/10 border-gray-200/20 rounded-lg border p-4 hover:bg-gray-200/20 hover:border-[#03af62] transition-colors relative"
              onClick={() => {
                setEditingSeason(s);
                setIsModalOpen(true);
              }}
            >
              {/* Bouton suppression */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSeason(s.id);
                }}
                className="absolute top-0.5 right-0.5 opacity-1 hover:opacity-100 transition-opacity duration-200 bg-red-500 hover:bg-red-600 text-white rounded-full w-2 h-2 flex items-center justify-center text-xs font-bold shadow-lg"
                title="Supprimer la saison"
              >
                ×
              </button>

              <div className="flex items-center justify-between">
                <div className="flex flex-col items-center justify-center">
                  <div className="text-white font-medium">
                    {totalMatches(s)} matchs - {s.wins * 3 + s.draws * 1} pts
                  </div>
                  <div className="text-gray-400 text-sm">
                    {s.wins}V - {s.draws}N - {s.losses}D
                  </div>
                  <div className="text-gray-400 text-sm">
                    {s?.bp}BP - {s.bc}BC
                  </div>
                </div>
                {s.detail && s.detail.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {s.detail.slice(0, 10).map((d, i) => (
                      <div
                        key={i}
                        className="inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs text-white bg-gray-500/30 border border-gray-400/30"
                      >
                        <span>{d.competition}</span>
                        <span className="uppercase">{d.result}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 border border-green-500/50 text-green-300">
                    V {s.wins}
                  </span>
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 border border-yellow-500/50 text-yellow-300">
                    N {s.draws}
                  </span>
                  <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 border border-red-500/50 text-red-300">
                    D {s.losses}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <NewSeasonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateSeason={onCreateSeason}
        onUpdateSeason={onUpdateSeason}
        teamId={teamId}
        seasonToEdit={editingSeason}
      />
    </div>
  );
};

export default SeasonsSection;
