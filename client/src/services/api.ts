import axios from "axios";
import type {
  Formation,
  FormationPosition,
  FormationWithPositions,
  TeamCreate,
  PlayerSearchCriteria,
  TeamUpdate,
  Player,
  PlayerUpdate,
  PlayerUpdateSend,
  PlayerStats,
  CompetitionCreate,
  TransfertCreate,
  Objective,
  ObjectiveCreate,
  ObjectiveUpdate,
  Season,
  SeasonCreate,
  SeasonUpdate,
} from "../interfaces";
import { API_CONFIG } from "../config/configApi";

// Configuration de base d'axios
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Intercepteur pour les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erreur API:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API des formations
export const formationAPI = {
  // Récupérer toutes les formations
  getAll: async (): Promise<Formation[]> => {
    const response = await api.get("/formations");
    return response.data;
  },

  // Récupérer une formation par ID
  getById: async (id: string): Promise<Formation> => {
    const response = await api.get(`/formations/${id}`);
    return response.data;
  },

  // Récupérer les positions d'une formation
  getPositions: async (formationId: string): Promise<FormationPosition[]> => {
    console.log("Récupération des positions de la formation:", formationId);
    const response = await api.get(`/formation-positions/${formationId}`);
    return response.data;
  },

  // Récupérer une formation avec ses positions
  getWithPositions: async (id: string): Promise<FormationWithPositions> => {
    const response = await api.get(`/formations/with-positions/${id}`);
    return response.data;
  },
};

// API des joueurs
export const playerAPI = {
  // Récupérer tous les joueurs
  getAll: async () => {
    const response = await api.get("/players");
    return response.data;
  },

  // Récupérer un joueur par ID
  getById: async (id: number) => {
    const response = await api.get(`/players/${id}`);
    return response.data;
  },

  // Récupérer les joueurs disponibles
  getAvailable: async () => {
    const response = await api.get("/players/available");
    return response.data;
  },

  // Rechercher des joueurs
  search: async (criteria: PlayerSearchCriteria) => {
    const response = await api.get("/players/search", { params: criteria });
    return response.data;
  },

  // Mettre à jour un joueur
  update: async (id: number, player: PlayerUpdateSend) => {
    const response = await api.put(`/players/${id}`, player);
    return response.data;
  },
};

// API des équipes
export const teamAPI = {
  // Récupérer toutes les équipes
  getAll: async () => {
    const response = await api.get("/teams");
    return response.data;
  },

  // Récupérer une équipe par ID
  getById: async (id: number) => {
    const response = await api.get(`/teams/${id}`);
    return response.data;
  },

  // Récupérer une équipe avec ses joueurs
  getWithPlayers: async (id: number) => {
    const response = await api.get(`/team-players/${id}`);
    return response.data;
  },

  // Créer une équipe
  create: async (team: TeamCreate) => {
    const response = await api.post("/teams", team);
    return response.data;
  },

  createWithPlayers: async (
    teamId: number,
    players: Record<string, Player>
  ) => {
    console.log("Creating team with players:", players);
    const response = await api.post(`/team-players/${teamId}`, { players });
    return response.data;
  },

  // Mettre à jour une équipe
  update: async (id: number, team: TeamUpdate) => {
    const response = await api.put(`/teams/${id}`, team);
    return response.data;
  },

  // Supprimer une équipe
  delete: async (id: number) => {
    const response = await api.delete(`/teams/${id}`);
    return response.data;
  },
};

// API des statistiques des joueurs
export const playerStatsAPI = {
  // Sauvegarder les statistiques d'un joueur
  saveStats: async (playerId: number, stats: Partial<PlayerStats>) => {
    const response = await api.post(`/player-stats/one/${playerId}`, stats);
    return response.data;
  },

  // Récupérer les statistiques d'un joueur
  getStats: async (playerId: number, competitionId?: number) => {
    const params = competitionId ? { competition_id: competitionId } : {};
    const response = await api.get(`/player-stats/${playerId}`, { params });
    return response.data;
  },

  getAllStats: async (
    players: Record<number, PlayerUpdate>,
    competitionId?: number
  ) => {
    // Extraire les IDs des joueurs
    const playerIds = Object.values(players)
      .map((player) => player.player_id || player.id)
      .filter((id) => id && id !== 0);

    console.log("IDs des joueurs à récupérer:", playerIds);

    const response = await api.get("/player-stats", {
      params: { players: playerIds.join(","), competition_id: competitionId },
    });
    return response.data;
  },

  // Mettre à jour les statistiques d'un joueur
  updateStats: async (playerId: number, stats: Partial<PlayerStats>) => {
    const response = await api.put(`/player-stats/${playerId}`, stats);
    return response.data;
  },

  // Sauvegarder les statistiques de plusieurs joueurs
  saveMultipleStats: async (statsArray: PlayerStats[]) => {
    const response = await api.post("/player-stats/bulk", {
      stats: statsArray,
    });
    return response.data;
  },
};

// API des compétitions
export const competitionAPI = {
  // Créer une compétition
  create: async (competition: CompetitionCreate) => {
    const response = await api.post("/competitions", competition);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get("/competitions");
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/competitions/${id}`);
    return response.data;
  },
};

export const transfertAPI = {
  getAll: async (team_id: number) => {
    const response = await api.get("/transferts", { params: { team_id } });
    return response.data;
  },

  create: async (transfert: TransfertCreate, team_id: number) => {
    const response = await api.post("/transferts", { ...transfert, team_id });
    return response.data;
  },
};

// API des objectifs
export const objectiveAPI = {
  // Récupérer tous les objectifs d'une équipe
  getByTeam: async (teamId: number): Promise<Objective[]> => {
    const response = await api.get(`/objectives/${teamId}`);
    return response.data;
  },

  // Récupérer tous les objectifs généraux
  getGeneral: async (): Promise<Objective[]> => {
    const response = await api.get("/objectives");
    return response.data;
  },

  // Créer un nouvel objectif
  create: async (objective: ObjectiveCreate): Promise<Objective> => {
    const response = await api.post("/objectives", objective);
    return response.data;
  },

  // Mettre à jour un objectif
  update: async (
    id: number,
    objective: ObjectiveUpdate
  ): Promise<Objective> => {
    const response = await api.put(`/objectives/${id}`, objective);
    return response.data;
  },

  // Supprimer un objectif
  delete: async (id: number): Promise<void> => {
    await api.delete(`/objectives/${id}`);
  },
};

// API des saisons
export const seasonAPI = {
  getAll: async (): Promise<Season[]> => {
    const response = await api.get("/seasons");
    return response.data;
  },

  getByTeam: async (teamId: number): Promise<Season[]> => {
    const response = await api.get(`/teams/${teamId}/seasons`);
    return response.data;
  },

  create: async (payload: SeasonCreate): Promise<Season> => {
    const response = await api.post("/seasons", payload);
    return response.data;
  },

  update: async (id: number, payload: SeasonUpdate): Promise<Season> => {
    const response = await api.put(`/seasons/${id}`, payload);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/seasons/${id}`);
  },
};

export default api;
