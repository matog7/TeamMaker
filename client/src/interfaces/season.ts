export interface SeasonDetailItem {
  competition?: string;
  result?: "win" | "draw" | "loss";
}

export interface Season {
  id: number;
  team_id: number;
  wins: number;
  draws: number;
  losses: number;
  bp: number;
  bc: number;
  detail: SeasonDetailItem[];
  created_at: string;
  updated_at: string;
}

export interface SeasonCreate {
  team_id: number;
  wins?: number;
  draws?: number;
  losses?: number;
  bp?: number;
  bc?: number;
  detail?: SeasonDetailItem[];
}

export interface SeasonUpdate {
  team_id?: number;
  wins?: number;
  draws?: number;
  losses?: number;
  bp?: number;
  bc?: number;
  detail?: SeasonDetailItem[];
}
