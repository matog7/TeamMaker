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
    const { name, rating, potential, photo, position, age, nationality } =
        req.body;
    const updated_at = new Date();
    const result = await query(
        "UPDATE players SET name = $1, rating = $2, potential = $3, photo = $4, position = $5, age = $6, nationality = $7, updated_at = $8 WHERE id = $9 RETURNING *",
        [name, rating, potential, photo, position, age, nationality, updated_at, id]
    );
    res.json(result.rows[0]);
});

export default router;
