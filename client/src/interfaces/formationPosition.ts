export interface FormationPosition {
  id: number;
  formation_id: string;
  position_order: number;
  x_coordinate: number;
  y_coordinate: number;
  position_type: "GK" | "DEF" | "MID" | "ATT";
}

export interface FormationPositionCreate {
  formation_id: string;
  position_order: number;
  x_coordinate: number;
  y_coordinate: number;
  position_type: "GK" | "DEF" | "MID" | "ATT";
}

export interface FormationPositionUpdate {
  position_order?: number;
  x_coordinate?: number;
  y_coordinate?: number;
  position_type?: "GK" | "DEF" | "MID" | "ATT";
}
