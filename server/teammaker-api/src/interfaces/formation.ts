import type { FormationPosition } from "./formationPosition";

export interface Formation {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface FormationCreate {
  id: string;
  name: string;
  description?: string;
}

export interface FormationUpdate {
  name?: string;
  description?: string;
}

export interface FormationWithPositions extends Formation {
  positions: FormationPosition[];
}
