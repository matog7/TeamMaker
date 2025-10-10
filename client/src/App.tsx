import { useEffect, useState } from "react";
import type {
  Player,
  Formation,
  FormationWithPositions,
  Team,
  TeamPlayer,
  PlayerUpdate,
} from "./interfaces";
import { formationAPI, playerAPI, teamAPI } from "./services/api";
import { ERROR_MESSAGES } from "./config/configApi";
import toast, { Toaster } from "react-hot-toast";
import {
  Header,
  TeamsSection,
  FormationsSection,
  PlayersList,
  FootballField,
  PlayerModal,
  NewTeamModal,
  UpdateTeamModal,
} from "./components";

function App() {
  const [formations, setFormations] = useState<FormationWithPositions[]>([]);
  const [selectedFormation, setSelectedFormation] =
    useState<FormationWithPositions | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [players, setPlayers] = useState<Record<number, Player>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // États pour les modales
  const [newTeamModalOpen, setNewTeamModalOpen] = useState(false);
  const [updateTeamModalOpen, setUpdateTeamModalOpen] = useState(false);

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
        setFormations(formationsWithPositions);
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
        setTeams(teamsList);
      } catch (err) {
        console.error("Erreur lors du chargement des équipes:", err);
      }
    };
    fetchTeams();
  }, []);

  // Récupération des joueurs d'une équipe sélectionnée
  useEffect(() => {
    const fetchTeamPlayers = async () => {
      if (selectedTeam && formations.length > 0) {
        try {
          const teamWithPlayers = await teamAPI.getWithPlayers(selectedTeam.id);
          console.log("Joueurs de l'équipe chargés:", teamWithPlayers);
          // trie des joueurs de l'équipe dans l'ordre de leur position
          const sortedPlayers = teamWithPlayers.sort(
            (a: TeamPlayer, b: TeamPlayer) =>
              a.position_order - b.position_order
          );
          if (sortedPlayers.length > 10) {
            console.log("sortedPlayers", sortedPlayers);
            setPlayers(sortedPlayers);
          } else {
            const playerList: Player[] = [];
            for (let i = 0; i < 11; i++) {
              const player = sortedPlayers.find(
                (p: Player) => p.position_order === i + 1
              );
              if (player) {
                playerList[i] = player;
              } else {
                playerList[i] = {
                  id: 0,
                  name: "",
                  is_captain: false,
                  // position: "GK",
                  created_at: "",
                  updated_at: "",
                };
              }
            }
            console.log("custom playerList", playerList);
            setPlayers(playerList);
          }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTeam]);

  // Récupération de la formation de l'équipe sélectionnée
  useEffect(() => {
    const fetchFormation = async () => {
      if (selectedTeam?.formation_id) {
        console.log(
          "Formation de l'équipe sélectionnée chargée:",
          selectedTeam.formation_id
        );
        const formation = formations.find(
          (f) => f.id === selectedTeam.formation_id
        );
        if (formation) {
          console.log("La formation sélectionnée est:", formation);
          setSelectedFormation(formation);
        }
      }
    };
    fetchFormation();
  }, [selectedTeam, formations]);

  // Ouvre la modale pour une position donnée
  const openModal = (index: number) => {
    console.log("index", index);
    setEditingIndex(index);
    setModalOpen(true);
  };

  // Ferme la modale
  const closeModal = () => {
    setModalOpen(false);
    setEditingIndex(null);
    console.log("Nouvelle Liste de joueurs", players);
  };

  // Gère la soumission du formulaire de joueur
  const handlePlayerSubmit = (playerData: {
    name: string;
    rating: string;
    potential: string;
    photo: string;
    age: string;
    nationality: string;
    position: string;
  }) => {
    if (editingIndex === null) return;
    console.log("playerData", playerData, editingIndex);
    setPlayers({
      ...players,
      [editingIndex]: {
        id: editingIndex,
        name: playerData.name,
        rating: Number(playerData.rating),
        potential: Number(playerData.potential),
        photo: playerData.photo,
        age: Number(playerData.age),
        nationality: playerData.nationality,
        position: playerData.position,
      } as Player,
    });
    closeModal();
  };

  // Gère la mise à jour d'un joueur
  const handlePlayerUpdate = async (
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
  ) => {
    if (!editingIndex) return;
    try {
      const updatedPlayer = await playerAPI.update(
        player?.player_id as number,
        playerData
      );
      console.log("updatedPlayer", updatedPlayer);
    } catch (err) {
      console.error("Erreur lors de la mise à jour du joueur:", err);
    } finally {
      toast.success("Joueur mis à jour avec succès !", {
        duration: 3000,
        position: "top-right",
        style: {
          background: "#10B981",
          color: "#fff",
        },
      });
      setModalOpen(false);
      setEditingIndex(null);
    }
  };

  // Ouvre la modale pour créer une nouvelle équipe
  const openNewTeamModal = () => {
    setNewTeamModalOpen(true);
  };

  // Ouvre la modale pour mettre à jour une équipe
  const openUpdateTeamModal = (team: Team) => {
    setSelectedTeam(team);
    setUpdateTeamModalOpen(true);
  };

  // Ferme la modale de nouvelle équipe
  const closeNewTeamModal = () => {
    setNewTeamModalOpen(false);
  };

  // Gère la création d'une nouvelle équipe
  const handleCreateNewTeam = async (teamData: {
    name: string;
    formation_id: string | null;
  }) => {
    if (!teamData.name.trim() || !teamData.formation_id) return;

    try {
      const newTeam = await teamAPI.create({
        name: teamData.name,
        formation_id: teamData.formation_id,
      });
      console.log("Nouvelle équipe créée:", newTeam);

      // Ajouter à la liste des équipes
      setTeams((prev) => [...prev, newTeam]);

      // Sélectionner la nouvelle équipe
      setSelectedTeam(newTeam);
      setPlayers({});

      // Fermer la modale
      closeNewTeamModal();
    } catch (err) {
      console.error("Erreur lors de la création de l'équipe:", err);
    }
  };

  // Gère la mise à jour d'une équipe
  const handleUpdateTeam = async (teamData: {
    name: string;
    formation_id: string | undefined;
  }) => {
    if (!teamData.name.trim() || !teamData.formation_id) return;
    if (selectedTeam) {
      setSelectedTeam({
        ...selectedTeam,
        name: teamData.name,
        formation_id: teamData.formation_id,
      });
    }
    setUpdateTeamModalOpen(false);
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

        // Mettre à jour les joueurs de l'équipe
        if (Object.keys(players).length > 0) {
          console.log(
            "Mettre à jour l'équipe existante avec les joueurs",
            players
          );
          await teamAPI.createWithPlayers(selectedTeam.id, players);
        }

        toast.success("Équipe mise à jour avec succès !", {
          duration: 3000,
          position: "top-right",
          style: {
            background: "#10B981",
            color: "#fff",
          },
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

        toast.success("Nouvelle équipe créée avec succès !", {
          duration: 3000,
          position: "top-right",
          style: {
            background: "#10B981",
            color: "#fff",
          },
        });
      }
    } catch (err) {
      console.error("Erreur lors de la sauvegarde de l'équipe:", err);
      toast.error("Erreur lors de la sauvegarde de l'équipe", {
        duration: 4000,
        position: "top-right",
        style: {
          background: "#EF4444",
          color: "#fff",
        },
      });
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
    <div className="flex flex-col">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <div className="w-full flex">
          {/* Colonne gauche - Dashboard */}
          <div className="w-1/2 flex flex-col p-6 gap-6">
            {/* Section Équipes */}
            <TeamsSection
              teams={teams}
              selectedTeam={selectedTeam}
              onTeamSelect={setSelectedTeam}
              onNewTeamClick={openNewTeamModal}
              onUpdateTeamClick={openUpdateTeamModal}
              onDeselectTeam={() => {
                setSelectedTeam(null);
                setPlayers({});
                setSelectedFormation(null);
              }}
            />

            {/* Section Formations et Joueurs */}
            <div className="bg-green-300/10 rounded-lg border border-gray-500/50 p-6 flex-1 flex flex-col border-dashed bg-blur-md pr-14 pl-14">
              <FormationsSection
                formations={formations}
                selectedFormation={selectedFormation}
                onFormationSelect={(formation) => {
                  setSelectedFormation(formation);
                  setPlayers({});
                }}
              />
              <PlayersList
                players={players}
                selectedTeam={selectedTeam}
                selectedFormation={selectedFormation}
                onPlayerClick={openModal}
                onSaveTeam={handleSaveTeam}
              />
            </div>
          </div>
          {/* Colonne droite - Terrain */}
          <div className="w-1/2 p-6">
            {selectedTeam ? (
              <FootballField
                selectedFormation={selectedFormation}
                players={players}
                onPlayerClick={openModal}
              />
            ) : (
              <div className="text-gray-400 text-sm text-center py-8">
                Sélectionnez une équipe
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modales */}
      <PlayerModal
        isOpen={modalOpen}
        editingIndex={editingIndex}
        player={editingIndex !== null ? players[editingIndex] : null}
        playerPosition={
          editingIndex !== null
            ? selectedFormation?.positions[editingIndex]
            : null
        }
        onClose={closeModal}
        onSubmit={handlePlayerSubmit}
        handlePlayerUpdate={handlePlayerUpdate}
      />

      <NewTeamModal
        isOpen={newTeamModalOpen}
        formations={formations}
        selectedFormation={selectedFormation}
        onClose={closeNewTeamModal}
        onSubmit={handleCreateNewTeam}
      />

      <UpdateTeamModal
        isOpen={updateTeamModalOpen}
        team={selectedTeam}
        formations={formations}
        onClose={() => setUpdateTeamModalOpen(false)}
        onSubmit={handleUpdateTeam}
      />

      {/* Composant Toaster pour les notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            style: {
              background: "#10B981",
              color: "#fff",
            },
          },
          error: {
            duration: 4000,
            style: {
              background: "#EF4444",
              color: "#fff",
            },
          },
        }}
      />
    </div>
  );
}

export default App;
