import { useEffect, useState } from "react";
import type {
  Player,
  Formation,
  FormationWithPositions,
  Team,
  TeamPlayer,
  PlayerUpdate,
  PlayerStats,
  Competition,
  CompetitionCreate,
  Transfert,
  TransfertCreate,
} from "./interfaces";
import { competitionAPI, formationAPI, playerAPI, teamAPI, transfertAPI } from "./services/api";
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
  PlayerStatsTable,
  CompetitionSelector,
  NewCompetitionModal,
  TransfertsList,
  ObjectivesSection,
} from "./components";
import SubstitutesSection from "./components/SubstitutesSection";
import { FileChartColumn, TrendingUp, Users } from "lucide-react";

function App() {
  // États pour les formations et les équipes
  const [formations, setFormations] = useState<FormationWithPositions[]>([]);
  const [selectedFormation, setSelectedFormation] =
    useState<FormationWithPositions | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  // États pour les erreurs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // États pour les joueurs
  const [players, setPlayers] = useState<Record<number, Player>>({});
  const [subs, setSubs] = useState<Record<number, Player>>({});
  const [modalOpen, setModalOpen] = useState(false);

  // États pour les editions
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [onglet, setOnglet] = useState<"equipe" | "stats" | "evos">("equipe");

  // États pour les modales
  const [newTeamModalOpen, setNewTeamModalOpen] = useState(false);
  const [updateTeamModalOpen, setUpdateTeamModalOpen] = useState(false);
  const [newCompetitionModalOpen, setNewCompetitionModalOpen] = useState(false);

  // États pour les compétitions
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);

  // États pour les transferts
  const [transferts, setTransferts] = useState<Transfert[]>([]);

  // Récupération des formations et des positions
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

  // Récupération des compétitions
  const fetchCompetitions = async () => {
    const competitionsList = await competitionAPI.getAll();
    setCompetitions(competitionsList);
  };

  // Récupération des équipes
  const fetchTeams = async () => {
    try {
      const teamsList = await teamAPI.getAll();
      setTeams(teamsList);
      // setSelectedTeam(teamsList[0]);
    } catch (err) {
      console.error("Erreur lors du chargement des équipes:", err);
    }
  };

  // Récupération des joueurs d'une équipe sélectionnée
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
          const eleven = sortedPlayers.slice(0, 11);
          const subs = sortedPlayers.slice(11);
          console.log(
            "sortedPlayers",
            sortedPlayers,
            "eleven",
            eleven,
            "subs",
            subs
          );

          setPlayers(eleven);
          setSubs(subs);
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
          console.log(
            "custom playerList de l'équipe sélectionnée",
            playerList
          );
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

  // Récupération de la formation de l'équipe sélectionnée
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
        console.log("La formation de l'équipesélectionnée est:", formation);
        setSelectedFormation(formation);
      }
    }
  };

  // Récupération des transferts
  const fetchTransferts = async () => {
    const transfertsList = await transfertAPI.getAll(selectedTeam?.id as number);
    console.log("Transferts chargés:", transfertsList);
    setTransferts(transfertsList);
  };

  // Récupérations au chargement de l'application
  useEffect(() => {
    fetchFormations();
    fetchCompetitions();
  }, []);

  // Récupération lorsque l'équipe change
  useEffect(() => {
    fetchTeams();
    fetchTeamPlayers();
    fetchFormation();
    fetchTransferts();
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

  // Supprime un joueur de l'équipe
  const removePlayer = (index: number) => {
    const newPlayers = { ...players };
    delete newPlayers[index];
    setPlayers(newPlayers);
    toast.success("Joueur supprimé de l'équipe !", {
      duration: 3000,
      position: "top-right",
      style: {
        background: "#EF4444",
        color: "#fff",
      },
    });
  };

  // ----------------
  // --- HANDLERS ---
  // ----------------

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

    const newPlayer = {
      id: editingIndex,
      name: playerData.name,
      rating: Number(playerData.rating),
      potential: Number(playerData.potential),
      photo: playerData.photo,
      age: Number(playerData.age),
      nationality: playerData.nationality,
      position: playerData.position,
    } as Player;

    console.log("Nouveau joueur créé:", {
      editingIndex,
      position: playerData.position,
      isSubstitute: editingIndex > 10
    });

    // Si c'est un remplaçant (index > 10), l'ajouter aux remplaçants
    if (editingIndex > 10) {
      // Pour les remplaçants, utiliser l'index original comme clé
      setSubs({
        ...subs,
        [editingIndex]: newPlayer,
      });
    } else {
      // Sinon, l'ajouter aux joueurs titulaires
      setPlayers({
        ...players,
        [editingIndex]: newPlayer,
      });
    }
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

  // Gère la mise à jour des statistiques d'un joueur
  const handleStatsUpdate = (playerId: number, stats: Partial<PlayerStats>) => {
    console.log("Mise à jour des stats pour le joueur", playerId, stats);
    // Ici vous pouvez ajouter la logique pour sauvegarder en base de données
    // Pour l'instant, on affiche juste un toast
    toast.success(`Statistiques mises à jour pour le joueur ${playerId}`, {
      duration: 2000,
      position: "top-right",
      style: {
        background: "#10B981",
        color: "#fff",
      },
    });
  };

  // Gère la création d'une nouvelle compétition
  const handleCreateCompetition = async (competitionData: CompetitionCreate) => {
    const newCompetition: Competition = {
      id: Date.now(), // ID temporaire
      ...competitionData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await competitionAPI.create(newCompetition);

    setCompetitions(prev => [...prev, newCompetition]);
    setSelectedCompetition(newCompetition);

    toast.success("Compétition créée avec succès !", {
      duration: 2000,
      position: "top-right",
      style: {
        background: "#10B981",
        color: "#fff",
      },
    });
  };

  // Ferme la modale de nouvelle compétition
  const closeNewCompetitionModal = () => {
    setNewCompetitionModalOpen(false);
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
        setSelectedTeam({
          ...selectedTeam,
          name: selectedTeam.name,
          formation_id: selectedFormation?.id,
        });

        // Mettre à jour les joueurs de l'équipe (titulaires + remplaçants)
        // Ajouter les remplaçants à la suite des titulaires avec des indices séquentiels
        const allPlayers = { ...players };
        let nextIndex = Object.keys(players).length;
        Object.values(subs).forEach((player) => {
          allPlayers[nextIndex] = player;
          nextIndex++;
        });
        if (Object.keys(allPlayers).length > 0) {
          console.log("=== ENVOI VERS API ===");
          console.log("players (titulaires):", players);
          console.log("subs (remplaçants):", subs);
          console.log("allPlayers (fusionnés):", allPlayers);
          console.log("nombre total de joueurs:", Object.keys(allPlayers).length);
          await teamAPI.createWithPlayers(selectedTeam.id, allPlayers);
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
        // reload(selectedTeam);
      } else {
        // Créer une nouvelle équipe
        const newTeam = await teamAPI.create({
          name: "Nouvelle équipe",
          formation_id: selectedFormation?.id,
        });
        console.log("Nouvelle équipe créée:", newTeam);
        setSelectedTeam(newTeam);
        // Ajouter les remplaçants à la suite des titulaires avec des indices séquentiels
        const allPlayers = { ...players };
        let nextIndex = Object.keys(players).length;
        Object.values(subs).forEach((player) => {
          allPlayers[nextIndex] = player;
          nextIndex++;
        });
        await teamAPI.createWithPlayers(newTeam.id, allPlayers);
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

  // Gère la création d'un nouveau transfert
  const handleCreateTransfert = async (transfertData: TransfertCreate) => {
    const newTransfert = await transfertAPI.create(transfertData, selectedTeam?.id as number);
    setTransferts(prev => [...prev, newTransfert]);
    toast.success("Transfert créé avec succès !", {
      duration: 3000,
      position: "top-right",
      style: {
        background: "#10B981",
        color: "#fff",
      },
    });
  };

  // ----------------
  // --- ERREURS ---
  // ----------------

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
      {selectedTeam && (
        <div className="flex justify-center items-center gap-4">
          <span onClick={() => setOnglet("equipe")} className={` flex items-center gap-2 bg-black/80 text-sm text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 cursor-pointer transition-colors ${onglet === "equipe" ? "bg-green-300/10 text-green-300" : ""}`}>
            <Users className={`w-4 h-4 ${onglet === "equipe" ? "text-green-300" : ""}`} />
            <p className={`${onglet === "equipe" ? "text-green-300" : ""}`}>Equipe</p>
          </span>
          <span onClick={() => setOnglet("stats")} className={` flex items-center gap-2 bg-black/80 text-sm text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 cursor-pointer transition-colors ${onglet === "stats" ? "bg-green-300/10 text-green-300" : ""}`}>
            <FileChartColumn className={`w-4 h-4 ${onglet === "stats" ? "text-green-300" : ""}`} />
            <p className={`${onglet === "stats" ? "text-green-300" : ""}`}>Stats</p>
          </span>
          <span onClick={() => setOnglet("evos")} className={` flex items-center gap-2 bg-black/80 text-sm text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 cursor-pointer transition-colors ${onglet === "evos" ? "bg-green-300/10 text-green-300" : ""}`}>
            <TrendingUp className={`w-4 h-4 ${onglet === "evos" ? "text-green-300" : ""}`} />
            <p className={`${onglet === "evos" ? "text-green-300" : ""}`}>Evolution</p>
          </span>
        </div>
      )}
      {onglet === "equipe" && (
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

              <div className="bg-green-300/10 max-h-[325px] rounded-lg border border-gray-500/50 p-6 flex-1 flex flex-col border-dashed bg-blur-md">
                <FormationsSection
                  formations={formations}
                  selectedFormation={selectedFormation}
                  onFormationSelect={(formation) => {
                    setSelectedFormation(formation);
                  }}
                />
              </div>

              {/* Section Formations et Joueurs */}
              <div className="bg-green-300/10 rounded-lg border border-gray-500/50 p-6 flex-1 flex flex-col border-dashed bg-blur-md">
                <PlayersList
                  players={players}
                  selectedTeam={selectedTeam}
                  selectedFormation={selectedFormation}
                  onPlayerClick={openModal}
                  onRemovePlayer={removePlayer}
                  onSaveTeam={handleSaveTeam}
                />
              </div>
              {/* Section Transferts */}
              <div className="bg-green-300/10 rounded-lg border border-gray-500/50 p-6 flex-1 flex flex-col border-dashed bg-blur-md">
                <TransfertsList
                  transferts={transferts}
                  onCreateTransfert={handleCreateTransfert}
                />
              </div>
            </div>
            {/* Colonne droite - Terrain */}
            <div className="w-1/2 p-6 flex flex-col p-6 gap-6">
              {selectedTeam ? (
                <>
                  <FootballField
                    selectedFormation={selectedFormation}
                    players={players}
                    onPlayerClick={openModal}
                  />
                  <SubstitutesSection
                    subs={subs || {}}
                    nbOfPlayers={Object.keys(players).length}
                    onAddSubstitute={openModal}
                    onPlayerClick={openModal}
                  />
                  <div className="bg-green-300/10 rounded-lg border border-gray-500/50 p-6 flex-1 flex flex-col border-dashed bg-blur-md">
                    <ObjectivesSection teamId={selectedTeam?.id} />
                  </div>
                  <div className="bg-green-300/10 rounded-lg border border-gray-500/50 p-6 flex-1 flex flex-col border-dashed bg-blur-md">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-gray-400 text-sm text-left mb-2">
                        Les contraintes pour chaque sauvegarde doivent être respectées. Les voici :
                        L'équipe doit avoir au moins 21 joueurs, dont 10 originaires du pays de l'équipe (formation).
                        10 achats maximum à l'achat en été, et 5 ventes maximum. 5 transferts entrants et sortants maximum en hiver.
                        Les ajouts d'agent libre sont limités à 1 par équipe, et par saison. Lors du mercato d'hiver, les signatures de joueurs en fin de contrat sont limitées à 2 par équipe.

                      </p>
                      <p className="text-green-300 text-sm text-center mb-2">TeamMaker - v1.0.0</p>
                      <p className="text-gray-400 text-sm text-center">Tous droits réservés.</p>
                      <p className="text-gray-400 text-sm text-center">© 2025 - TeamMaker.</p>
                    </div>
                  </div>
                  {/* <div className="bg-green-300/10 rounded-lg border border-gray-500/50 p-6 flex-1 flex flex-col border-dashed bg-blur-md"></div> */}
                </>
              ) : (
                <div className="text-gray-400 text-sm text-center py-8">
                  Sélectionnez une équipe
                </div>
              )}
            </div>
          </div>
        </div>)}
      {onglet === "stats" && (
        <div className="flex-1 flex overflow-hidden">
          <div className="w-full flex">
            {/* Colonne gauche - Sélecteur de compétition */}
            <div className="w-1/3 p-6">
              <CompetitionSelector
                competitions={competitions}
                selectedCompetition={selectedCompetition}
                onCompetitionSelect={setSelectedCompetition}
                onNewCompetition={() => setNewCompetitionModalOpen(true)}
              />
            </div>

            {/* Colonne droite - Tableau de statistiques */}
            <div className="w-2/3 p-6">
              {selectedTeam ? (
                <PlayerStatsTable
                  players={players as Record<number, PlayerUpdate>}
                  subs={subs as Record<number, PlayerUpdate>}
                  selectedCompetition={selectedCompetition}
                  onStatsUpdate={handleStatsUpdate}
                />
              ) : (
                <div className="text-gray-400 text-sm text-center py-8">
                  Sélectionnez une équipe pour voir les statistiques
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modales */}
      <PlayerModal
        isOpen={modalOpen}
        editingIndex={editingIndex}
        player={
          editingIndex !== null
            ? (editingIndex > 10 ? subs[editingIndex] : players[editingIndex])
            : null
        }
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

      <NewCompetitionModal
        isOpen={newCompetitionModalOpen}
        onClose={closeNewCompetitionModal}
        onSubmit={handleCreateCompetition}
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
