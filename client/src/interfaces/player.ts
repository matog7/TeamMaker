export interface Player {
  id: number;
  name: string;
  rating: number;
  potential: number;
  photo?: string;
  position: "GK" | "DEF" | "MID" | "ATT";
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
  name?: string;
  rating?: number;
  potential?: number;
  photo?: string;
  position?: "GK" | "DEF" | "MID" | "ATT";
  age?: number;
  nationality?: string;
}

export interface PlayerSearchCriteria {
  minRating?: number;
  maxRating?: number;
  position?: "GK" | "DEF" | "MID" | "ATT";
  minAge?: number;
  maxAge?: number;
  nationality?: string;
}
