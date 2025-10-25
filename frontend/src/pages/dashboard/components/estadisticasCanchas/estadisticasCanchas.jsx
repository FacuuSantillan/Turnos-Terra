import React from 'react';
// Importa los íconos que usaremos
import { CalendarIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const EstadisticasCanchas = () => {
  return (

    <div className="px-6 py-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white rounded-xl shadow-lg p-6 flex items-center space-x-4">
          <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full ring-1 ring-blue-200">
            <CalendarIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div className='relative left-[5vh]'>
            <p className="text-sm font-medium text-gray-500">Turnos Hoy</p>
            <p className="text-2xl font-bold text-gray-900">0</p>
          </div>
        </div>

    
        <div className="bg-white rounded-xl shadow-lg p-6 flex items-center space-x-4">
       
          <div className="flex-shrink-0 bg-green-100 p-3 rounded-full ring-1 ring-green-200">
            <CheckCircleIcon className="h-6 w-6 text-green-600" />
          </div>
      
          <div className='relative left-[5vh]'>
            <p className="text-sm font-medium text-gray-500">Cancha 1</p>
            <p className="text-2xl font-bold text-gray-900">0</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 flex items-center space-x-4">
          <div className="flex-shrink-0 bg-purple-100 p-3 rounded-full ring-1 ring-purple-200">
            <CheckCircleIcon className="h-6 w-6 text-purple-600" />
          </div>
          <div className='relative left-[5vh]'>
            <p className="text-sm font-medium text-gray-500">Cancha 2</p>
            <p className="text-2xl font-bold text-gray-900">0</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EstadisticasCanchas;