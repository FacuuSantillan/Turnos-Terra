import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getHorarios, updateHorarioActivo } from '../../../../redux/actions'; 
import HorarioToggle from './HorarioToggle';

const ConfigurarHorariosModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const horariosGlobales = useSelector((state) => state.horarios);

  const [localHorarios, setLocalHorarios] = useState([]);

  useEffect(() => {
        dispatch(getHorarios()); 
    if (isOpen) {
      dispatch(getHorarios()); 
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (Array.isArray(horariosGlobales)) {
      setLocalHorarios(horariosGlobales);
    }
  }, [horariosGlobales]);

  const handleToggle = (id) => {
    setLocalHorarios(prevHorarios =>
      prevHorarios.map(h => 
        h.id === id ? { ...h, activo: !h.activo } : h
      )
    );
  };

  const handleSave = () => {

    localHorarios.forEach(horarioLocal => {
      const horarioOriginal = horariosGlobales.find(h => h.id === horarioLocal.id);

      if (horarioOriginal && horarioLocal.activo !== horarioOriginal.activo) {
        console.log(`Actualizando horario ${horarioLocal.id} a ${horarioLocal.activo}`);
        
        dispatch(updateHorarioActivo(horarioLocal.id, { 
          activo: horarioLocal.activo 
        }));
      }
    });

    onClose(); 
  };

const cancha1Horarios = localHorarios
    .filter(h => h.cancha_id === 1) 
    .sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));

  const cancha2Horarios = localHorarios
    .filter(h => h.cancha_id === 2) 
    .sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));

  if (!isOpen) return null;

  return (
    <div 
      className="fixed backdrop-blur-sm inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Configurar Horarios</h2>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="h-3 w-3 rounded-full bg-green-500"></span>
                <h3 className="relative left-1 top-0.5 text-lg font-semibold text-gray-800">
                  cancha 1 
                </h3>
              </div>
              <div className="space-y-4">
                {cancha1Horarios.map((h) => (
                  <div key={h.id} className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
                    <span className="font-medium text-gray-700">{h.hora_inicio}</span>
                    <HorarioToggle 
                      enabled={h.activo}
                      onChange={() => handleToggle(h.id)}
                      color="green"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="h-3 w-3 rounded-full bg-purple-500"></span>
                <h3 className="relative left-1 top-0.5 text-lg font-semibold text-gray-800">
                  cancha 2 
                </h3>
              </div>
              <div className="space-y-4">
                {cancha2Horarios.map((h) => (
                  <div key={h.id} className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
                    <span className="font-medium text-gray-700">{h.hora_inicio}</span>
                    <HorarioToggle 
                      enabled={h.activo}
                      onChange={() => handleToggle(h.id)}
                      color="purple"
                    />
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>

        <div className="p-6 bg-gray-50 rounded-b-xl flex justify-end space-x-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 font-medium transition-colors"
          >
            Cerrar
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-lg text-white bg-purple-600 hover:bg-purple-700 font-medium transition-colors"
          >
            Guardar Configuración
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigurarHorariosModal;