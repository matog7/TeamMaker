-- Script d'insertion d'objectifs d'exemple
-- Ces objectifs sont généraux et ne sont liés à aucune équipe spécifique

INSERT INTO
    objectives (
        title,
        description,
        priority,
        category,
        team_id
    )
VALUES (
        'Recruter un gardien de but expérimenté',
        'Trouver un gardien avec au moins 80 de rating pour renforcer la défense',
        'high',
        'transfer',
        NULL
    ),
    (
        'Améliorer la condition physique de l\'équipe',
        'Organiser des séances d\'entraînement supplémentaires pour améliorer l\'endurance',
        'medium',
        'team',
        NULL
    ),
    (
        'Développer les jeunes talents',
        'Donner plus de temps de jeu aux joueurs de moins de 23 ans',
        'medium',
        'player',
        NULL
    ),
    (
        'Qualification en Ligue des Champions',
        'Terminer dans les 4 premiers de la saison régulière',
        'high',
        'competition',
        NULL
    ),
    (
        'Réduire les blessures',
        'Mettre en place un programme de prévention des blessures',
        'low',
        'team',
        NULL
    ),
    (
        'Améliorer les statistiques offensives',
        'Augmenter le nombre de buts marqués de 20% par rapport à la saison dernière',
        'medium',
        'team',
        NULL
    ),
    (
        'Renforcer l\'effectif défensif',
        'Recruter au moins 2 défenseurs centraux de qualité',
        'high',
        'transfer',
        NULL
    ),
    (
        'Optimiser la tactique',
        'Tester et implémenter une nouvelle formation tactique',
        'low',
        'team',
        NULL
    );

-- Objectifs spécifiques à une équipe (seront ajoutés dynamiquement via l'interface)
-- Exemple pour l'équipe avec l'ID 1 (si elle existe)
-- INSERT INTO objectives (title, description, priority, category, team_id) VALUES
-- ('Objectif spécifique à l\'équipe 1', 'Description de l\'objectif spécifique', 'medium', 'team', 1);