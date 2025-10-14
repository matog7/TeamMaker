import { Router } from "express";
import { query } from "../lib/db";

const router = Router();

// Routes pour la table formations
router.get("/formations", async (req, res) => {
    const result = await query("SELECT * FROM formations");
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

export default router;
