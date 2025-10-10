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
    (player) => player.id
  );
  const teamPlayersToInsert = Object.entries(players).filter(
    ([_, player]) =>
      !existingTeamPlayersIds.includes((player as Player).id) &&
      (player as Player).name !== ""
  );

  console.log("teamPlayersToInsert", teamPlayersToInsert);
  console.log("existingTeamPlayersIds", existingTeamPlayersIds);
  console.log("existingTeamPlayers", existingTeamPlayers);
  console.log("players", players);

  // insertion des joueurs dans l'équipe
  for (const [positionIndex, playerValue] of teamPlayersToInsert) {
    const player = playerValue as {
      id: number;
      is_captain?: boolean;
      name: string;
    };
    const playerId = await query(
      "SELECT id FROM players WHERE name = $1 LIMIT 1",
      [player.name]
    );
    console.log("player", playerId?.rows[0]);
    console.log("positionIndex", parseInt(positionIndex + 1));
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

export default router;
