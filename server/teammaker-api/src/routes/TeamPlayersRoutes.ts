import { Router } from "express";
import { query } from "../lib/db";
import { Player } from "../interfaces/player";

const router = Router();

// Routes pour la table team_players
router.get("/team-players/:teamId", async (req, res) => {
  const { teamId } = req.params;
  const result = await query(
    "SELECT * FROM players JOIN team_players ON players.id = team_players.player_id WHERE team_players.team_id = $1",
    [teamId]
  );
  res.json(result.rows);
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
      potential: (player as Player).potential,
    });
    const result = await query(
      "INSERT INTO players (name, rating, potential, photo, position, age, nationality, is_loaned, is_promoted, arrived_in_course) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
      [
        (player as Player).name,
        (player as Player).rating,
        (player as Player).potential,
        (player as Player).photo,
        (player as Player).position,
        (player as Player).age,
        (player as Player).nationality,
        (player as Player).is_loaned || false,
        (player as Player).is_promoted || false,
        (player as Player).arrived_in_course || false,
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

export default router;
