import { Router } from "express";
import { query } from "../lib/db";

const router = Router();

// Routes pour la table transferts
router.get("/transferts", async (req, res) => {
  const { team_id } = req.query;
  const result = await query(
    "SELECT * FROM transferts WHERE team_id = $1 ORDER BY created_at DESC",
    [team_id]
  );

  // Conversion des tags JSON en objets JavaScript
  const transferts = result.rows.map((transfert) => ({
    ...transfert,
    tags: transfert.tags
      ? transfert.tags.map((tag: string) => JSON.parse(tag))
      : [],
  }));

  res.json(transferts);
});

router.post("/transferts", async (req, res) => {
  const {
    team_id,
    player_name,
    status,
    price,
    send_to,
    from,
    tags,
    overall,
    potential,
  } = req.body;

  // Conversion des tags en tableau de chaînes JSON pour PostgreSQL
  const tagsArray = tags ? tags.map((tag: any) => JSON.stringify(tag)) : null;

  const result = await query(
    'INSERT INTO transferts (team_id, player_name, status, price, send_to, "from", tags, overall, potential) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
    [
      team_id,
      player_name,
      status,
      price,
      send_to,
      from,
      tagsArray,
      overall,
      potential,
    ]
  );

  // Conversion des tags de retour en objets JavaScript
  const transfert = result.rows[0];
  if (transfert.tags) {
    transfert.tags = transfert.tags.map((tag: string) => JSON.parse(tag));
  }

  res.json(transfert);
});

// Mise à jour d'un transfert
router.put("/transferts/:id", async (req, res) => {
  const { id } = req.params;
  const {
    team_id,
    player_name,
    status,
    price,
    send_to,
    from,
    tags,
    overall,
    potential,
  } = req.body;

  console.log("recu dans le body", req.body);

  // Conversion des tags en tableau de chaînes JSON pour PostgreSQL si fourni
  const tagsArray = Array.isArray(tags)
    ? tags.map((tag: any) => JSON.stringify(tag))
    : undefined;

  const result = await query(
    `UPDATE transferts SET
            team_id = COALESCE($1, team_id),
            player_name = COALESCE($2, player_name),
            status = COALESCE($3, status),
            price = COALESCE($4, price),
            send_to = CASE WHEN $5 = '' THEN NULL ELSE COALESCE($5, send_to) END,
            "from" = CASE WHEN $6 = '' THEN NULL ELSE COALESCE($6, "from") END,
            tags = COALESCE($7, tags),
            overall = COALESCE($8, overall),
            potential = COALESCE($9, potential),
            updated_at = NOW()
         WHERE id = $10 RETURNING *`,
    [
      team_id ?? null,
      player_name ?? null,
      status ?? null,
      price ?? null,
      from !== "" ? null : send_to ?? null,
      send_to !== "" ? null : from ?? null,
      tagsArray !== undefined ? tagsArray : null,
      overall ?? null,
      potential ?? null,
      id,
    ]
  );

  if (result.rows.length === 0)
    return res.status(404).json({ error: "Transfert non trouvé" });
  const transfert = result.rows[0];
  if (transfert.tags) {
    transfert.tags = transfert.tags.map((tag: string) => JSON.parse(tag));
  }
  res.json(transfert);
});

// Supprimer un transfert
router.delete("/transferts/:id", async (req, res) => {
  const { id } = req.params;

  const result = await query(
    "DELETE FROM transferts WHERE id = $1 RETURNING *",
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Transfert non trouvé" });
  }

  const transfert = result.rows[0];
  if (transfert.tags) {
    transfert.tags = transfert.tags.map((tag: string) => JSON.parse(tag));
  }

  res.json({ message: "Transfert supprimé avec succès" });
});

export default router;
