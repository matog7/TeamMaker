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
