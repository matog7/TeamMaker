import axios from "axios";
import type {
  Formation,
  FormationPosition,
  FormationWithPositions,
  TeamCreate,
  PlayerSearchCriteria,
  TeamUpdate,
  Player,
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

export default api;
