import React, { useState } from 'react';
import { Plus, TrendingUp, TrendingDown, Clock, CheckCircle, XCircle, ArrowLeftRight } from 'lucide-react';
import type { Transfert, TransfertCreate } from '../interfaces';
import NewTransfertModal from './NewTransfertModal';
import { getRatingColor } from '../utils/ratingColors';

interface TransfertsListProps {
    transferts: Transfert[];
    onCreateTransfert: (transfert: TransfertCreate) => void;
}

const TransfertsList: React.FC<TransfertsListProps> = ({
    transferts,
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

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <ArrowLeftRight className="w-5 h-5 text-green-300" />
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
                <div className="text-gray-400 text-center text-sm py-8">
                    Aucun transfert enregistré
                </div>
            ) : (
                <div className="space-y-3">
                    {transferts.map((transfert) => (
                        <div
                            key={transfert.id}
                            className="bg-gray-50/10 border-gray-200/20 rounded-lg border p-4 cursor-pointer hover:bg-gray-200/20 hover:border-[#03af62] transition-colors relative"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex flex-row items-center gap-3">
                                    {getStatusIcon(transfert.status)}
                                    <div className="flex flex-row items-center gap-3">
                                        {transfert.photo ? (
                                            <img
                                                src={`/uploads/${transfert.photo}`}
                                                alt={transfert.player_name}
                                                className="w-10 h-10 rounded-full object-cover border border-gray-200/20"
                                            />
                                        ) : (
                                            <div className="min-w-10 min-h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 text-sm">
                                                {(transfert.player_name || "J")
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")
                                                    .toUpperCase()}
                                            </div>
                                        )}
                                        <div className="flex flex-col items-start">
                                            <div className="text-white font-medium">
                                                {transfert.player_name}
                                            </div>
                                            <div className="text-gray-400 text-sm">
                                                {transfert.send_to ? `Vers: ${transfert.send_to}` : transfert.from ? transfert.from : ''} {transfert.price}
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {transfert.tags?.map((tag, index) => (
                                                <div key={index} className="rounded-full px-2 py-1 text-xs text-white bg-white" style={{ backgroundColor: tag.color }}>
                                                    {tag.name}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-row items-center gap-5">
                                    <div className="flex flex-row items-center gap-1">
                                        <span className={`px-2 py-1 rounded-full text-white text-xs font-medium ${getRatingColor(transfert.overall)}`}>
                                            {transfert.overall}
                                        </span>
                                        <span className={`px-2 py-1 rounded-full text-white text-xs font-medium ${getRatingColor(transfert.potential)}`}>
                                            {transfert.potential}
                                        </span>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(transfert.status)}`}>
                                        {getStatusLabel(transfert.status)}
                                    </div>
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
            />
        </div>
    );
};

export default TransfertsList;