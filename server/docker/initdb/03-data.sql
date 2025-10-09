-- Script d'insertion des données de base pour TeamMaker
-- Données d'exemple pour tester l'application

-- Insertion des formations
INSERT INTO formations (id, name, description) VALUES
('442', '4-4-2', 'Formation classique avec 4 défenseurs, 4 milieux et 2 attaquants'),
('433', '4-3-3', 'Formation offensive avec 4 défenseurs, 3 milieux et 3 attaquants'),
('41212', '4-1-2-1-2', 'Formation en losange avec 4 défenseurs, 1 milieu défensif, 2 milieux latéraux, 1 milieu offensif et 2 attaquants'),
('352', '3-5-2', 'Formation avec 3 défenseurs, 5 milieux et 2 attaquants'),
('532', '5-3-2', 'Formation défensive avec 5 défenseurs, 3 milieux et 2 attaquants')
ON CONFLICT (id) DO NOTHING;

-- Insertion des positions pour la formation 4-4-2
INSERT INTO formation_positions (formation_id, position_order, x_coordinate, y_coordinate, position_type) VALUES
('442', 1, 50.00, 90.00, 'GK'),  -- Gardien
('442', 2, 10.00, 70.00, 'DEF'), -- Défenseur gauche
('442', 3, 40.00, 75.00, 'DEF'), -- Défenseur central gauche
('442', 4, 60.00, 75.00, 'DEF'), -- Défenseur central droit
('442', 5, 90.00, 70.00, 'DEF'), -- Défenseur droit
('442', 6, 10.00, 40.00, 'MID'), -- Milieu gauche
('442', 7, 35.00, 55.00, 'MID'), -- Milieu central gauche
('442', 8, 65.00, 55.00, 'MID'), -- Milieu central droit
('442', 9, 90.00, 40.00, 'MID'), -- Milieu droit
('442', 10, 35.00, 20.00, 'ATT'), -- Attaquant gauche
('442', 11, 65.00, 20.00, 'ATT')  -- Attaquant droit
ON CONFLICT DO NOTHING;

-- Insertion des positions pour la formation 4-3-3
INSERT INTO formation_positions (formation_id, position_order, x_coordinate, y_coordinate, position_type) VALUES
('433', 1, 50.00, 90.00, 'GK'),  -- Gardien
('433', 2, 20.00, 65.00, 'DEF'), -- Défenseur gauche
('433', 3, 40.00, 70.00, 'DEF'), -- Défenseur central gauche
('433', 4, 60.00, 70.00, 'DEF'), -- Défenseur central droit
('433', 5, 80.00, 65.00, 'DEF'), -- Défenseur droit
('433', 6, 35.00, 50.00, 'MID'), -- Milieu gauche
('433', 7, 65.00, 50.00, 'MID'), -- Milieu droit
('433', 8, 50.00, 35.00, 'MID'), -- Milieu central
('433', 9, 20.00, 25.00, 'ATT'), -- Ailier gauche
('433', 10, 80.00, 25.00, 'ATT'), -- Ailier droit
('433', 11, 50.00, 15.00, 'ATT')  -- Attaquant central
ON CONFLICT DO NOTHING;

-- Insertion des positions pour la formation 4-1-2-1-2
INSERT INTO formation_positions (formation_id, position_order, x_coordinate, y_coordinate, position_type) VALUES
('41212', 1, 50.00, 90.00, 'GK'),  -- Gardien
('41212', 2, 15.00, 70.00, 'DEF'), -- Défenseur gauche
('41212', 3, 40.00, 75.00, 'DEF'), -- Défenseur central gauche
('41212', 4, 60.00, 75.00, 'DEF'), -- Défenseur central droit
('41212', 5, 85.00, 70.00, 'DEF'), -- Défenseur droit
('41212', 6, 15.00, 45.00, 'MID'), -- Milieu gauche
('41212', 7, 50.00, 60.00, 'MID'), -- Milieu défensif
('41212', 8, 50.00, 35.00, 'MID'), -- Milieu offensif
('41212', 9, 85.00, 45.00, 'MID'), -- Milieu droit
('41212', 10, 35.00, 15.00, 'ATT'), -- Attaquant gauche
('41212', 11, 65.00, 15.00, 'ATT')  -- Attaquant droit
ON CONFLICT DO NOTHING;

