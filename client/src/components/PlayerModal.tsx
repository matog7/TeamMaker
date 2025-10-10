import React, { useState, useRef, useEffect } from "react";
import { MonitorUp } from "lucide-react";
import type { FormationPosition, Player, PlayerUpdate } from "../interfaces";
import { nationalities } from "../config/consts";

interface PlayerModalProps {
  isOpen: boolean;
  editingIndex: number | null;
  player: Player | null;
  playerPosition: FormationPosition | null | undefined;
  onClose: () => void;
  onSubmit: (playerData: {
    name: string;
    rating: string;
    potential: string;
    photo: string;
    age: string;
    nationality: string;
    position: string;
  }) => void;
  handlePlayerUpdate: (
    player: PlayerUpdate,
    playerData: {
      name: string;
      rating: string;
      potential: string;
      photo: string;
      age: string;
      nationality: string;
      position: string;
    }
  ) => void;
}

const PlayerModal: React.FC<PlayerModalProps> = ({
  isOpen,
  player,
  onClose,
  playerPosition,
  onSubmit,
  handlePlayerUpdate,
}) => {
  const [form, setForm] = useState({
    name: "",
    rating: "",
    potential: "",
    photo: "",
    age: "",
    nationality: "",
    position: "",
  });

  // États pour le select avec recherche
  const [nationalitySearch, setNationalitySearch] = useState("");
  const [showNationalityDropdown, setShowNationalityDropdown] = useState(false);
  const nationalityDropdownRef = useRef<HTMLDivElement>(null);

  // Filtrer les nationalités selon la recherche
  const filteredNationalities = nationalities.filter((nationality) =>
    nationality.toLowerCase().includes(nationalitySearch.toLowerCase())
  );

  // Fermer le dropdown quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        nationalityDropdownRef.current &&
        !nationalityDropdownRef.current.contains(event.target as Node)
      ) {
        setShowNationalityDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Initialiser le formulaire quand la modale s'ouvre
  useEffect(() => {
    if (isOpen && player) {
      console.log("player", player);
      setForm({
        name: player.name || "",
        rating: player.rating?.toString() || "",
        potential: player.potential?.toString() || "",
        photo: player.photo || "",
        age: player.age?.toString() || "",
        nationality: player.nationality || "",
        position: playerPosition?.position_type || "",
      });
      setNationalitySearch(player.nationality || "");
    } else if (isOpen) {
      setForm({
        name: "",
        rating: "",
        potential: "",
        photo: "",
        age: "",
        nationality: "",
        position: "",
      });
      setNationalitySearch("");
    }
  }, [isOpen, player]);

  // Gère la sélection d'une nationalité
  const handleNationalitySelect = (nationality: string) => {
    setForm((f) => ({ ...f, nationality }));
    setNationalitySearch(nationality);
    setShowNationalityDropdown(false);
  };

  // Gère la recherche de nationalité
  const handleNationalitySearch = (value: string) => {
    setNationalitySearch(value);
    setShowNationalityDropdown(true);
    if (value !== form.nationality) {
      setForm((f) => ({ ...f, nationality: "" }));
    }
  };

  // Gère la soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 ">
      <div className="w-150 bg-green-300/10 backdrop-blur-md rounded-lg p-6 relative border-2 border-gray-500/50">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
        >
          &times;
        </button>
        <h3 className="text-lg font-bold mb-4 text-white">
          {player?.name && player.name !== "" ? "Modifier" : "Ajouter"} un
          joueur
        </h3>
        <form
          onSubmit={handleSubmit}
          className="space-y-3 flex flex-col items-center justify-center gap-4"
        >
          <div className="w-full">
            <label className="block text-sm font-medium text-white">Nom</label>
            <input
              type="text"
              className="w-full border-b rounded border-gray-300/50 px-2 py-1 text-[#79eea5] focus:border-[#03af62] focus:outline-none"
              value={form.name}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  name: e.target.value,
                }))
              }
              required
            />
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-white">
              Note (sur 100)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              className="w-full border-b rounded border-gray-300/50 px-2 py-1 text-[#79eea5] focus:border-[#03af62] focus:outline-none"
              value={form.rating}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  rating: e.target.value,
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
                  potential: e.target.value,
                }))
              }
              required
            />
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-white">Age</label>
            <input
              type="number"
              min="0"
              max="100"
              className="w-full border-b rounded border-gray-300/50 px-2 py-1 text-[#79eea5] focus:border-[#03af62] focus:outline-none"
              value={form.age}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  age: e.target.value,
                }))
              }
              required
            />
          </div>
          <div className="relative w-full" ref={nationalityDropdownRef}>
            <label className="block text-sm font-medium text-white">
              Nationalité
            </label>
            <input
              type="text"
              className="w-full border-b rounded border-gray-300/50 px-2 py-1 text-gray-300 focus:border-[#03af62] focus:outline-none"
              placeholder="Rechercher une nationalité..."
              value={nationalitySearch}
              onChange={(e) => handleNationalitySearch(e.target.value)}
              onFocus={() => setShowNationalityDropdown(true)}
              required
            />
            {showNationalityDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-green-300/30 backdrop-blur-xl border border-[#03af62] rounded-md  max-h-80 overflow-y-auto">
                {filteredNationalities.length > 0 ? (
                  filteredNationalities.map((nationality) => (
                    <div
                      key={nationality}
                      className="px-3 py-2 hover:bg-gray-100/20 cursor-pointer text-[#79eea5]"
                      onClick={() => handleNationalitySelect(nationality)}
                    >
                      {nationality}
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-2 text-gray-500">
                    Aucune nationalité trouvée
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-white">
              Photo
            </label>
            <div
              className="w-full h-20 border-2 border-dashed border-gray-300/50 rounded px-2 py-4 text-center cursor-pointer bg-green-300/10 hover:bg-gray-100/20 transition-all duration-200 mt-4"
              onClick={() =>
                document.getElementById("player-photo-input")?.click()
              }
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file && file.type.startsWith("image/")) {
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    setForm((f) => ({
                      ...f,
                      photo: ev.target?.result as string,
                    }));
                  };
                  reader.readAsDataURL(file);
                }
              }}
            >
              {form.photo ? (
                <img
                  src={form.photo}
                  alt="aperçu"
                  className="mx-auto h-20 w-20 object-cover rounded-full mb-2"
                />
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <MonitorUp className="w-4 h-4 text-gray-300 mb-2" />
                  <span className="text-gray-300 text-sm">
                    Glissez une image ici ou cliquez pour choisir un fichier
                  </span>
                </div>
              )}
              <input
                id="player-photo-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      setForm((f) => ({
                        ...f,
                        photo: ev.target?.result as string,
                      }));
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>
          </div>

          {player?.name === "" ? (
            <button type="submit">Valider</button>
          ) : (
            <button
              onClick={() => handlePlayerUpdate(player as PlayerUpdate, form)}
            >
              Mettre à jour
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default PlayerModal;
