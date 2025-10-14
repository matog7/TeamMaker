import React, { useState } from 'react';
import { Plus, TrendingUp, TrendingDown, Clock, CheckCircle, XCircle } from 'lucide-react';
import type { Transfert, Player, TransfertCreate } from '../interfaces';
import NewTransfertModal from './NewTransfertModal';

interface TransfertsListProps {
    transferts: Transfert[];
    players: Record<number, Player>;
    onCreateTransfert: (transfert: TransfertCreate) => void;
}

const TransfertsList: React.FC<TransfertsListProps> = ({
    transferts,
    players,
    onCreateTransfert
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'achete':
                return <CheckCircle className="w-4 h-4 text-green-400" />;
            case 'vendu':
                return <XCircle className="w-4 h-4 text-red-400" />;
            case 'prete':
                return <TrendingUp className="w-4 h-4 text-blue-400" />;
            case 'liste_suivi':
                return <Clock className="w-4 h-4 text-yellow-400" />;
            case 'liste_attente':
                return <TrendingDown className="w-4 h-4 text-orange-400" />;
            default:
                return <Clock className="w-4 h-4 text-gray-400" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'achete':
                return 'bg-green-500/20 border-green-500/50 text-green-300';
            case 'vendu':
                return 'bg-red-500/20 border-red-500/50 text-red-300';
            case 'prete':
                return 'bg-blue-500/20 border-blue-500/50 text-blue-300';
            case 'liste_suivi':
                return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300';
            case 'liste_attente':
                return 'bg-orange-500/20 border-orange-500/50 text-orange-300';
            default:
                return 'bg-gray-500/20 border-gray-500/50 text-gray-300';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'achete':
                return 'Acheté';
            case 'vendu':
                return 'Vendu';
            case 'prete':
                return 'Prêté';
            case 'liste_suivi':
                return 'Liste de suivi';
            case 'liste_attente':
                return 'Liste d\'attente';
            default:
                return status;
        }
    };

    const getPlayerName = (playerId: number) => {
        const player = players[playerId];
        return player ? player.name : `Joueur #${playerId}`;
    };

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    Transferts
                </h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Nouveau
                </button>
            </div>

            {transferts.length === 0 ? (
                <div className="text-gray-400 text-center py-8">
                    Aucun transfert enregistré
                </div>
            ) : (
                <div className="space-y-3">
                    {transferts.map((transfert) => (
                        <div
                            key={transfert.id}
                            className="bg-gray-800/50 rounded-lg p-4 border border-gray-600/50"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {getStatusIcon(transfert.status)}
                                    <div>
                                        <div className="text-white font-medium">
                                            {getPlayerName(transfert.player_id)}
                                        </div>
                                        <div className="text-gray-400 text-sm">
                                            {transfert.price}
                                        </div>
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(transfert.status)}`}>
                                    {getStatusLabel(transfert.status)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <NewTransfertModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreateTransfert={onCreateTransfert}
                players={players}
            />
        </div>
    );
};

export default TransfertsList;