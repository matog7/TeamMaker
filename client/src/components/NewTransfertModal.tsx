import React, { useState } from "react";
import { X, Plus } from "lucide-react";
import type { TransfertCreate, Player } from "../interfaces";

interface NewTransfertModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateTransfert: (transfert: TransfertCreate) => void;
    players: Record<number, Player>;
}

const NewTransfertModal: React.FC<NewTransfertModalProps> = ({
    isOpen,
    onClose,
    onCreateTransfert,
    players
}) => {
    const [formData, setFormData] = useState<TransfertCreate>({
        player_id: 0,
        status: 'liste_suivi',
        price: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.player_id && formData.price) {
            onCreateTransfert(formData);
            setFormData({
                player_id: 0,
                status: 'liste_suivi',
                price: ''
            });
            onClose();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'player_id' ? parseInt(value) : value
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                        <Plus className="w-5 h-5 text-green-400" />
                        Nouveau Transfert
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Joueur
                        </label>
                        <select
                            name="player_id"
                            value={formData.player_id}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        >
                            <option value={0}>Sélectionner un joueur</option>
                            {Object.values(players).map((player) => (
                                <option key={player.id} value={player.id}>
                                    {player.name} - {player.position} ({player.rating})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Statut
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        >
                            <option value="liste_suivi">Liste de suivi</option>
                            <option value="liste_attente">Liste d'attente</option>
                            <option value="achete">Acheté</option>
                            <option value="vendu">Vendu</option>
                            <option value="prete">Prêté</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Prix
                        </label>
                        <input
                            type="text"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="Ex: 15M€, 2.5M€, Gratuit..."
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                        >
                            Créer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewTransfertModal;
