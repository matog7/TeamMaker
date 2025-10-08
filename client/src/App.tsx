import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import React from "react";
import logo from "./assets/logo-sans-fond.png";
import type {
  Player,
  Formation,
  FormationWithPositions,
  Team,
  // TeamWithPlayers,
} from "./interfaces";
import { formationAPI, teamAPI } from "./services/api";
import { ERROR_MESSAGES } from "./config/configApi";

function App() {
  const [formations, setFormations] = useState<FormationWithPositions[]>([]);
  const [selectedFormation, setSelectedFormation] =
    useState<FormationWithPositions | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [players, setPlayers] = useState<Record<number, Player>>({});
  // const [substitutes, setSubstitutes] = useState<Player[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [form, setForm] = useState<{
    name: string;
    rating: string;
    potential: string;
    photo: string;
  }>({ name: "", rating: "", potential: "", photo: "" });

  // Récupération des formations et des positions
  useEffect(() => {
    const fetchFormations = async () => {
      try {
        setLoading(true);
        setError(null);
        // Récupérer toutes les formations
        const formationsList = await formationAPI.getAll();

        // Pour chaque formation, récupérer ses positions
        const formationsWithPositions = await Promise.all(
          formationsList.map(async (formation: Formation) => {
            const positions = await formationAPI.getPositions(formation.id);
            return {
              ...formation,
              positions,
            } as FormationWithPositions;
          })
        );
        console.log("Formations chargées:", formationsWithPositions);
        setFormations(formationsWithPositions);

        // Sélectionner la première formation par défaut
        if (formationsWithPositions.length > 0) {
          setSelectedFormation(formationsWithPositions[0]);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des formations:", err);
        setError(ERROR_MESSAGES.FORMATIONS_LOAD_ERROR);
      } finally {
        setLoading(false);
      }
    };

    fetchFormations();
  }, []);

  // Récupération des équipes
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teamsList = await teamAPI.getAll();
        console.log("Équipes chargées:", teamsList);
        setTeams(teamsList);
        setSelectedTeam(teamsList[0]);
      } catch (err) {
        console.error("Erreur lors du chargement des équipes:", err);
      }
    };
    fetchTeams();
  }, []);

  // Récupération des joueurs d'une équipe sélectionnée
  useEffect(() => {
    const fetchTeamPlayers = async () => {
      if (selectedTeam) {
        try {
          const teamWithPlayers = await teamAPI.getWithPlayers(selectedTeam.id);
          console.log("Joueurs de l'équipe chargés:", teamWithPlayers);

          // Convertir les joueurs en format attendu par l'interface
          // const playersMap: Record<number, Player> = {};
          // if (teamWithPlayers.players) {
          //   teamWithPlayers.players.forEach((player: Player, index: number) => {
          //     playersMap[index] = {
          //       id: player.id,
          //       name: player.name,
          //       rating: player.rating,
          //       potential: player.potential,
          //       photo: player.photo,
          //       position: player.position,
          //       age: player.age,
          //       nationality: player.nationality,
          //       created_at: player.created_at,
          //       updated_at: player.updated_at,
          //       is_captain: player.is_captain,
          //     } as Player & { is_captain: boolean };
          //   });
          // }
          setPlayers(teamWithPlayers);
          // console.log("Joueurs chargés:", playersMap);

          // Mettre à jour la formation sélectionnée si l'équipe en a une
          if (teamWithPlayers.formation_id) {
            const formation = formations.find(
              (f) => f.id === teamWithPlayers.formation_id
            );
            if (formation) {
              setSelectedFormation(formation);
            }
          }
        } catch (err) {
          console.error(
            "Erreur lors du chargement des joueurs de l'équipe:",
            err
          );
        }
      }
    };
    fetchTeamPlayers();
  }, [selectedTeam, formations]);

  // Ouvre la modale pour une position donnée
  const openModal = (index: number) => {
    setEditingIndex(index);
    const player = players[index];
    setForm({
      name: player?.name || "",
      rating: player?.rating?.toString() || "",
      potential: player?.potential?.toString() || "",
      photo: player?.photo || "",
    });
    setModalOpen(true);
  };

  // Ferme la modale
  const closeModal = () => {
    setModalOpen(false);
    setEditingIndex(null);
    setForm({ name: "", rating: "", potential: "", photo: "" });
  };

  // Gère la soumission du formulaire de joueur
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIndex === null) return;
    setPlayers({
      ...players,
      [editingIndex]: {
        id: editingIndex,
        name: form.name,
        rating: Number(form.rating),
        potential: Number(form.potential),
        photo: form.photo,
        position: "ATT",
      } as Player,
    });
    closeModal();
  };

  // Gère la sauvegarde de l'équipe
  const handleSaveTeam = async () => {
    try {
      if (selectedTeam) {
        // Mettre à jour l'équipe existante
        await teamAPI.update(selectedTeam.id, {
          name: selectedTeam.name,
          formation_id: selectedFormation?.id,
        });
        console.log("Équipe mise à jour");
      } else {
        // Créer une nouvelle équipe
        const newTeam = await teamAPI.create({
          name: "Nouvelle équipe",
          formation_id: selectedFormation?.id,
        });
        console.log("Nouvelle équipe créée:", newTeam);
        setSelectedTeam(newTeam);
        await teamAPI.createWithPlayers(newTeam.id, players);
        // Recharger la liste des équipes
        const teamsList = await teamAPI.getAll();
        setTeams(teamsList);
      }
    } catch (err) {
      console.error("Erreur lors de la sauvegarde de l'équipe:", err);
    }
  };

  // Affichage de l'état de chargement
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Chargement des formations...</p>
        </div>
      </div>
    );
  }

  // Affichage de l'erreur
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-xl text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <header className="flex justify-center items-center">
        <img src={logo} alt="logo" className="w-56 h-56" />
      </header>
      <div
        id="interface"
        className="w-screen flex flex-col lg:flex-row items-center justify-center"
      >
        <div
          id="left-column"
          className="flex flex-col items-center justify-center gap-4 w-full"
        >
          {/* Sélecteur d'équipes */}
          <div className="bg-white rounded-lg shadow-lg p-4 mb-4 flex flex-col w-full max-w-xs">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Équipes
            </h2>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setSelectedTeam(null);
                  setPlayers({});
                }}
                className={`w-full p-2 rounded transition-colors ${
                  selectedTeam === null
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                ✨ Nouvelle équipe
              </button>
              {teams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => setSelectedTeam(team)}
                  className={`w-full p-2 rounded transition-colors flex justify-between items-center ${
                    selectedTeam?.id === team.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <span>{team.name}</span>
                  <span className="text-xs opacity-75">
                    {team.formation_id ? "📋" : "⚪"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Colonne gauche : sélecteur + liste joueurs */}
          <div className="bg-white rounded-lg shadow-lg p-4 mb-4 flex flex-col w-full max-w-xs">
            {/* Sélecteur de formation */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Formation
              </h2>
              <div className="space-y-2">
                {formations.map((formation) => (
                  <button
                    key={formation.id}
                    onClick={() => {
                      setSelectedFormation(formation);
                      setPlayers({});
                    }}
                    className={`w-full p-2 rounded transition-colors ${
                      selectedFormation?.id === formation.id
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {formation.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* Liste des joueurs */}
          <div className="bg-white rounded-lg shadow-lg p-4 mb-4 flex flex-col w-full max-w-xs">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {selectedTeam
                ? `Joueurs - ${selectedTeam.name}`
                : "Joueurs sur le terrain"}
            </h2>
            <ul className="space-y-3">
              {selectedFormation?.positions.map((_, idx) => {
                const player = players[idx];
                if (!player) return null;
                return (
                  <li
                    key={idx}
                    className={`flex items-center gap-3 bg-gray-100 rounded p-2 ${
                      players[idx]?.is_captain
                        ? "border-1 border-orange-500"
                        : ""
                    }`}
                  >
                    {player.photo && (
                      <img
                        src={player.photo}
                        alt={player.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-400"
                      />
                    )}
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 text-sm">
                        {player.name}
                        {player.is_captain ? " (C)" : ""}
                      </div>
                      <div className="text-sm text-gray-700 font-semibold">
                        Note :{" "}
                        <p
                          className={`inline-block ${
                            player.rating > 70 && player.rating <= 80
                              ? "text-green-600"
                              : "text-yellow-500"
                          }`}
                        >
                          {player.rating}
                        </p>
                        , Potentiel:{" "}
                        <p
                          className={`inline-block ${
                            player.potential > 70 && player.potential <= 80
                              ? "text-green-600"
                              : player.potential > 80
                              ? "text-green-800"
                              : "text-yellow-500"
                          }`}
                        >
                          {player.potential}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
              {Object.keys(players).length === 0 && (
                <li className="text-gray-400 text-sm">Aucun joueur ajouté</li>
              )}
            </ul>
          </div>
          {Object.keys(players).length > 0 && (
            <div className="rounded-lg p-4 mb-4 flex flex-col">
              <button
                onClick={handleSaveTeam}
                className="bg-blue-600 text-white rounded-lg p-2 hover:bg-blue-700 transition-colors"
              >
                {selectedTeam ? "Mettre à jour équipe" : "Sauvegarder équipe"}
              </button>
            </div>
          )}
        </div>
        <div
          id="right-column"
          className="flex flex-col items-center justify-center gap-4 w-full"
        >
          {/* Terrain de football */}
          <div className="flex items-center justify-center h-full">
            <div className="relative bg-gradient-to-b from-green-700 to-green-800 rounded-lg shadow-xl overflow-hidden aspect-[3/4] w-full max-w-[500px] h-[70vh] min-h-[350px] min-w-[250px]">
              {/* Motif du terrain */}
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_25%,rgba(255,255,255,0.1)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.1)_75%)] bg-[length:20px_20px]"></div>
              {/* Lignes du terrain */}
              <div className="absolute inset-0 border-4 border-white rounded-lg">
                {/* Cercle central */}
                <div className="absolute top-1/2 left-1/2 w-32 h-32 border-4 border-white rounded-full -translate-x-1/2 -translate-y-1/2" />
                {/* Surface de réparation haut */}
                <div className="absolute top-0 left-1/2 w-64 h-32 border-4 border-white border-t-0 -translate-x-1/2">
                  <div className="absolute top-0 left-1/2 w-16 h-16 border-4 border-white border-t-0 rounded-b-full -translate-x-1/2"></div>
                </div>
                {/* Surface de réparation bas */}
                <div className="absolute bottom-0 left-1/2 w-64 h-32 border-4 border-white border-b-0 -translate-x-1/2">
                  <div className="absolute bottom-0 left-1/2 w-16 h-16 border-4 border-white border-b-0 rounded-t-full -translate-x-1/2"></div>
                </div>
              </div>
              {/* Positions des joueurs */}
              {selectedFormation?.positions.map((position, index) => (
                <motion.div
                  key={index}
                  className={`absolute w-16 h-16 bg-white/95 border-2 border-gray-700 rounded-full flex items-center justify-center cursor-pointer shadow-lg overflow-hidden text-ellipsis whitespace-nowrap ${
                    players[index]?.is_captain ? "border-oranfe-500" : ""
                  }`}
                  style={{
                    left: `${position.x_coordinate}%`,
                    top: `${position.y_coordinate}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  onClick={() => openModal(index)}
                >
                  {players[index] ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="font-bold text-sm text-gray-900">
                        {players[index].name}
                      </div>
                      <div
                        className={`text-xs ${
                          players[index].rating > 70
                            ? "bg-green-600"
                            : "bg-yellow-500"
                        } text-white rounded-full px-2 py-0.5 mt-1`}
                      >
                        {players[index].rating}
                      </div>
                      {players[index].photo && (
                        <img
                          src={players[index].photo}
                          alt="photo"
                          className="w-8 h-8 rounded-full mx-auto mt-1 object-cover border border-gray-400"
                        />
                      )}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-2xl font-bold">+</div>
                  )}
                </motion.div>
              ))}
              {/* Modale du formulaire */}
              {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                  <div className="bg-white rounded-lg p-6 w-80 relative border-2 border-gray-700">
                    <button
                      onClick={closeModal}
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
                    >
                      &times;
                    </button>
                    <h3 className="text-lg font-bold mb-4 text-gray-900">
                      {players[editingIndex!] ? "Modifier" : "Ajouter"} un
                      joueur
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-800">
                          Nom
                        </label>
                        <input
                          type="text"
                          className="w-full border rounded px-2 py-1 text-gray-900"
                          value={form.name}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, name: e.target.value }))
                          }
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-800">
                          Note (sur 100)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className="w-full border rounded px-2 py-1 text-gray-900"
                          value={form.rating}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, rating: e.target.value }))
                          }
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-800">
                          Potentiel (sur 100)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className="w-full border rounded px-2 py-1 text-gray-900"
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
                      <div>
                        <label className="block text-sm font-medium text-gray-800">
                          Photo
                        </label>
                        <div
                          className="w-full border-2 border-dashed border-gray-300 rounded px-2 py-4 text-center cursor-pointer bg-gray-50 hover:bg-gray-100"
                          onClick={() =>
                            document
                              .getElementById("player-photo-input")
                              ?.click()
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
                            <span className="text-gray-400">
                              Glissez une image ici ou cliquez pour choisir un
                              fichier
                            </span>
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
                      <button
                        type="submit"
                        className="w-full bg-blue-600 text-white rounded py-2 font-semibold hover:bg-blue-700 transition"
                      >
                        Valider
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Section des remplaçants */}
      {/* <section className="w-full max-w-8xl mx-auto mt-4 mb-4">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Remplaçants</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {substitutes.map((player, index) => (
              <div
                key={index}
                className="bg-gray-100 rounded-lg p-2 text-center hover:bg-gray-200 transition-colors"
              >
                <div className="font-bold">{player.name}</div>
                <div className="text-sm bg-blue-500 text-white rounded-full px-2 py-0.5 mt-1 inline-block">
                  {player.rating}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}
    </div>
  );
}

export default App;
