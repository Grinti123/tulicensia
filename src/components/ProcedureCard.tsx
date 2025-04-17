import React, { useCallback } from 'react';
import { Procedure } from '../types/store';
import { useProceduresStore } from '../store/proceduresStore';

interface ProcedureCardProps {
  procedure: Procedure;
}

export const ProcedureCard = React.memo(({ procedure }: ProcedureCardProps) => {
  const selectProcedure = useProceduresStore((state) => state.selectProcedure);

  const handleSelect = useCallback(() => {
    selectProcedure(procedure);
  }, [procedure, selectProcedure]);

  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={handleSelect}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{procedure.name}</h3>
        <span className="text-primary-600 font-medium">
          ${procedure.price}
        </span>
      </div>
      <p className="text-gray-600 mb-4">{procedure.description}</p>
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>{procedure.duration} minutes</span>
        <span className="bg-gray-100 px-2 py-1 rounded">
          {procedure.category}
        </span>
      </div>
    </div>
  );
});

ProcedureCard.displayName = 'ProcedureCard';
