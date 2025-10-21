import { Router } from "express";
import { query } from "../lib/db";

const router = Router();

// Routes pour la table players
router.get("/players", async (req, res) => {
  const result = await query("SELECT * FROM players");
  res.json(result.rows);
});

router.put("/players/:id", async (req, res) => {
  const { id } = req.params;
  const {
    name,
    rating,
    potential,
    photo,
    position,
    age,
    nationality,
    is_loaned,
    is_promoted,
    arrived_in_course,
    position_order,
    team_id,
  } = req.body;
  const updated_at = new Date();
  const result = await query(
    "UPDATE players SET name = $1, rating = $2, potential = $3, photo = $4, position = $5, age = $6, nationality = $7, is_loaned = $8, is_promoted = $9, arrived_in_course = $10, updated_at = $11 WHERE id = $12 RETURNING *",
    [
      name,
      rating,
      potential,
      photo,
      position,
      age,
      nationality,
      is_loaned,
      is_promoted,
      arrived_in_course,
      updated_at,
      id,
    ]
  );
  res.json(result.rows[0]);
  const currentPlayerResult = await query(
    "SELECT * FROM team_players WHERE player_id = $1",
    [result.rows[0].id]
  );

  const currentPlayer = currentPlayerResult.rows[0];
  console.log("currentPlayer", currentPlayer);

  if (position_order > 0) {
    console.log("position_order", position_order);
    const getOtherPlayer = await query(
      "SELECT * FROM team_players WHERE position_order = $1 AND team_id = $2",
      [position_order, team_id]
    );
    console.log("getThisPositionOrder", getOtherPlayer.rows);
    if (getOtherPlayer.rows.length > 0) {
      // passage temporaire à position_order zéro pour le joueur que l'on modifie
      await query("UPDATE team_players SET position_order = $1 WHERE id = $2", [
        100,
        currentPlayer.id,
      ]);
      // on passe sa position à l'autre joueur
      await query("UPDATE team_players SET position_order = $1 WHERE id = $2", [
        currentPlayer.position_order,
        getOtherPlayer.rows[0].id,
      ]);
      // eet on affecte l'inversement à notre joueur courant
      await query("UPDATE team_players SET position_order = $1 WHERE id = $2", [
        position_order,
        currentPlayer.id,
      ]);
    }
  }
});

export default router;
