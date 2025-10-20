-- Script de création des tables pour TeamMaker
-- Base de données PostgreSQL

-- Table des joueurs
CREATE TABLE IF NOT EXISTS players (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    rating INTEGER NOT NULL CHECK (
        rating >= 0
        AND rating <= 100
    ),
    potential INTEGER NOT NULL CHECK (
        potential >= 0
        AND potential <= 100
    ),
    photo VARCHAR(255),
    position VARCHAR(20) NOT NULL CHECK (
        position IN ('GK', 'DEF', 'MID', 'ATT')
    ),
    age INTEGER CHECK (
        age >= 16
        AND age <= 45
    ),
    nationality VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des formations
CREATE TABLE IF NOT EXISTS formations (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des positions dans les formations
CREATE TABLE IF NOT EXISTS formation_positions (
    id SERIAL PRIMARY KEY,
    formation_id VARCHAR(10) REFERENCES formations (id) ON DELETE CASCADE,
    position_order INTEGER NOT NULL,
    x_coordinate DECIMAL(5, 2) NOT NULL,
    y_coordinate DECIMAL(5, 2) NOT NULL,
    position_type VARCHAR(20) NOT NULL CHECK (
        position_type IN ('GK', 'DEF', 'MID', 'ATT')
    )
);

-- Table des équipes
CREATE TABLE IF NOT EXISTS teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    formation_id VARCHAR(10) REFERENCES formations (id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table de liaison équipes-joueurs
CREATE TABLE IF NOT EXISTS team_players (
    id SERIAL PRIMARY KEY,
    team_id INTEGER REFERENCES teams (id) ON DELETE CASCADE,
    player_id INTEGER REFERENCES players (id) ON DELETE CASCADE,
    position_order INTEGER NOT NULL,
    is_captain BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (team_id, player_id),
    UNIQUE (team_id, position_order)
);

-- Table des compétitions
CREATE TABLE IF NOT EXISTS competitions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    season VARCHAR(100) NOT NULL,
    type VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP CHECK (
        type IN (
            'league',
            'cup',
            'championship',
            'friendly'
        )
    )
);

-- Table des stats des joueurs
CREATE TABLE IF NOT EXISTS player_stats (
    id SERIAL PRIMARY KEY,
    player_id INTEGER REFERENCES players (id) ON DELETE CASCADE,
    competition_id INTEGER DEFAULT 0,
    team_id INTEGER REFERENCES teams (id) ON DELETE CASCADE,
    matches_played INTEGER DEFAULT 0,
    goals INTEGER DEFAULT 0,
    assists INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (
        player_id,
        team_id,
        competition_id
    )
);

-- Table des transferts
CREATE TABLE IF NOT EXISTS transferts (
    id SERIAL PRIMARY KEY,
    team_id INTEGER REFERENCES teams (id) ON DELETE CASCADE,
    photo VARCHAR(255),
    player_name VARCHAR(100) NOT NULL,
    overall INTEGER NOT NULL,
    potential INTEGER NOT NULL,
    status VARCHAR(100) NOT NULL CHECK (
        status IN (
            'vendu',
            'prete',
            'liste_suivi',
            'liste_attente',
            'achete'
        )
    ),
    price VARCHAR(100) NOT NULL,
    send_to VARCHAR(100),
    from VARCHAR(100), 
    tags VARCHAR(100)[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des objectifs
CREATE TABLE IF NOT EXISTS objectives (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    priority VARCHAR(10) NOT NULL CHECK (
        priority IN ('low', 'medium', 'high')
    ),
    category VARCHAR(20) NOT NULL CHECK (
        category IN (
            'team',
            'player',
            'transfer',
            'competition',
            'general'
        )
    ),
    team_id INTEGER REFERENCES teams (id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des saisons (liée à une équipe)
CREATE TABLE IF NOT EXISTS seasons (
    id SERIAL PRIMARY KEY,
    team_id INTEGER REFERENCES teams (id) ON DELETE CASCADE,
    wins INTEGER DEFAULT 0 CHECK (wins >= 0),
    draws INTEGER DEFAULT 0 CHECK (draws >= 0),
    losses INTEGER DEFAULT 0 CHECK (losses >= 0),
    bp INTEGER DEFAULT 0 CHECK (bp >= 0),
    bc INTEGER DEFAULT 0 CHECK (bc >= 0),
    detail JSONB DEFAULT '[]'::jsonb, -- détail des résultats par compétition/match
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_players_position ON players (position);

CREATE INDEX IF NOT EXISTS idx_players_rating ON players (rating);

CREATE INDEX IF NOT EXISTS idx_formation_positions_formation_id ON formation_positions (formation_id);

CREATE INDEX IF NOT EXISTS idx_team_players_team_id ON team_players (team_id);

CREATE INDEX IF NOT EXISTS idx_team_players_player_id ON team_players (player_id);

CREATE INDEX IF NOT EXISTS idx_player_stats_player_id ON player_stats (player_id);

CREATE INDEX IF NOT EXISTS idx_player_stats_competition_id ON player_stats (competition_id);

CREATE INDEX IF NOT EXISTS idx_transferts_team_id ON transferts (team_id);

CREATE INDEX IF NOT EXISTS idx_objectives_team_id ON objectives (team_id);

CREATE INDEX IF NOT EXISTS idx_objectives_category ON objectives (category);

CREATE INDEX IF NOT EXISTS idx_objectives_priority ON objectives (priority);

CREATE INDEX IF NOT EXISTS idx_seasons_team_id ON seasons (team_id);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_objectives_updated_at BEFORE UPDATE ON objectives
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Ajouter la contrainte unique pour player_stats si elle n'existe pas
DO $$ 
BEGIN
    -- Vérifier si la contrainte existe déjà
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'player_stats_player_id_team_id_competition_id_key'
    ) THEN
        -- Ajouter la contrainte unique
        ALTER TABLE player_stats 
        ADD CONSTRAINT player_stats_player_id_team_id_competition_id_key 
        UNIQUE (player_id, team_id, competition_id);
        
        RAISE NOTICE 'Contrainte unique ajoutée à player_stats';
    ELSE
        RAISE NOTICE 'Contrainte unique existe déjà sur player_stats';
    END IF;
END $$;