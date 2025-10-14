export interface Competition {
    id: number;
    name: string;
    season: string;
    type: "league" | "cup" | "friendly" | "championship";
    created_at: string;
    updated_at: string;
}

export interface CompetitionCreate {
    name: string;
    season: string;
    type: "league" | "cup" | "friendly" | "championship";
}

export interface CompetitionUpdate {
    name?: string;
    season?: string;
    type?: "league" | "cup" | "friendly" | "championship";
}
