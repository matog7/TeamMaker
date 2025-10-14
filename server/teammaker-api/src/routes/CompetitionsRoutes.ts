import { Router } from "express";
import { query } from "../lib/db";

const router = Router();

// Routes pour la table competitions
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
