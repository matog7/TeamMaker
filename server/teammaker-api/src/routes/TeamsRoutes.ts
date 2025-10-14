import { Router } from "express";
import { query } from "../lib/db";

const router = Router();

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

export default router;
