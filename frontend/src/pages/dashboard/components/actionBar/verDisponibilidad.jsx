import React, { useState } from 'react';

const cancha1Horarios = [
  { time: '08:00', status: 'Disponible' },
  { time: '09:30', status: 'Disponible' },
  { time: '11:00', status: 'Reservado' },
  { time: '12:30', status: 'Disponible' },
  { time: '14:00', status: 'Disponible' },
  { time: '15:30', status: 'Disponible' },
  { time: '17:00', status: 'Reservado' },
  { time: '18:30', status: 'Disponible' },
  { time: '20:00', status: 'Disponible' },
  { time: '21:30', status: 'Disponible' },
];
const cancha2Horarios = [
  { time: '08:00', status: 'Disponible' },
  { time: '09:30', status: 'Disponible' },
  { time: '11:00', status: 'Disponible' },
  { time: '12:30', status: 'Disponible' },
  { time: '14:00', status: 'Reservado' },
  { time: '15:30', status: 'Disponible' },
  { time: '17:00', status: 'Disponible' },
  { time: '18:30', status: 'Disponible' },
  { time: '20:00', status: 'Reservado' },
  { time: '21:30', status: 'Disponible' },
];

const HorarioRow = ({ time, status }) => {
  const isDisponible = status === 'Disponible';
  
  // Clases condicionales para el estilo
  const statusClasses = isDisponible
    ? 'bg-green-50 border-green-200'
    : 'bg-red-50 border-red-200';
  const textClasses = isDisponible ? 'text-green-700' : 'text-red-700';
  const timeClasses = isDisponible ? 'text-gray-700' : 'text-red-400 line-through';

  return (
    <div 
      className={`flex justify-between items-center p-3 rounded-lg border ${statusClasses}`}
    >
      <span className={`font-medium ${timeClasses}`}>
        {time}
      </span>
      <span className={`font-semibold ${textClasses}`}>
        {status}
      </span>
    </div>
  );
};

const verDisponibilidadModal = ({ isOpen, onClose }) => {

const getHoyFecha = () => {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0'); 
    const dd = String(hoy.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`; 
  };

  const [selectedDate, setSelectedDate] = useState(getHoyFecha());

  if (!isOpen) return null;

  return (
    <div 
      className="backdrop-blur-sm fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Disponibilidad de Canchas</h2>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="mb-6">
            <label htmlFor="fechaDisp" className="block text-sm font-medium text-gray-700 mb-1">
              Seleccionar Fecha
            </label>
            <input
              type="date"
              id="fechaDisp"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div>
              <div className="flex items-center space-x-2 mb-3 ">
                <span className="h-3 w-3 rounded-full bg-green-500"></span>
                <h3 className=" relative left-2 top-0.5 text-lg font-semibold text-gray-800">
                  cancha 1 
                </h3>
              </div>
              <div className="space-y-2">
                {cancha1Horarios.map((h) => (
                  <HorarioRow key={h.time} time={h.time} status={h.status} />
                ))}
              </div>
            </div>

            <div className='gap-2'>
              <div className="flex items-center space-x-2 mb-3 ">
                <span className=" h-3 w-3 rounded-full bg-purple-500"></span>
                <h3 className="relative left-2 top-0.5 text-lg font-semibold text-gray-800">
                  cancha 2 
                </h3>
              </div>
              <div>
                {cancha2Horarios.map((h) => (
                  <HorarioRow key={h.time} time={h.time} status={h.status} />
                ))}
              </div>
            </div>
            
          </div>
        </div>

        <div className="p-6 bg-gray-50 rounded-b-xl flex justify-end border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 font-medium transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default verDisponibilidadModal;