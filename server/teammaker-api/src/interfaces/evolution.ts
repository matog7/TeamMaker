export interface Evolution {
  id: number;
  team_id: number;
  player_id: number;
  start_rating: number;
  end_rating: number;
  potential: number;
  created_at: string;
  updated_at: string;
}

export interface EvolutionCreate {
  team_id: number;
  player_id: number;
  start_rating: number;
  end_rating: number;
  potential: number;
}

export interface EvolutionUpdate {
  start_rating?: number;
  end_rating?: number;
  potential?: number;
}