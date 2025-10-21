import React from "react";
import { motion } from "framer-motion";
import type { Player, FormationWithPositions } from "../interfaces";

interface FootballFieldProps {
  selectedFormation: FormationWithPositions | null;
  players: Record<number, Player>;
  onPlayerClick: (index: number) => void;
}

const FootballField: React.FC<FootballFieldProps> = ({
  selectedFormation,
  players,
  onPlayerClick,
}) => {
  return (
    <motion.div
      className="bg-green-300/10 rounded-lg border border-gray-500/50 flex flex-col border-dashed bg-blur-md"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-6 border-b border-gray-200/10 border-dashed">
        <h2 className="text-lg font-semibold text-center text-white">
          Le XI de départ
        </h2>
      </div>
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="relative bg-gradient-to-b from-green-700 to-green-800 rounded-lg shadow-lg overflow-hidden w-full h-full max-w-[600px] max-h-[700px] aspect-[3/4]">
          {/* Motif du terrain */}
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_25%,rgba(255,255,255,0.1)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.1)_75%)] bg-[length:20px_20px]"></div>
          {/* Lignes du terrain */}
          <div className="absolute inset-0 border-4 border-white rounded-lg">
            {/* Cercle central */}
            <div className="absolute top-1/2 left-1/2 w-32 h-32 border-4 border-white rounded-full -translate-x-1/2 -translate-y-1/2" />
            {/* Surface de réparation haut */}
            <div className="absolute top-0 left-1/2 w-64 h-32 border-4 border-white border-t-0 -translate-x-1/2">
              <div className="absolute top-0 left-1/2 w-16 h-16 border-4 border-white border-t-0 rounded-b-full -translate-x-1/2"></div>
            </div>
            {/* Surface de réparation bas */}
            <div className="absolute bottom-0 left-1/2 w-64 h-32 border-4 border-white border-b-0 -translate-x-1/2">
              <div className="absolute bottom-0 left-1/2 w-16 h-16 border-4 border-white border-b-0 rounded-t-full -translate-x-1/2"></div>
            </div>
          </div>
          {/* Positions des joueurs */}
          {selectedFormation?.positions.map((position, index) => (
            <motion.div
              key={index}
              className="absolute cursor-pointer shadow-lg "
              style={{
                left: `${position.x_coordinate}%`,
                top: `${position.y_coordinate}%`,
                transform: "translate(-50%, -50%)",
              }}
              onClick={() => onPlayerClick(index)}
            >
              {players[index] && players[index]?.id !== 0 ? (
                <div className="flex flex-col items-center">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200/50 shadow-lg ">
                    {players[index].photo ? (
                      <img
                        src={`/uploads/${players[index].photo}`}
                        alt="photo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 text-lg font-bold">
                        {(players[index].name || "J")
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div
                    className={`absolute -top-2  transform -translate-x-1/2 text-xs font-bold ${
                      players[index].rating && players[index].rating > 70
                        ? "bg-green-600"
                        : players[index].rating && players[index].rating > 60
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    } text-white rounded-full px-2 py-1 border-2 border-gray-200/50 shadow-md `}
                  >
                    {players[index].rating}
                  </div>
                  {players[index].is_captain && (
                    <div className="absolute -bottom-[-25px] right-0 transform -translate-x-1/2 text-xs font-bold bg-orange-500 text-white rounded-full px-1 py-1 border-2 border-gray-200/50 shadow-md">
                      C
                    </div>
                  )}
                  <div className="font-bold text-xs text-white mt-1 text-center bg-gray-200/20 px-1 py-0.5 backdrop-blur-sm rounded max-w-25 truncate">
                    {players[index].name}
                  </div>
                </div>
              ) : (
                <div className="w-16 h-16 bg-white/20 border-2 border-dashed border-gray-200/50 rounded-full flex items-center justify-center">
                  <div className="text-white text-2xl font-bold">+</div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default FootballField;
