export interface Player {
  id: number;
  name: string;
  rating?: number;
  potential?: number;
  is_captain: boolean;
  is_loaned: boolean;
  arrived_in_course: boolean;
  position_order?: number;
  is_promoted: boolean;
  photo?: string;
  position?: "GK" | "DEF" | "MID" | "ATT";
  age?: number;
  nationality?: string;
  created_at: string;
  updated_at: string;
}

export interface PlayerCreate {
  name: string;
  rating: number;
  potential: number;
  photo?: string;
  position: "GK" | "DEF" | "MID" | "ATT";
  age?: number;
  nationality?: string;
}

export interface PlayerUpdate {
  age?: number;
  created_at?: string;
  id?: number;
  is_captain?: boolean;
  name?: string;
  nationality?: string;
  photo?: string;
  player_id?: number;
  position?: "GK" | "DEF" | "MID" | "ATT";
  position_order?: number;
  potential?: number;
  rating?: number;
  team_id?: number;
  updated_at?: string;
}

export interface PlayerUpdateSend {
  age?: string;
  name?: string;
  nationality?: string;
  photo?: string;
  position?: string;
  potential?: string;
  rating?: string;
}

export interface PlayerSearchCriteria {
  minRating?: number;
  maxRating?: number;
  position?: "GK" | "DEF" | "MID" | "ATT";
  minAge?: number;
  maxAge?: number;
  nationality?: string;
}

export interface PlayerStats {
  competition_id?: number;
  team_id?: number;
  player_id: number;
  matches_played?: number;
  goals?: number;
  assists?: number;
}
