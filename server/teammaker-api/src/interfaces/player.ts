export interface Player {
  id: number;
  name: string;
  rating: number;
  potential: number;
  is_captain: boolean;
  is_loaned: boolean;
  is_promoted: boolean;
  arrived_in_course: boolean;
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
  is_loaned?: boolean;
  is_promoted?: boolean;
  arrived_in_course?: boolean;
}

export interface PlayerUpdate {
  name?: string;
  rating?: number;
  potential?: number;
  photo?: string;
  position?: "GK" | "DEF" | "MID" | "ATT";
  age?: number;
  nationality?: string;
  is_loaned?: boolean;
  is_promoted?: boolean;
  arrived_in_course?: boolean;
}

export interface PlayerSearchCriteria {
  minRating?: number;
  maxRating?: number;
  position?: "GK" | "DEF" | "MID" | "ATT";
  minAge?: number;
  maxAge?: number;
  nationality?: string;
}
