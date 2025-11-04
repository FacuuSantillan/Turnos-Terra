import React from 'react';
import { useDispatch } from 'react-redux';
import { XMarkIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { deleteTurno } from '../../../../redux/actions'; // Ajusta la ruta

// Helper para formatear la fecha
const formatFecha = (fechaString) => {
  if (!fechaString) return '';
  const [year, month, day] = fechaString.split('T')[0].split('-');
  return `${day}/${month}/${year}`;
};

const TurnoDetalleModal = ({ isOpen, onClose, turno }) => {
  const dispatch = useDispatch();

  const handleEliminar = async () => {
    // Pedir confirmación antes de borrar
    if (window.confirm(`¿Estás seguro de que quieres eliminar el turno de ${turno.Usuario.nombre}?`)) {
      await dispatch(deleteTurno(turno.id));
      onClose(); // Cierra el modal después de eliminar
    }
  };

  const handleEditar = () => {
    // Lógica para editar (podría abrir otro modal de edición)
    alert("Función 'Editar' aún no implementada.");
  };

  if (!isOpen || !turno) return null;

  return (
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
          {/* Detalles del Turno */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-500">Cliente</label>
              <p className="text-lg text-gray-900 capitalize">{turno.Usuario.nombre} {turno.Usuario.apellido}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Teléfono</label>
              <p className="text-lg text-gray-900">{turno.Usuario.telefono}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Fecha</label>
              <p className="text-lg text-gray-900">{formatFecha(turno.fecha)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Horarios</label>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full font-medium text-sm">
                  {turno.hora_inicio} - {turno.hora_fin}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Cancha</label>
              <p className="text-lg text-gray-900">{turno.Cancha.nombre}</p>
            </div>
          </div>
          
          {/* Botones de Acción */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
            <button
              onClick={handleEditar}
              className="flex-1 flex justify-center items-center gap-2 px-5 py-2.5 rounded-lg text-white font-medium bg-blue-600 hover:bg-blue-700 transition"
            >
              <PencilIcon className="h-5 w-5" />
              Editar
            </button>
            <button
              onClick={handleEliminar}
              className="flex-1 flex justify-center items-center gap-2 px-5 py-2.5 rounded-lg text-white font-medium bg-red-600 hover:bg-red-700 transition"
            >
              <TrashIcon className="h-5 w-5" />
              Eliminar Turno
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TurnoDetalleModal;