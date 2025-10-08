import { Router } from "express";
import bcrypt from "bcrypt";
import { query } from "../lib/db";

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
  const result = await query(
    "INSERT INTO teams (name, formation_id) VALUES ($1, $2) RETURNING *",
    [name, formation_id]
  );
  res.json(result.rows[0]);
});

router.post("/team-players/:teamId", async (req, res) => {
  const { teamId } = req.params;
  const { players } = req.body;
  for (const [positionIndex, playerValue] of Object.entries(players)) {
    // Ensure playerValue is of the expected type
    const player = playerValue as { id: number; is_captain?: boolean };
    await query(
      "INSERT INTO team_players (team_id, player_id, position_order, is_captain) VALUES ($1, $2, $3, $4) RETURNING *",
      [teamId, player.id, parseInt(positionIndex), player.is_captain || false]
    );
  }

  res.json(players);
});

router.get("/players", async (req, res) => {
  const result = await query("SELECT * FROM players");
  res.json(result.rows);
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
