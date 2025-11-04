import React from "react";
import {
  PlusIcon,
  CalendarDaysIcon,
  ClockIcon,
  BuildingOfficeIcon,
  CalculatorIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";

const ActionBar = ({
  onNuevoTurnoClick,
  onVerDisponibilidadClick,
  onConfigurarClick,
  onCalculadoraClick,
  onTurnosFijosClick,
}) => {
  const buttonBase =
    "flex items-center justify-center space-x-2 px-5 py-3 rounded-lg font-semibold text-white shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  return (
    <div className="px-6 py-4">
      <div className="flex flex-wrap gap-3">
        <button
          onClick={onNuevoTurnoClick}
          className={`${buttonBase} bg-green-600 hover:bg-green-700 focus:ring-green-400`}
        >
          <PlusIcon className="h-5 w-5" />
          <span>Nuevo Turno</span>
        </button>

        <button
          onClick={onVerDisponibilidadClick}
          className={`${buttonBase} bg-blue-600 hover:bg-blue-700 focus:ring-blue-400`}
        >
          <CalendarDaysIcon className="h-5 w-5" />
          <span>Ver Disponibilidad</span>
        </button>

        <button
          onClick={onConfigurarClick}
          className={`${buttonBase} bg-purple-600 hover:bg-purple-700 focus:ring-purple-400`}
        >
          <ClockIcon className="h-5 w-5" />
          <span>Configurar Horarios</span>
        </button>

        <button
          onClick={onTurnosFijosClick}
          className={`${buttonBase} bg-cyan-600 hover:bg-cyan-700 focus:ring-cyan-400`}
        >
          <ArchiveBoxIcon className="h-5 w-5" />
          <span>Turnos Fijos (Abonos)</span>
        </button>

        <button
          onClick={onCalculadoraClick}
          className={`${buttonBase} bg-amber-700 hover:bg-amber-800 focus:ring-amber-500`}
        >
          <CalculatorIcon className="h-5 w-5" />
          <span>Calculadora</span>
        </button>
      </div>
    </div>
  );
};

export default ActionBar;
