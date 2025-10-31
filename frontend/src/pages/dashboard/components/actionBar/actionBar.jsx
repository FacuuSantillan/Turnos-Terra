import React from 'react';
import { 
  PlusIcon, 
  CalendarDaysIcon, 
  ClockIcon, 
  BuildingOfficeIcon, 
  CalculatorIcon
} from '@heroicons/react/24/outline';

const ActionBar = ({ onNuevoTurnoClick, onVerDisponibilidadClick, onConfigurarClick, onCalculadoraClick }) => {
  return (
    <div className="px-6 py-4">
      <div className="flex flex-wrap items-center gap-3">
        
        <button
          onClick={onNuevoTurnoClick}
          className="flex items-center space-x-2 px-5 py-3 rounded-lg text-white font-semibold shadow-md
                     bg-green-600 hover:bg-green-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Nuevo Turno</span>
        </button>

        <button
          onClick={onVerDisponibilidadClick}
          className="relative flex items-center space-x-2 px-5 py-3 rounded-lg text-white font-semibold shadow-md
                     bg-blue-600 hover:bg-blue-700 transition-colors"
        >
         
          <CalendarDaysIcon className="h-5 w-5" />
          <span>Ver Disponibilidad</span>
        </button>

        <button
          onClick={onConfigurarClick}
          className="flex items-center space-x-2 px-5 py-3 rounded-lg text-white font-semibold shadow-md
                     bg-purple-600 hover:bg-purple-700 transition-colors"
        >
          <ClockIcon className="h-5 w-5" />
          <span>Configurar Horarios</span>
        </button>

        <button
          onClick={onCalculadoraClick}
          className="flex items-center space-x-2 px-5 py-3 rounded-lg text-white font-semibold shadow-md
                     bg-amber-700 hover:bg-amber-800 transition-colors"
        >
          <CalculatorIcon className="h-5 w-5" />
          <span>Calculadora</span>
        </button>

      </div>
    </div>
  );
};

export default ActionBar;