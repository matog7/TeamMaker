import { Router } from "express";
import { query } from "../lib/db";

const router = Router();

// Routes pour la table player_stats
router.post("/player-stats/one/:playerId", async (req, res) => {
    const { playerId } = req.params;
    const stats = req.body;

    console.log("=== SAUVEGARDE STATS JOUEUR ===");
    console.log("playerId:", playerId);
    console.log("stats:", stats);

    try {
        // Vérifier si le joueur existe
        const playerExists = await query("SELECT id FROM players WHERE id = $1", [playerId]);
        if (playerExists.rows.length === 0) {
            return res.status(404).json({ error: "Joueur non trouvé" });
        }

        // Insérer ou mettre à jour les statistiques
        const result = await query(
            `INSERT INTO player_stats (player_id, competition_id, team_id, matches_played, goals, assists, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
         ON CONFLICT (player_id, competition_id) 
         DO UPDATE SET 
           team_id = EXCLUDED.team_id,
           matches_played = EXCLUDED.matches_played,
           goals = EXCLUDED.goals,
           assists = EXCLUDED.assists,
           updated_at = NOW()
         RETURNING *`,
            [
                playerId,
                stats.competition_id || null,  // null au lieu de 0
                stats.team_id || null,         // null au lieu de 0
                stats.matches_played || 0,
                stats.goals || 0,
                stats.assists || 0,
            ]
        );

        console.log("Statistiques sauvegardées:", result.rows[0]);
        res.json({ message: "Statistiques sauvegardées", data: result.rows[0] });
    } catch (error) {
        console.error("Erreur lors de la sauvegarde des statistiques:", error);
        res.status(500).json({ error: "Erreur lors de la sauvegarde des statistiques" });
    }
});

router.post("/player-stats/bulk", async (req, res) => {
    const { stats } = req.body;

    console.log("=== SAUVEGARDE STATS EN MASSE ===");
    console.log("Nombre de stats à sauvegarder:", stats.length);

    try {
        const results = [];

        for (const stat of stats) {
            const result = await query(
                `INSERT INTO player_stats (player_id, competition_id, team_id, matches_played, goals, assists, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
           ON CONFLICT (player_id, team_id, competition_id) 
           DO UPDATE SET 
             team_id = EXCLUDED.team_id,
             matches_played = EXCLUDED.matches_played,
             goals = EXCLUDED.goals,
             assists = EXCLUDED.assists,
             updated_at = NOW()
           RETURNING *`,
                [
                    stat.player_id,
                    stat.competition_id || null,  // null au lieu de 0
                    stat.team_id || null,         // null au lieu de 0
                    stat.matches_played || 0,
                    stat.goals || 0,
                    stat.assists || 0,
                ]
            );
            results.push(result.rows[0]);
        }

        console.log("Statistiques sauvegardées en masse:", results.length);
        res.json({ message: "Statistiques sauvegardées en masse", data: results });
    } catch (error) {
        console.error("Erreur lors de la sauvegarde en masse:", error);
        res.status(500).json({ error: "Erreur lors de la sauvegarde en masse" });
    }
});

router.get("/player-stats", async (req, res) => {
    const { players, competition_id } = req.query;

    console.log("=== RÉCUPÉRATION STATS ===");
    console.log("players:", players, "competition_id:", competition_id);

    try {
        if (!players) {
            return res.json([]);
        }

        // Convertir la chaîne en tableau d'IDs
        const playerIds = Array.isArray(players) ? players : (players as string).split(',');
        console.log("playerIds:", playerIds);

        // Créer les placeholders pour la requête IN
        const placeholders = playerIds.map((_: any, index: number) => `$${index + 1}`).join(',');

        let queryText = `SELECT * FROM player_stats WHERE player_id IN (${placeholders})`;
        let params = [...playerIds];

        // Ajouter le filtre par compétition si spécifié
        if (competition_id && parseInt(competition_id as string) != 0) {
            queryText += ` AND competition_id = ${competition_id}`;
            // params.push(competition_id as string);
        }

        console.log("queryText:", queryText);
        console.log("params:", params);

        const result = await query(queryText, params);
        console.log("Résultat brut:", result.rows);

        // Toujours grouper et additionner les stats par joueur
        // car un joueur peut avoir plusieurs entrées pour la même compétition
        const aggregatedStats: Record<number, any> = {};

        result.rows.forEach((stat: any) => {
            const playerId = stat.player_id;

            console.log(`Traitement stat pour joueur ${playerId}:`, {
                matches_played: stat.matches_played,
                goals: stat.goals,
                assists: stat.assists,
                competition_id: stat.competition_id
            });

            if (!aggregatedStats[playerId]) {
                aggregatedStats[playerId] = {
                    player_id: playerId,
                    competition_id: stat.competition_id,
                    team_id: stat.team_id,
                    matches_played: 0,
                    goals: 0,
                    assists: 0,
                };
                console.log(`Nouvelle entrée créée pour joueur ${playerId}`);
            }

            // Additionner les statistiques
            const oldMatches = aggregatedStats[playerId].matches_played;
            aggregatedStats[playerId].matches_played += stat.matches_played || 0;
            aggregatedStats[playerId].goals += stat.goals || 0;
            aggregatedStats[playerId].assists += stat.assists || 0;

            console.log(`Joueur ${playerId} - Matchs: ${oldMatches} + ${stat.matches_played || 0} = ${aggregatedStats[playerId].matches_played}`);
        });

        const finalStats = Object.values(aggregatedStats);
        console.log("Stats agrégées:", finalStats);

        res.json(finalStats);
    } catch (error) {
        console.error("Erreur lors de la récupération des statistiques:", error);
        res.status(500).json({ error: "Erreur lors de la récupération des statistiques" });
    }
});

router.get("/player-stats/:playerId", async (req, res) => {
    const { playerId } = req.params;
    const { competition_id } = req.query;

    try {
        let queryText = "SELECT * FROM player_stats WHERE player_id = $1";
        let params = [playerId];

        if (competition_id) {
            queryText += " AND competition_id = $2";
            params.push(competition_id as string);
        }

        const result = await query(queryText, params);
        res.json(result.rows);
    } catch (error) {
        console.error("Erreur lors de la récupération des statistiques:", error);
        res.status(500).json({ error: "Erreur lors de la récupération des statistiques" });
    }
});

export default router;
