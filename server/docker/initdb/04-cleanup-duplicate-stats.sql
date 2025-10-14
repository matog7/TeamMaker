-- Script de nettoyage des statistiques dupliquées
-- Ce script supprime les doublons et garde seulement la dernière entrée

-- Créer une table temporaire avec les stats agrégées
CREATE TEMP
TABLE temp_aggregated_stats AS
SELECT
    player_id,
    competition_id,
    team_id,
    SUM(matches_played) as total_matches_played,
    SUM(goals) as total_goals,
    SUM(assists) as total_assists,
    MAX(updated_at) as last_updated
FROM player_stats
GROUP BY
    player_id,
    competition_id,
    team_id;

-- Supprimer toutes les entrées existantes
DELETE FROM player_stats;

-- Réinsérer les stats agrégées
INSERT INTO
    player_stats (
        player_id,
        competition_id,
        team_id,
        matches_played,
        goals,
        assists,
        created_at,
        updated_at
    )
SELECT
    player_id,
    competition_id,
    team_id,
    total_matches_played,
    total_goals,
    total_assists,
    NOW(),
    last_updated
FROM temp_aggregated_stats;

-- Nettoyer la table temporaire
DROP TABLE temp_aggregated_stats;

-- Afficher le résultat
SELECT 'Nettoyage terminé. Stats agrégées par joueur/compétition/équipe.' as message;