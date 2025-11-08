import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getHorarios, updateHorarioActivo } from '../../../../redux/actions'; 
import HorarioToggle from './HorarioToggle';

const ConfigurarHorariosModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const horariosGlobales = useSelector((state) => state.horarios);

  const [localHorarios, setLocalHorarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      dispatch(getHorarios()).then(() => setLoading(false));
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (Array.isArray(horariosGlobales)) {
      setLocalHorarios(horariosGlobales);
      setLoading(false);
    }
  }, [horariosGlobales]);

  const handleToggle = (id) => {
    setLocalHorarios((prev) =>
      prev.map((h) => (h.id === id ? { ...h, activo: !h.activo } : h))
    );
  };

  const handleSave = () => {
    localHorarios.forEach((hLocal) => {
      const hOriginal = horariosGlobales.find((h) => h.id === hLocal.id);
      if (hOriginal && hLocal.activo !== hOriginal.activo) {
        dispatch(updateHorarioActivo(hLocal.id, { activo: hLocal.activo }));
      }
    });
    onClose();
  };

  const cancha1Horarios = localHorarios
    .filter((h) => h.cancha_id === 1)
    .sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));

  const cancha2Horarios = localHorarios
    .filter((h) => h.cancha_id === 2)
    .sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            Configurar Horarios
          </h2>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-6">
              <div className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-700 font-medium text-lg animate-pulse">
                Cargando horarios...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Cancha 1 */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <span className="h-3 w-3 relative right-1 top-[-0.4vh] rounded-full bg-green-500"></span>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Cancha 1
                  </h3>
                </div>
                <div className="space-y-3">
                  {cancha1Horarios.map((h) => (
                    <div
                      key={h.id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-green-50 transition shadow-sm"
                    >
                      <span className="font-medium text-gray-700">
                        {h.hora_inicio}
                      </span>
                      <HorarioToggle
                        enabled={h.activo}
                        onChange={() => handleToggle(h.id)}
                        color="green"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Cancha 2 */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <span className="relative right-1 top-[-0.4vh] h-3 w-3 rounded-full bg-purple-500"></span>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Cancha 2
                  </h3>
                </div>
                <div className="space-y-3">
                  {cancha2Horarios.map((h) => (
                    <div
                      key={h.id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-purple-50 transition shadow-sm"
                    >
                      <span className="font-medium text-gray-700">
                        {h.hora_inicio}
                      </span>
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
          )}
        </div>

        {/* Footer */}
        {!loading && (
          <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 font-medium transition"
            >
              Cerrar
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 rounded-lg text-white bg-purple-600 hover:bg-purple-700 font-medium transition"
            >
              Guardar Configuración
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfigurarHorariosModal;
