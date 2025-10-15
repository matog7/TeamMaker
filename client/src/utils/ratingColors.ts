/**
 * Détermine la couleur CSS basée sur la note d'un joueur
 * @param rating - La note du joueur (0-100)
 * @returns La classe CSS correspondante à la couleur
 */
export const getRatingColor = (rating: number | null | undefined): string => {
    const note = rating || 0;

    if (note > 80) {
        return "bg-green-700";
    } else if (note > 70) {
        return "bg-green-500";
    } else if (note > 65) {
        return "bg-yellow-400";
    } else if (note > 60) {
        return "bg-yellow-500";
    } else {
        return "bg-red-500";
    }
};

/**
 * Détermine la couleur de texte basée sur la note d'un joueur
 * @param rating - La note du joueur (0-100)
 * @returns La classe CSS pour la couleur du texte
 */
export const getRatingTextColor = (rating: number | null | undefined): string => {
    const note = rating || 0;

    if (note > 80) {
        return "text-green-700";
    } else if (note > 70) {
        return "text-green-500";
    } else if (note > 65) {
        return "text-yellow-400";
    } else if (note > 60) {
        return "text-yellow-500";
    } else {
        return "text-red-500";
    }
};

/**
 * Détermine la couleur de bordure basée sur la note d'un joueur
 * @param rating - La note du joueur (0-100)
 * @returns La classe CSS pour la couleur de la bordure
 */
export const getRatingBorderColor = (rating: number | null | undefined): string => {
    const note = rating || 0;

    if (note > 80) {
        return "border-green-700";
    } else if (note > 70) {
        return "border-green-500";
    } else if (note > 65) {
        return "border-yellow-400";
    } else if (note > 60) {
        return "border-yellow-500";
    } else {
        return "border-red-500";
    }
};

/**
 * Détermine le niveau de qualité basé sur la note
 * @param rating - La note du joueur (0-100)
 * @returns Le niveau de qualité en français
 */
export const getRatingLevel = (rating: number | null | undefined): string => {
    const note = rating || 0;

    if (note > 80) {
        return "Excellent";
    } else if (note > 70) {
        return "Très bon";
    } else if (note > 65) {
        return "Bon";
    } else if (note > 60) {
        return "Correct";
    } else {
        return "Faible";
    }
};
