// Export de toutes les interfaces
export type {
  Player,
  PlayerCreate,
  PlayerUpdate,
  PlayerUpdateSend,
  PlayerSearchCriteria,
  PlayerStats,
} from "./player";

export type {
  Formation,
  FormationCreate,
  FormationUpdate,
  FormationWithPositions,
} from "./formation";

export type {
  FormationPosition,
  FormationPositionCreate,
  FormationPositionUpdate,
} from "./formationPosition";

export type {
  Team,
  TeamCreate,
  TeamUpdate,
  TeamPlayer,
  TeamPlayerCreate,
  TeamWithPlayers,
  TeamStats,
} from "./team";

export type {
  Competition,
  CompetitionCreate,
  CompetitionUpdate,
} from "./competition";

// Types utilitaires
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: string;
}
