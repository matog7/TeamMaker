import { Router } from "express";
import bcrypt from "bcrypt";
import { query } from "../lib/db";
import { Player } from "../interfaces/player";

const router = Router();

router.get("/formations", async (req, res) => {
  const result = await query("SELECT * FROM formations");
  res.json(result.rows);
});

router.get("/teams", async (req, res) => {
  const result = await query("SELECT * FROM teams");
  res.json(result.rows);
});

router.post("/teams", async (req, res) => {
  const { name, formation_id } = req.body;
  const [created_at, updated_at] = [new Date(), new Date()];
  const result = await query(
    "INSERT INTO teams (name, formation_id, created_at, updated_at) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, formation_id, created_at, updated_at]
  );
  res.json(result.rows[0]);
});

router.put("/teams/:id", async (req, res) => {
  const { id } = req.params;
  const { name, formation_id } = req.body;
  const updated_at = new Date();
  const result = await query(
    "UPDATE teams SET name = $1, formation_id = $2, updated_at = $3 WHERE id = $4 RETURNING *",
    [name, formation_id, updated_at, id]
  );
  res.json(result.rows[0]);
});

router.get("/players", async (req, res) => {
  const result = await query("SELECT * FROM players");
  res.json(result.rows);
});

router.put("/players/:id", async (req, res) => {
  const { id } = req.params;
  const { name, rating, potential, photo, position, age, nationality } =
    req.body;
  const updated_at = new Date();
  const result = await query(
    "UPDATE players SET name = $1, rating = $2, potential = $3, photo = $4, position = $5, age = $6, nationality = $7, updated_at = $8 WHERE id = $9 RETURNING *",
    [name, rating, potential, photo, position, age, nationality, updated_at, id]
  );
  res.json(result.rows[0]);
});

router.post("/team-players/:teamId", async (req, res) => {
  const { teamId } = req.params;
  const { players } = req.body;

  console.log("=== DEBUT API team-players ===");
  console.log("teamId:", teamId);
  console.log("players reçus:", players);
  console.log("nombre de joueurs:", Object.keys(players).length);

  // **************************************************************
  // insertion des joueurs qui n'existent pas encore
  // **************************************************************

  // vérifier si le joueur existe déjà
  const existingPlayers = await query("SELECT name FROM players");
  console.log("existingPlayers", existingPlayers.rows);
  const existingPlayersNames = existingPlayers.rows.map(
    (player) => player.name
  );
  console.log("existingPlayersNames", existingPlayersNames);
  const playersToInsert = Object.entries(players).filter(
    ([_, player]) =>
      !existingPlayersNames.includes((player as Player).name) &&
      (player as Player).name !== ""
  );
  console.log("playersToInsertAfterFilter", playersToInsert);
  for (const [_, player] of playersToInsert) {
    console.log("Insertion joueur:", {
      name: (player as Player).name,
      position: (player as Player).position,
      rating: (player as Player).rating,
      potential: (player as Player).potential
    });
    const result = await query(
      "INSERT INTO players (name, rating, potential, photo, position, age, nationality) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [
        (player as Player).name,
        (player as Player).rating,
        (player as Player).potential,
        (player as Player).photo,
        (player as Player).position,
        (player as Player).age,
        (player as Player).nationality,
      ]
    );
    console.log("result", result);
  }
  console.log("players inserted");

  // **************************************************************
  // insertion des joueurs dans l'équipe
  // **************************************************************

  // vérifier si le joueur existe déjà dans l'équipe
  const existingTeamPlayers = await query(
    "SELECT * FROM team_players WHERE team_id = $1",
    [teamId]
  );
  const existingTeamPlayersIds = existingTeamPlayers.rows.map(
    (player) => player.player_id
  );
  // Pour chaque joueur, vérifier s'il existe déjà dans l'équipe
  const teamPlayersToInsert: [string, Player][] = [];
  for (const [positionIndex, playerValue] of Object.entries(players)) {
    const player = playerValue as Player;
    if (player.name === "") continue;

    // Récupérer l'ID réel du joueur en base
    const playerInDb = await query(
      "SELECT id FROM players WHERE name = $1 LIMIT 1",
      [player.name]
    );

    if (playerInDb.rows.length > 0) {
      const realPlayerId = playerInDb.rows[0].id;
      // Vérifier si ce joueur n'est pas déjà dans l'équipe
      if (!existingTeamPlayersIds.includes(realPlayerId)) {
        teamPlayersToInsert.push([positionIndex, player as Player]);
      }
    }
  }

  console.log("teamPlayersToInsert", teamPlayersToInsert);
  console.log("existingTeamPlayersIds", existingTeamPlayersIds);
  console.log("existingTeamPlayers", existingTeamPlayers);
  console.log("players", players);

  // insertion des joueurs dans l'équipe
  for (const [positionIndex, playerValue] of teamPlayersToInsert) {
    const player = playerValue as Player;
    const playerId = await query(
      "SELECT id FROM players WHERE name = $1 LIMIT 1",
      [player.name]
    );
    console.log("player", playerId?.rows[0]);
    console.log("positionIndex", parseInt(positionIndex));
    console.log("is_captain", player.is_captain || false);
    console.log("teamId", teamId);
    try {
      await query(
        "INSERT INTO team_players (team_id, player_id, position_order, is_captain) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING",
        [
          teamId,
          playerId.rows[0].id,
          parseInt(positionIndex) + 1,
          player.is_captain || false,
        ]
      );
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  }
  console.log("=== FIN API team-players ===");
  console.log("team_players inserted");
  res.json({ message: "team_players inserted" });
});

router.get("/formation-positions", async (req, res) => {
  const result = await query("SELECT * FROM formation_positions");
  res.json(result.rows);
});

router.get("/formation-positions/:formationId", async (req, res) => {
  console.log("formationId", req.params);
  const { formationId } = req.params;
  const result = await query(
    "SELECT * FROM formation_positions WHERE formation_id = $1",
    [formationId]
  );
  res.json(result.rows);
});

router.get("/formations/with-positions/:formationId", async (req, res) => {
  const { formationId } = req.params;
  const result = await query("SELECT * FROM formations WHERE id = $1", [
    formationId,
  ]);
  res.json(result.rows);
});

router.get("/team-players/:teamId", async (req, res) => {
  const { teamId } = req.params;
  const result = await query(
    "SELECT * FROM players JOIN team_players ON players.id = team_players.player_id WHERE team_players.team_id = $1",
    [teamId]
  );
  res.json(result.rows);
});

// Routes pour les statistiques des joueurs
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

// Routes pour les compétitions
router.get("/competitions", async (req, res) => {
  const result = await query("SELECT * FROM competitions");
  res.json(result.rows);
});

router.post("/competitions", async (req, res) => {
  const { name, season, type } = req.body;
  const result = await query("INSERT INTO competitions (name, season, type) VALUES ($1, $2, $3) RETURNING *", [name, season, type]);
  res.json(result.rows[0]);
});


export default router;
