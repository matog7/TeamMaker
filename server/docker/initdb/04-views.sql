-- Script de création des vues pour TeamMaker
-- Vues utiles pour faciliter les requêtes

-- Vue pour afficher les équipes avec leur formation
CREATE OR REPLACE VIEW teams_with_formation AS
SELECT 
    t.id,
    t.name as team_name,
    f.name as formation_name,
    f.description as formation_description,
    t.created_at,
    t.updated_at
FROM teams t
LEFT JOIN formations f ON t.formation_id = f.id;

-- Vue pour afficher les joueurs d'une équipe avec leurs positions
CREATE OR REPLACE VIEW team_players_details AS
SELECT 
    tp.team_id,
    t.name as team_name,
    tp.position_order,
    p.id as player_id,
    p.name as player_name,
    p.rating,
    p.potential,
    p.position,
    p.age,
    p.nationality,
    fp.position_type,
    fp.x_coordinate,
    fp.y_coordinate,
    tp.is_captain
FROM team_players tp
JOIN teams t ON tp.team_id = t.id
JOIN players p ON tp.player_id = p.id
LEFT JOIN formations f ON t.formation_id = f.id
LEFT JOIN formation_positions fp ON f.id = fp.formation_id AND tp.position_order = fp.position_order;

-- Vue pour les statistiques des équipes
CREATE OR REPLACE VIEW team_stats AS
SELECT 
    t.id,
    t.name as team_name,
    COUNT(tp.player_id) as total_players,
    AVG(p.rating) as average_rating,
    MAX(p.rating) as highest_rating,
    MIN(p.rating) as lowest_rating,
    AVG(p.potential) as average_potential,
    COUNT(CASE WHEN p.position = 'GK' THEN 1 END) as goalkeepers,
    COUNT(CASE WHEN p.position = 'DEF' THEN 1 END) as defenders,
    COUNT(CASE WHEN p.position = 'MID' THEN 1 END) as midfielders,
    COUNT(CASE WHEN p.position = 'ATT' THEN 1 END) as attackers
FROM teams t
LEFT JOIN team_players tp ON t.id = tp.team_id
LEFT JOIN players p ON tp.player_id = p.id
GROUP BY t.id, t.name;

-- Vue pour les joueurs disponibles (non assignés à une équipe)
CREATE OR REPLACE VIEW available_players AS
SELECT 
    p.id,
    p.name,
    p.rating,
    p.potential,
    p.position,
    p.age,
    p.nationality,
    p.created_at
FROM players p
WHERE p.id NOT IN (
    SELECT DISTINCT player_id 
    FROM team_players 
    WHERE player_id IS NOT NULL
);

-- Vue pour les formations avec le nombre de positions
CREATE OR REPLACE VIEW formations_with_positions AS
SELECT 
    f.id,
    f.name,
    f.description,
    COUNT(fp.id) as total_positions,
    COUNT(CASE WHEN fp.position_type = 'GK' THEN 1 END) as goalkeepers,
    COUNT(CASE WHEN fp.position_type = 'DEF' THEN 1 END) as defenders,
    COUNT(CASE WHEN fp.position_type = 'MID' THEN 1 END) as midfielders,
    COUNT(CASE WHEN fp.position_type = 'ATT' THEN 1 END) as attackers,
    f.created_at
FROM formations f
LEFT JOIN formation_positions fp ON f.id = fp.formation_id
GROUP BY f.id, f.name, f.description, f.created_at;
