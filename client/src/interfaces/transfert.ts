export interface Tag {
    name: string;
    color: string;
}

export interface Transfert {
    id: number;
    player_name: string;
    overall: number;
    potential: number;
    photo: string;
    status: 'vendu' | 'prete' | 'liste_suivi' | 'liste_attente' | 'achete';
    price: string;
    from: string;
    send_to: string;
    tags?: Tag[];
    created_at: string;
    updated_at: string;
}

export interface TransfertCreate {
    player_name: string;
    overall: number;
    potential: number;
    status: 'vendu' | 'prete' | 'liste_suivi' | 'liste_attente' | 'achete';
    price: string;
    send_to?: string;
    from?: string;
    tags?: Tag[];
}

export interface TransfertUpdate {
    status?: 'vendu' | 'prete' | 'liste_suivi' | 'liste_attente' | 'achete';
    price?: string;
    send_to?: string;
    tags?: Tag[];
}
