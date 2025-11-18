import { Router } from "express";
import { query } from "../lib/db";

const router = Router();

// Routes pour la table evolutions
router.get("/evolutions", async (req, res) => {
  const { team_id } = req.query;
  const result = await query("SELECT * FROM evolutions WHERE team_id = $1", [
    team_id,
  ]);
  res.json(result.rows);
});

router.post("/evolutions", async (req, res) => {
  const { team_id, player_id, start_rating, end_rating, potential } = req.body;
  console.log("data", req.body);
  const result = await query(
    "INSERT INTO evolutions (team_id, player_id, start_rating, end_rating, potential) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [team_id, player_id, start_rating, end_rating, potential]
  );
  res.json(result.rows[0]);
});

router.put("/evolutions/:id", async (req, res) => {
  const { id } = req.params;
  const { start_rating, end_rating, potential } = req.body;
  const result = await query(
    "UPDATE evolutions SET start_rating = $1, end_rating = $2, potential = $3 WHERE id = $4 RETURNING *",
    [start_rating, end_rating, potential, id]
  );
  res.json(result.rows[0]);
});

router.delete("/evolutions/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query(
      "DELETE FROM evolutions WHERE id = $1 RETURNING *",
      [id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erreur lors de la suppression de l'évolution:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression de l'évolution" });
  }
});

export default router;
