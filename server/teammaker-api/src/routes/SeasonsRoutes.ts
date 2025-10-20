import { Router } from "express";
import { query } from "../lib/db";

const router = Router();

// CRUD pour seasons
router.get("/seasons", async (_req, res) => {
  const result = await query("SELECT * FROM seasons ORDER BY id DESC");
  res.json(result.rows);
});

router.get("/teams/:teamId/seasons", async (req, res) => {
  const { teamId } = req.params;
  const result = await query(
    "SELECT * FROM seasons WHERE team_id = $1 ORDER BY id DESC",
    [teamId]
  );
  res.json(result.rows);
});

router.post("/seasons", async (req, res) => {
  const {
    team_id,
    wins = 0,
    draws = 0,
    losses = 0,
    bp = 0,
    bc = 0,
    detail = [],
  } = req.body;
  const result = await query(
    "INSERT INTO seasons (team_id, wins, draws, losses, bp, bc, detail, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, NOW(), NOW()) RETURNING *",
    [team_id, wins, draws, losses, bp, bc, JSON.stringify(detail)]
  );
  res.json(result.rows[0]);
});

router.put("/seasons/:id", async (req, res) => {
  const { id } = req.params;
  const { team_id, wins, draws, losses, bp, bc, detail } = req.body;

  const result = await query(
    `UPDATE seasons SET
      team_id = COALESCE($1, team_id),
      wins = COALESCE($2, wins),
      draws = COALESCE($3, draws),
      losses = COALESCE($4, losses),
      bp = COALESCE($5, bp),
      bc = COALESCE($6, bc),
      detail = COALESCE($7::jsonb, detail),
      updated_at = NOW()
     WHERE id = $8 RETURNING *`,
    [
      team_id ?? null,
      wins ?? null,
      draws ?? null,
      losses ?? null,
      bp ?? null,
      bc ?? null,
      detail !== undefined ? JSON.stringify(detail) : null,
      id,
    ]
  );

  if (result.rows.length === 0)
    return res.status(404).json({ error: "Saison non trouvée" });
  res.json(result.rows[0]);
});

router.delete("/seasons/:id", async (req, res) => {
  const { id } = req.params;
  const result = await query("DELETE FROM seasons WHERE id = $1 RETURNING id", [
    id,
  ]);
  if (result.rows.length === 0)
    return res.status(404).json({ error: "Saison non trouvée" });
  res.json({ id });
});

export default router;
