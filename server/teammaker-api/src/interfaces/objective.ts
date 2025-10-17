// Interface pour les objectifs
export interface Objective {
    id: number;
    title: string;
    description?: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    category: 'team' | 'player' | 'transfer' | 'competition' | 'general';
    team_id?: number;
    created_at: string;
    updated_at: string;
}

export interface ObjectiveCreate {
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
    category: 'team' | 'player' | 'transfer' | 'competition' | 'general';
    team_id?: number;
}

export interface ObjectiveUpdate {
    title?: string;
    description?: string;
    completed?: boolean;
    priority?: 'low' | 'medium' | 'high';
    category?: 'team' | 'player' | 'transfer' | 'competition' | 'general';
}
