/**
 * Détermine la couleur CSS basée sur la note d'un joueur
 * @param rating - La note du joueur (0-100)
 * @returns La classe CSS correspondante à la couleur
 */
export const getRatingColor = (rating: number | null | undefined): string => {
    const note = rating || 0;

    if (note > 80) {
        return "bg-green-700";
    } else if (note > 70 && note <= 80) {
        return "bg-green-500";
    } else if (note > 65 && note <= 70) {
        return "bg-yellow-400";
    } else if (note > 60 && note <= 65) {
        return "bg-yellow-500";
    } else if (note >= 50 && note <= 60) {
        return "bg-yellow-600";
    }

    else {
        return "bg-red-500";
    }
};
