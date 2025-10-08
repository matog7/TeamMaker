// Configuration de l'API
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  TIMEOUT: 10000,
  HEADERS: {
    "Content-Type": "application/json",
  },
};

// Messages d'erreur
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Erreur de connexion au serveur",
  TIMEOUT_ERROR: "Le serveur met trop de temps à répondre",
  UNKNOWN_ERROR: "Une erreur inattendue s'est produite",
  FORMATIONS_LOAD_ERROR: "Erreur lors du chargement des formations",
  PLAYERS_LOAD_ERROR: "Erreur lors du chargement des joueurs",
  TEAMS_LOAD_ERROR: "Erreur lors du chargement des équipes",
};
