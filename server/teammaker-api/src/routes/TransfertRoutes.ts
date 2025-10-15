import { Router } from "express";
import { query } from "../lib/db";

const router = Router();

// Routes pour la table transferts
router.get("/transferts", async (req, res) => {
    const { team_id } = req.query;
    const result = await query("SELECT * FROM transferts WHERE team_id = $1 ORDER BY created_at DESC", [team_id]);

    // Conversion des tags JSON en objets JavaScript
    const transferts = result.rows.map(transfert => ({
        ...transfert,
        tags: transfert.tags ? transfert.tags.map((tag: string) => JSON.parse(tag)) : []
    }));

    res.json(transferts);
});

router.post("/transferts", async (req, res) => {
    const { team_id, player_name, status, price, send_to, from, tags, overall, potential } = req.body;

    // Conversion des tags en tableau de chaînes JSON pour PostgreSQL
    const tagsArray = tags ? tags.map((tag: any) => JSON.stringify(tag)) : null;

    const result = await query(
        "INSERT INTO transferts (team_id, player_name, status, price, send_to, \"from\", tags, overall, potential) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
        [team_id, player_name, status, price, send_to, from, tagsArray, overall, potential]
    );

    // Conversion des tags de retour en objets JavaScript
    const transfert = result.rows[0];
    if (transfert.tags) {
        transfert.tags = transfert.tags.map((tag: string) => JSON.parse(tag));
    }

    res.json(transfert);
});

export default router;