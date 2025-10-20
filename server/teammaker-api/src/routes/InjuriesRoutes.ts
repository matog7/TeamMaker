import { Router } from "express";
import { query } from "../lib/db";

const router = Router();

// Routes pour la table injuries

// Récupérer toutes les blessures d'une équipe
router.get("/injuries", async (req, res) => {
  const { team_id } = req.query;

  if (!team_id) {
    return res.status(400).json({ error: "team_id est requis" });
  }

  const result = await query(
    `SELECT i.*, p.name as player_name 
     FROM injuries i 
     JOIN players p ON i.player_id = p.id 
     JOIN team_players tp ON p.id = tp.player_id 
     WHERE tp.team_id = $1 
     ORDER BY i.created_at DESC`,
    [team_id]
  );

  res.json(result.rows);
});

// Récupérer une blessure par ID
router.get("/injuries/:id", async (req, res) => {
  const { id } = req.params;

  const result = await query(
    `SELECT i.*, p.name as player_name 
     FROM injuries i 
     JOIN players p ON i.player_id = p.id 
     WHERE i.id = $1`,
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Blessure non trouvée" });
  }

  res.json(result.rows[0]);
});

// Créer une nouvelle blessure
router.post("/injuries", async (req, res) => {
  const { player_id, injury, duration } = req.body;

  if (!player_id || !injury || !duration) {
    return res.status(400).json({
      error: "player_id, injury et duration sont requis",
    });
  }

  const result = await query(
    "INSERT INTO injuries (player_id, injury, duration, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *",
    [player_id, injury, duration]
  );

  res.json(result.rows[0]);
});

// Mettre à jour une blessure
router.put("/injuries/:id", async (req, res) => {
  const { id } = req.params;
  const { player_id, injury, duration } = req.body;

  const result = await query(
    `UPDATE injuries SET
       player_id = COALESCE($1, player_id),
       injury = COALESCE($2, injury),
       duration = COALESCE($3, duration),
       updated_at = NOW()
     WHERE id = $4 RETURNING *`,
    [player_id ?? null, injury ?? null, duration ?? null, id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Blessure non trouvée" });
  }

  res.json(result.rows[0]);
});

// Supprimer une blessure
router.delete("/injuries/:id", async (req, res) => {
  const { id } = req.params;

  const result = await query("DELETE FROM injuries WHERE id = $1 RETURNING *", [
    id,
  ]);

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Blessure non trouvée" });
  }

  res.json({ message: "Blessure supprimée avec succès" });
});

export default router;
