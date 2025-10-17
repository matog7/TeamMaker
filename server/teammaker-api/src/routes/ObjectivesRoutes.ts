import express from 'express';
import { query } from '../lib/db';
import type { Objective, ObjectiveCreate, ObjectiveUpdate } from '../interfaces';

const router = express.Router();

// GET /objectives - Récupérer tous les objectifs d'une équipe
router.get('/objectives/:teamId', async (req, res) => {
    try {
        const { teamId } = req.params;

        const result = await query(
            'SELECT * FROM objectives WHERE team_id = $1 ORDER BY priority DESC, created_at ASC',
            [teamId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des objectifs:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// GET /objectives - Récupérer tous les objectifs généraux (sans équipe spécifique)
router.get('/objectives', async (req, res) => {
    try {
        const result = await query(
            'SELECT * FROM objectives WHERE team_id IS NULL ORDER BY priority DESC, created_at ASC'
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des objectifs généraux:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// POST /objectives - Créer un nouvel objectif
router.post('/objectives', async (req, res) => {
    try {
        const objectiveData: ObjectiveCreate = req.body;

        const result = await query(
            `INSERT INTO objectives (title, description, priority, category, team_id) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
            [
                objectiveData.title,
                objectiveData.description || null,
                objectiveData.priority,
                objectiveData.category,
                objectiveData.team_id || null
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erreur lors de la création de l\'objectif:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// PUT /objectives/:id - Mettre à jour un objectif
router.put('/objectives/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData: ObjectiveUpdate = req.body;

        const fields = [];
        const values = [];
        let paramCount = 1;

        if (updateData.title !== undefined) {
            fields.push(`title = $${paramCount++}`);
            values.push(updateData.title);
        }

        if (updateData.description !== undefined) {
            fields.push(`description = $${paramCount++}`);
            values.push(updateData.description);
        }

        if (updateData.completed !== undefined) {
            fields.push(`completed = $${paramCount++}`);
            values.push(updateData.completed);
        }

        if (updateData.priority !== undefined) {
            fields.push(`priority = $${paramCount++}`);
            values.push(updateData.priority);
        }

        if (updateData.category !== undefined) {
            fields.push(`category = $${paramCount++}`);
            values.push(updateData.category);
        }

        if (fields.length === 0) {
            return res.status(400).json({ error: 'Aucune donnée à mettre à jour' });
        }

        values.push(id);

        const result = await query(
            `UPDATE objectives SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
            values
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Objectif non trouvé' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'objectif:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// DELETE /objectives/:id - Supprimer un objectif
router.delete('/objectives/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await query(
            'DELETE FROM objectives WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Objectif non trouvé' });
        }

        res.json({ message: 'Objectif supprimé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'objectif:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

export default router;
