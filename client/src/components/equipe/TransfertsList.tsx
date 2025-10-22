import React, { useState } from "react";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeftRight,
} from "lucide-react";
import type { Transfert, TransfertCreate } from "../../interfaces";
import NewTransfertModal from "../modals/NewTransfertModal";
import { getRatingColor } from "../../utils/ratingColors";
import { transfertAPI } from "../../services/api";
import toast from "react-hot-toast";

interface TransfertsListProps {
  transferts: Transfert[];
  onCreateTransfert: (transfert: TransfertCreate) => void;
  onTransfertUpdated?: (transfert: Transfert) => void;
  onTransfertDeleted?: (transfertId: number) => void;
}

const TransfertsList: React.FC<TransfertsListProps> = ({
  transferts,
  onCreateTransfert,
  onTransfertUpdated,
  onTransfertDeleted,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState("mercato");
  const [editingTransfert, setEditingTransfert] = useState<Transfert | null>(
    null
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "achete":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "vendu":
        return <XCircle className="w-4 h-4 text-red-400" />;
      case "prete":
        return <TrendingUp className="w-4 h-4 text-blue-400" />;
      case "liste_suivi":
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case "liste_attente":
        return <TrendingDown className="w-4 h-4 text-orange-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "achete":
        return "bg-green-500/20 border-green-500/50 text-green-300";
      case "vendu":
        return "bg-red-500/20 border-red-500/50 text-red-300";
      case "prete":
        return "bg-blue-500/20 border-blue-500/50 text-blue-300";
      case "liste_suivi":
        return "bg-yellow-500/20 border-yellow-500/50 text-yellow-300";
      case "liste_attente":
        return "bg-orange-500/20 border-orange-500/50 text-orange-300";
      default:
        return "bg-gray-500/20 border-gray-500/50 text-gray-300";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "achete":
        return "Acheté";
      case "vendu":
        return "Vendu";
      case "prete":
        return "Prêté";
      case "liste_suivi":
        return "Liste de suivi";
      case "liste_attente":
        return "Liste d'attente";
      default:
        return status;
    }
  };

  const onUpdateTransfert = async (
    id: number,
    payload: Partial<TransfertCreate>
  ) => {
    try {
      const updated: Transfert = await transfertAPI.update(id, payload);
      if (onTransfertUpdated) onTransfertUpdated(updated);
      toast.success("Transfert mis à jour avec succès !");
      setIsModalOpen(false);
      setEditingTransfert(null);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la mise à jour du transfert");
    }
  };

  const handleDeleteTransfert = async (transfertId: number) => {
    try {
      await transfertAPI.delete(transfertId);
      if (onTransfertDeleted) {
        onTransfertDeleted(transfertId);
      }
      toast.success("Transfert supprimé avec succès !", {
        duration: 3000,
        position: "top-right",
        style: {
          background: "#10B981",
          color: "#fff",
        },
      });
    } catch (error) {
      console.error("Erreur lors de la suppression du transfert:", error);
      toast.error("Erreur lors de la suppression du transfert", {
        duration: 3000,
        position: "top-right",
        style: {
          background: "#EF4444",
          color: "#fff",
        },
      });
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <ArrowLeftRight className="w-5 h-5 text-green-300" />
          Transferts
        </h2>
        <div className="flex flex-row items-center gap-2">
          <span
            onClick={() => setStatus("mercato")}
            className={`min-w-20 text-center p-2 rounded-md text-sm font-medium bg-black/80 hover:bg-green-700 cursor-pointer transition-colors
                            ${
                              status === "mercato"
                                ? "text-green-300 bg-green-300/10"
                                : ""
                            } 
                            cursor-pointer`}
          >
            Mercato
          </span>
          <span
            onClick={() => setStatus("suivi")}
            className={`min-w-20 text-center p-2 rounded-md text-sm font-medium bg-black/80 hover:bg-green-700 cursor-pointer transition-colors
                            ${
                              status === "suivi"
                                ? "text-green-300 bg-green-300/10"
                                : ""
                            } 
                            cursor-pointer`}
          >
            Suivi
          </span>
        </div>
        <button
          onClick={() => {
            setEditingTransfert(null);
            setIsModalOpen(true);
          }}
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
          {transferts.length > 0 && (
            <div className="flex flex-row items-center gap-2">
              <span className="text-gray-400 text-sm">
                {transferts.length} transferts
              </span>
              <span className="text-gray-400 text-sm">|</span>
              <span className="text-gray-400 text-sm">
                {
                  transferts.filter(
                    (transfert) => transfert.status === "achete"
                  ).length
                }{" "}
                achetés pour{" "}
                {transferts
                  .filter((transfert) => transfert.status === "achete")
                  .reduce(
                    (acc, transfert) =>
                      acc +
                      parseFloat(
                        transfert.price === "Gratuit" ? "0€" : transfert.price
                      ),
                    0
                  )}{" "}
                M€
              </span>
              <span className="text-gray-400 text-sm">|</span>
              <span className="text-gray-400 text-sm">
                {
                  transferts.filter((transfert) => transfert.status === "prete")
                    .length
                }{" "}
                prêtés
              </span>
              <span className="text-gray-400 text-sm">|</span>
              <span className="text-gray-400 text-sm">
                {
                  transferts.filter((transfert) => transfert.status === "vendu")
                    .length
                }{" "}
                vendus pour{" "}
                {transferts
                  .filter((transfert) => transfert.status === "vendu")
                  .reduce(
                    (acc, transfert) => acc + parseFloat(transfert.price),
                    0
                  )}{" "}
                M€
              </span>
              <span className="text-gray-400 text-sm">|</span>
              <span className="text-gray-400 text-sm">
                {
                  transferts.filter((transfert) => transfert.status === "prete")
                    .length
                }{" "}
                prêtés
              </span>
              <span className="text-gray-400 text-sm">|</span>
              <span className="text-gray-400 text-sm">
                {
                  transferts.filter(
                    (transfert) => transfert.status === "liste_suivi"
                  ).length
                }{" "}
                en liste de suivi
              </span>
              <span className="text-gray-400 text-sm">|</span>
              <span
                className={`text-gray-400 text-sm ${
                  transferts
                    .filter((transfert) => transfert.status === "achete")
                    .reduce(
                      (acc, transfert) =>
                        acc +
                        parseFloat(
                          transfert.price === "Gratuit" ? "0€" : transfert.price
                        ),
                      0
                    ) -
                    transferts
                      .filter((transfert) => transfert.status === "vendu")
                      .reduce(
                        (acc, transfert) => acc + parseFloat(transfert.price),
                        0
                      ) >
                  0
                    ? "text-red-400"
                    : "text-green-400"
                }`}
              >
                Résultat net :{" "}
                {Math.abs(
                  transferts
                    .filter((transfert) => transfert.status === "achete")
                    .reduce(
                      (acc, transfert) =>
                        acc +
                        parseFloat(
                          transfert.price === "Gratuit" ? "0€" : transfert.price
                        ),
                      0
                    ) -
                    transferts
                      .filter((transfert) => transfert.status === "vendu")
                      .reduce(
                        (acc, transfert) => acc + parseFloat(transfert.price),
                        0
                      )
                ).toFixed(2)}{" "}
                M€
              </span>
            </div>
          )}
          {transferts
            .filter((transfert) =>
              status === "mercato"
                ? transfert.status === "achete" ||
                  transfert.status === "vendu" ||
                  transfert.status === "prete"
                : transfert.status === "liste_suivi" ||
                  transfert.status === "liste_attente"
            )
            .map((transfert) => (
              <div
                key={transfert.id}
                className="bg-gray-50/10 border-gray-200/20 rounded-lg border p-4 cursor-pointer hover:bg-gray-200/20 hover:border-[#03af62] transition-colors relative group"
                onClick={() => {
                  setEditingTransfert(transfert);
                  setIsModalOpen(true);
                }}
              >
                {/* Bouton de suppression */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTransfert(transfert.id);
                  }}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shadow-lg"
                  title="Supprimer le transfert"
                >
                  ×
                </button>
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
                          {transfert.send_to
                            ? `Vers: ${transfert.send_to}`
                            : transfert.from
                            ? `Ancien club: ${transfert.from}`
                            : ""}{" "}
                          {transfert.price}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {transfert.tags?.map((tag, index) => (
                          <div
                            key={index}
                            className="rounded-full px-2 py-1 text-xs text-white bg-white"
                            style={{ backgroundColor: tag.color }}
                          >
                            {tag.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row items-center gap-5">
                    <div className="flex flex-row items-center gap-1">
                      <span
                        className={`px-2 py-1 rounded-full text-white text-xs font-medium ${getRatingColor(
                          transfert.overall
                        )}`}
                      >
                        {transfert.overall}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-white text-xs font-medium ${getRatingColor(
                          transfert.potential
                        )}`}
                      >
                        {transfert.potential}
                      </span>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        transfert.status
                      )}`}
                    >
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
        onUpdateTransfert={onUpdateTransfert}
        transfertToEdit={editingTransfert}
      />
    </div>
  );
};

export default TransfertsList;
