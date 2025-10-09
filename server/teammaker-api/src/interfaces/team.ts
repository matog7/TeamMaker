import type { Player, Formation } from "./index";

export interface Team {
  id: number;
  name: string;
  formation_id?: string;
  created_at: string;
  updated_at: string;
}

export interface TeamCreate {
  name: string;
  formation_id?: string;
}

export interface TeamUpdate {
  name?: string;
  formation_id?: string;
}

export interface TeamPlayer {
  id: number;
  team_id: number;
  player_id: number;
  position_order: number;
  is_captain: boolean;
  created_at: string;
}

export interface TeamPlayerCreate {
  team_id: number;
  player_id: number;
  position_order: number;
  is_captain?: boolean;
}

export interface TeamWithPlayers extends Team {
  players: (Player & {
    position_order: number;
    is_captain: boolean;
  })[];
  formation?: Formation;
}

export interface TeamStats {
  team_name: string;
  formation_name?: string;
  total_players: number;
  average_rating: number;
  highest_rating: number;
  lowest_rating: number;
  average_potential: number;
  goalkeepers: number;
  defenders: number;
  midfielders: number;
  attackers: number;
  is_complete: boolean;
}