INSERT INTO formation_positions (formation_id, position_order, x_coordinate, y_coordinate, position_type) VALUES
('352', 1, 50.00, 90.00, 'GK'),  -- Gardien
('352', 2, 20.00, 75.00, 'DEF'), -- Défenseur central gauche
('352', 3, 50.00, 75.00, 'DEF'), -- Défenseur central
('352', 4, 80.00, 75.00, 'DEF'), -- Défenseur central droit
('352', 5, 65.00, 55.00, 'MID'), -- Milieu défensif droit
('352', 6, 35.00, 55.00, 'MID'), -- Milieu défensif gauche
('352', 7, 10.00, 50.00, 'MID'), -- Milieu gauche
('352', 8, 50.00, 40.00, 'MID'), -- Milieu offensif
('352', 9, 90.00, 50.00, 'MID'), -- Milieu droit
('352', 10, 35.00, 20.00, 'ATT'), -- Attaquant gauche
('352', 11, 65.00, 20.00, 'ATT')  -- Attaquant droit
ON CONFLICT DO NOTHING;

INSERT INTO formation_positions (formation_id, position_order, x_coordinate, y_coordinate, position_type) VALUES
('532', 1, 50.00, 90.00, 'GK'),  -- Gardien
('532', 2, 10.00, 65.00, 'DEF'), -- Défenseur gauche
('532', 3, 30.00, 75.00, 'DEF'), -- Défenseur central gauche
('532', 4, 50.00, 75.00, 'DEF'), -- Défenseur central
('532', 5, 70.00, 75.00, 'DEF'), -- Défenseur central droit
('532', 6, 90.00, 65.00, 'DEF'), -- Défenseur droit
('532', 7, 65.00, 55.00, 'MID'), -- Milieu défensif droit
('532', 8, 35.00, 55.00, 'MID'), -- Milieu défensif gauche
('532', 9, 50.00, 40.00, 'MID'), -- Milieu offensif
('532', 10, 35.00, 20.00, 'ATT'), -- Attaquant gauche
('532', 11, 65.00, 20.00, 'ATT')  -- Attaquant droit
ON CONFLICT DO NOTHING;

-- Insertion de joueurs d'exemple
INSERT INTO players (name, rating, potential, position, age, nationality) VALUES
-- Gardiens
('Hugo Lloris', 85, 87, 'GK', 37, 'France'),
('Mike Maignan', 88, 90, 'GK', 29, 'France'),
('Gianluigi Donnarumma', 86, 92, 'GK', 25, 'Italie'),

-- Défenseurs
('Virgil van Dijk', 90, 90, 'DEF', 33, 'Pays-Bas'),
('Raphaël Varane', 87, 87, 'DEF', 31, 'France'),
('Achraf Hakimi', 85, 88, 'DEF', 26, 'Maroc'),
('Theo Hernandez', 84, 87, 'DEF', 27, 'France'),
('William Saliba', 82, 89, 'DEF', 23, 'France'),

-- Milieux
('Kevin De Bruyne', 91, 91, 'MID', 33, 'Belgique'),
('Luka Modrić', 88, 88, 'MID', 39, 'Croatie'),
('Jude Bellingham', 86, 94, 'MID', 21, 'Angleterre'),
('Pedri', 85, 92, 'MID', 22, 'Espagne'),
('Aurélien Tchouaméni', 83, 89, 'MID', 24, 'France'),

-- Attaquants
('Kylian Mbappé', 92, 95, 'ATT', 25, 'France'),
('Erling Haaland', 91, 94, 'ATT', 24, 'Norvège'),
('Vinicius Jr', 88, 92, 'ATT', 24, 'Brésil'),
('Ousmane Dembélé', 85, 87, 'ATT', 27, 'France'),
('Antoine Griezmann', 87, 87, 'ATT', 33, 'France')
ON CONFLICT DO NOTHING;

-- Création d'une équipe d'exemple
INSERT INTO teams (name, formation_id) VALUES
('Équipe de France', '433'),
('Real Madrid', '442'),
('Manchester City', '41212')
ON CONFLICT DO NOTHING;

-- Attribution des joueurs à l'équipe de France (formation 4-3-3)
INSERT INTO team_players (team_id, player_id, position_order, is_captain) VALUES
(1, 2, 1, FALSE),  -- Maignan (GK)
(1, 4, 2, FALSE),  -- Varane (DEF)
(1, 5, 3, FALSE),  -- Saliba (DEF)
(1, 6, 4, FALSE),  -- Hakimi (DEF)
(1, 7, 5, FALSE),  -- Hernandez (DEF)
(1, 10, 6, FALSE), -- Tchouaméni (MID)
(1, 8, 7, FALSE),  -- Modrić (MID)
(1, 9, 8, FALSE),  -- Bellingham (MID)
(1, 13, 9, FALSE), -- Dembélé (ATT)
(1, 12, 10, FALSE), -- Haaland (ATT)
(1, 11, 11, TRUE)  -- Mbappé (ATT) - Capitaine
ON CONFLICT DO NOTHING;
