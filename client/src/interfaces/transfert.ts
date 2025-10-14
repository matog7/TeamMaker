export interface Transfert {
    id: number;
    player_id: number;
    status: 'vendu' | 'prete' | 'liste_suivi' | 'liste_attente' | 'achete';
    price: string;
    created_at: string;
    updated_at: string;
}

export interface TransfertCreate {
    player_id: number;
    status: 'vendu' | 'prete' | 'liste_suivi' | 'liste_attente' | 'achete';
    price: string;
}

export interface TransfertUpdate {
    status?: 'vendu' | 'prete' | 'liste_suivi' | 'liste_attente' | 'achete';
    price?: string;
}
