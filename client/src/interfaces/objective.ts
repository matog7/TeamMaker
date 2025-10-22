// Interface pour les objectifs
export interface Objective {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  category: ObjectiveCategory;
  team_id?: number;
  created_at: string;
  updated_at: string;
}

export interface ObjectiveCreate {
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  category: ObjectiveCategory;
  team_id?: number;
}

export type ObjectiveCategory =
  | "general"
  | "team"
  | "player"
  | "transfer"
  | "competition";

export interface ObjectiveUpdate {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: "low" | "medium" | "high";
  category?: ObjectiveCategory;
}
