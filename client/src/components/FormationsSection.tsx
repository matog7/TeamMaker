import React from "react";
import type { FormationWithPositions } from "../interfaces";

interface FormationsSectionProps {
  formations: FormationWithPositions[];
  selectedFormation: FormationWithPositions | null;
  onFormationSelect: (formation: FormationWithPositions) => void;
}

const FormationsSection: React.FC<FormationsSectionProps> = ({
  formations,
  selectedFormation,
  onFormationSelect,
}) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-white mb-4">Formation</h2>
      <div className="grid grid-cols-3 gap-3">
        {formations.map((formation) => (
          <button
            key={formation.id}
            onClick={() => onFormationSelect(formation)}
            className={`p-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
              selectedFormation?.id === formation.id
                ? "isHighlighted"
                : "notHighlighted"
            }`}
          >
            {formation.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FormationsSection;
