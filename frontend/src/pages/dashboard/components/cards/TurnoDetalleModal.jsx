import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  XMarkIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { deleteTurno } from '../../../../redux/actions';

const formatFecha = (fechaString) => {
  if (!fechaString) return '';
  const [year, month, day] = fechaString.split('T')[0].split('-');
  return `${day}/${month}/${year}`;
};

const TurnoDetalleModal = ({ isOpen, onClose, turno }) => {
  const dispatch = useDispatch();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleEliminar = async () => {
    try {
      setShowConfirm(false);
      setShowSuccess(true);

      setTimeout(async () => {
        dispatch(deleteTurno(turno.id));
        onClose();
        setShowSuccess(false);
      }, 1500);
      
    } catch (error) {
      console.error('❌ Error al eliminar turno:', error);
    }
  };

  const handleConfirm = () => {
    setShowConfirm(true);
  };

  const handleEditar = () => {
    console.log('📝 Editar turno:', turno);
  };

  if (!isOpen || !turno) return null;

  return (
    <>
      {/* Fondo + Modal principal */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative border border-gray-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Botón cerrar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          {/* Título */}
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Detalle del Turno
          </h2>

          {/* Contenido */}
          <div className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500">Cliente</label>
                <p className="text-lg text-gray-900 capitalize">
                  {turno.Usuario?.nombre} {turno.Usuario?.apellido}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Teléfono</label>
                <p className="text-lg text-gray-900">{turno.Usuario?.telefono}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Fecha</label>
                <p className="text-lg text-gray-900">{formatFecha(turno.fecha)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Horarios</label>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full font-medium text-sm inline-block mt-1">
                  {turno.hora_inicio} - {turno.hora_fin}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Cancha</label>
                <p className="text-lg text-gray-900">{turno.Cancha?.nombre}</p>
              </div>
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
              <button
                onClick={handleEditar}
                className="flex-1 flex justify-center items-center gap-2 px-5 py-2.5 rounded-lg text-white font-medium bg-blue-600 hover:bg-blue-700 transition"
              >
                <PencilIcon className="h-5 w-5" />
                Editar
              </button>
              <button
                onClick={() => setShowConfirm(true)}
                className="flex-1 flex justify-center items-center gap-2 px-5 py-2.5 rounded-lg text-white font-medium bg-red-600 hover:bg-red-700 transition"
              >
                <TrashIcon className="h-5 w-5" />
                Eliminar Turno
              </button>
            </div>
          </div>
        </div>

        {/* Modal de confirmación centrado */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[60] animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-80 text-center animate-scaleIn">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Confirmar eliminación
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                ¿Seguro que querés eliminar el turno de{' '}
                <span className="font-semibold text-gray-900">
                  {turno.Usuario?.nombre} {turno.Usuario?.apellido}
                </span>?
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleEliminar}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ✅ Alerta centrada */}
      {showSuccess && (
        <div className="fixed inset-0 flex justify-center items-center z-[9999] animate-fadeIn">
          <div className="bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-slideUp">
            <CheckCircleIcon className="h-6 w-6" />
            <span className="font-medium">Turno eliminado con éxito</span>
          </div>
        </div>
      )}
    </>
  );
};

export default TurnoDetalleModal;
