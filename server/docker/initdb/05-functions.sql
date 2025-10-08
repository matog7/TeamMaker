-- Script de création des fonctions utiles pour TeamMaker
-- Fonctions PostgreSQL pour automatiser certaines opérations

-- Fonction pour calculer la note moyenne d'une équipe
CREATE OR REPLACE FUNCTION calculate_team_average_rating(team_id_param INTEGER)
RETURNS DECIMAL(5,2) AS $$
DECLARE
    avg_rating DECIMAL(5,2);
BEGIN
    SELECT AVG(p.rating) INTO avg_rating
    FROM team_players tp
    JOIN players p ON tp.player_id = p.id
    WHERE tp.team_id = team_id_param;
    
    RETURN COALESCE(avg_rating, 0);
END;
$$ LANGUAGE plpgsql;

-- Fonction pour vérifier si une équipe est complète
CREATE OR REPLACE FUNCTION is_team_complete(team_id_param INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    team_players_count INTEGER;
    formation_positions_count INTEGER;
BEGIN
    -- Compter le nombre de joueurs dans l'équipe
    SELECT COUNT(*) INTO team_players_count
    FROM team_players
    WHERE team_id = team_id_param;
    
    -- Compter le nombre de positions dans la formation de l'équipe
    SELECT COUNT(*) INTO formation_positions_count
    FROM teams t
    JOIN formation_positions fp ON t.formation_id = fp.formation_id
    WHERE t.id = team_id_param;
    
    RETURN team_players_count = formation_positions_count;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour ajouter un joueur à une équipe
CREATE OR REPLACE FUNCTION add_player_to_team(
    team_id_param INTEGER,
    player_id_param INTEGER,
    position_order_param INTEGER,
    is_captain_param BOOLEAN DEFAULT FALSE
)
RETURNS BOOLEAN AS $$
DECLARE
    player_exists BOOLEAN;
    position_taken BOOLEAN;
    player_already_in_team BOOLEAN;
BEGIN
    -- Vérifier si le joueur existe
    SELECT EXISTS(SELECT 1 FROM players WHERE id = player_id_param) INTO player_exists;
    IF NOT player_exists THEN
        RAISE EXCEPTION 'Le joueur avec l''ID % n''existe pas', player_id_param;
    END IF;
    
    -- Vérifier si le joueur n'est pas déjà dans une équipe
    SELECT EXISTS(SELECT 1 FROM team_players WHERE player_id = player_id_param) INTO player_already_in_team;
    IF player_already_in_team THEN
        RAISE EXCEPTION 'Le joueur est déjà dans une équipe';
    END IF;
    
    -- Vérifier si la position est déjà prise
    SELECT EXISTS(SELECT 1 FROM team_players WHERE team_id = team_id_param AND position_order = position_order_param) INTO position_taken;
    IF position_taken THEN
        RAISE EXCEPTION 'La position % est déjà prise dans cette équipe', position_order_param;
    END IF;
    
    -- Ajouter le joueur à l'équipe
    INSERT INTO team_players (team_id, player_id, position_order, is_captain)
    VALUES (team_id_param, player_id_param, position_order_param, is_captain_param);
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour retirer un joueur d'une équipe
CREATE OR REPLACE FUNCTION remove_player_from_team(
    team_id_param INTEGER,
    player_id_param INTEGER
)
RETURNS BOOLEAN AS $$
BEGIN
    DELETE FROM team_players 
    WHERE team_id = team_id_param AND player_id = player_id_param;
    
    IF FOUND THEN
        RETURN TRUE;
    ELSE
        RAISE EXCEPTION 'Le joueur n''est pas dans cette équipe';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour créer une nouvelle équipe avec une formation
CREATE OR REPLACE FUNCTION create_team_with_formation(
    team_name_param VARCHAR(100),
    formation_id_param VARCHAR(10)
)
RETURNS INTEGER AS $$
DECLARE
    new_team_id INTEGER;
    formation_exists BOOLEAN;
BEGIN
    -- Vérifier si la formation existe
    SELECT EXISTS(SELECT 1 FROM formations WHERE id = formation_id_param) INTO formation_exists;
    IF NOT formation_exists THEN
        RAISE EXCEPTION 'La formation avec l''ID % n''existe pas', formation_id_param;
    END IF;
    
    -- Créer l'équipe
    INSERT INTO teams (name, formation_id)
    VALUES (team_name_param, formation_id_param)
    RETURNING id INTO new_team_id;
    
    RETURN new_team_id;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour obtenir les statistiques détaillées d'une équipe
CREATE OR REPLACE FUNCTION get_team_detailed_stats(team_id_param INTEGER)
RETURNS TABLE(
    team_name VARCHAR(100),
    formation_name VARCHAR(50),
    total_players BIGINT,
    average_rating DECIMAL(5,2),
    highest_rating INTEGER,
    lowest_rating INTEGER,
    average_potential DECIMAL(5,2),
    goalkeepers BIGINT,
    defenders BIGINT,
    midfielders BIGINT,
    attackers BIGINT,
    is_complete BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.name,
        f.name,
        COUNT(tp.player_id),
        AVG(p.rating),
        MAX(p.rating),
        MIN(p.rating),
        AVG(p.potential),
        COUNT(CASE WHEN p.position = 'GK' THEN 1 END),
        COUNT(CASE WHEN p.position = 'DEF' THEN 1 END),
        COUNT(CASE WHEN p.position = 'MID' THEN 1 END),
        COUNT(CASE WHEN p.position = 'ATT' THEN 1 END),
        is_team_complete(team_id_param)
    FROM teams t
    LEFT JOIN formations f ON t.formation_id = f.id
    LEFT JOIN team_players tp ON t.id = tp.team_id
    LEFT JOIN players p ON tp.player_id = p.id
    WHERE t.id = team_id_param
    GROUP BY t.name, f.name;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour rechercher des joueurs par critères
CREATE OR REPLACE FUNCTION search_players(
    min_rating_param INTEGER DEFAULT 0,
    max_rating_param INTEGER DEFAULT 100,
    position_param VARCHAR(20) DEFAULT NULL,
    min_age_param INTEGER DEFAULT 0,
    max_age_param INTEGER DEFAULT 100,
    nationality_param VARCHAR(50) DEFAULT NULL
)
RETURNS TABLE(
    id INTEGER,
    name VARCHAR(100),
    rating INTEGER,
    potential INTEGER,
    position VARCHAR(20),
    age INTEGER,
    nationality VARCHAR(50)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        p.rating,
        p.potential,
        p.position,
        p.age,
        p.nationality
    FROM players p
    WHERE p.rating >= min_rating_param
    AND p.rating <= max_rating_param
    AND (position_param IS NULL OR p.position = position_param)
    AND (p.age IS NULL OR (p.age >= min_age_param AND p.age <= max_age_param))
    AND (nationality_param IS NULL OR p.nationality = nationality_param)
    ORDER BY p.rating DESC, p.potential DESC;
END;
$$ LANGUAGE plpgsql;
