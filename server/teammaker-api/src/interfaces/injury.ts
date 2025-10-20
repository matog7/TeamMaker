export interface Injury {
  id: number;
  player_id: number;
  injury: string;
  duration: string;
  created_at: string;
  updated_at: string;
}

export interface InjuryCreate {
  player_id: number;
  injury: string;
  duration: string;
}

export interface InjuryUpdate {
  player_id?: number;
  injury?: string;
  duration?: string;
}
