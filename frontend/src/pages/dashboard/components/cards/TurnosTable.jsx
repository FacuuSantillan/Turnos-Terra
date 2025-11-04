import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTurnos, getTurnosFijos, deleteTurno } from '../../../../redux/actions';
import { PencilIcon, TrashIcon, CalendarDaysIcon, XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const formatFecha = (fechaString) => {
  if (!fechaString) return '';
  const [year, month, day] = fechaString.split('T')[0].split('-');
  return `${day}/${month}/${year}`;
};

const getDiaSemana = (num) => {
  const dias = ['Inválido', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  return dias[num] || 'Día inválido';
};

const TurnosTable = ({ onTurnoClick }) => {
  const dispatch = useDispatch();
  const turnos = useSelector((state) => state.turnos);
  const turnosFijos = useSelector((state) => state.turnosFijos);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [turnoAEliminar, setTurnoAEliminar] = useState(null);

  useEffect(() => {
    dispatch(getTurnos());
    dispatch(getTurnosFijos());
  }, [dispatch]);

  const turnosCombinados = useMemo(() => {
    const turnosNormales = turnos.map(t => ({
      ...t,
      tipo: 'Normal',
      fechaFormato: formatFecha(t.fecha)
    }));

    const turnosAbonos = turnosFijos.map(tf => ({
      ...tf,
      tipo: 'Fijo (Abono)',
      fechaFormato: getDiaSemana(tf.dia_semana)
    }));

    return [...turnosNormales, ...turnosAbonos];
  }, [turnos, turnosFijos]);

  // 🔥 CLICK EN ELIMINAR
  const handleEliminarClick = (turno) => {
    setTurnoAEliminar(turno);
    setShowConfirmModal(true);
  };

  // ✅ CONFIRMAR ELIMINACIÓN
  const confirmarEliminacion = async () => {
    if (!turnoAEliminar) return;

    try {
      await dispatch(deleteTurno(turnoAEliminar.id));
      setShowConfirmModal(false);
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 2000);
      dispatch(getTurnos());
    } catch (error) {
      console.error("Error al eliminar turno:", error);
    }
  };

  const cancelarEliminacion = () => {
    setShowConfirmModal(false);
    setTurnoAEliminar(null);
  };

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8 relative">
      <div className="flex items-center justify-between mb-6">
        <h2 className="flex items-center text-2xl font-bold text-gray-800">
          <CalendarDaysIcon className="h-7 w-7 text-emerald-600 mr-2" />
          Turnos Reservados
        </h2>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-[800px] border-collapse w-full">
          <thead className="bg-emerald-100/70">
            <tr>
              {['Cliente', 'Teléfono', 'Fecha / Día', 'Hora', 'Tipo', 'Cancha', 'Acciones'].map((header) => (
                <th
                  key={header}
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 bg-white">
            {turnosCombinados.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-10 text-center text-gray-500 text-sm italic"
                >
                  No hay turnos reservados.
                </td>
              </tr>
            ) : (
              turnosCombinados.map((turno, index) => (
                <tr
                  key={`${turno.tipo}-${turno.id || index}`}
                  onClick={() => onTurnoClick(turno)}
                  className="hover:bg-emerald-50 transition-colors duration-200 cursor-pointer"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-800 capitalize">
                    {turno.Usuario?.nombre} {turno.Usuario?.apellido}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {turno.Usuario?.telefono}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {turno.fechaFormato}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {turno.hora_inicio} a {turno.hora_fin}
                  </td>
                  <td className="px-6 py-4">
                    {turno.tipo === 'Normal' ? (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700 shadow-sm">
                        {turno.tipo}
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-lime-100 text-lime-700 shadow-sm">
                        {turno.tipo}
                      </span>
                    )}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 shadow-sm">
                      {turno.Cancha?.nombre}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-4 text-sm font-medium">
                    <button
                      className="flex items-center text-emerald-600 hover:text-emerald-800 transition-transform hover:scale-105"
                    >
                      <PencilIcon className="h-4 w-4 mr-1" />
                      Editar
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEliminarClick(turno);
                      }}
                      className="flex items-center text-red-600 hover:text-red-800 transition-transform hover:scale-105"
                    >
                      <TrashIcon className="h-4 w-4 mr-1" />
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🧱 MODAL CONFIRMACIÓN */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-96 transform transition-all duration-300 scale-105">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500 mr-2" />
                Confirmar eliminación
              </h3>
              <button onClick={cancelarEliminacion} className="text-gray-500 hover:text-gray-700">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              ¿Seguro que querés eliminar el turno de{' '}
              <span className="font-semibold text-gray-800">
                {turnoAEliminar?.Usuario?.nombre} {turnoAEliminar?.Usuario?.apellido}
              </span>?
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={cancelarEliminacion}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all duration-200 shadow-sm"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEliminacion}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ MODAL ÉXITO */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-xl flex items-center gap-3 animate-fade-in">
            <CheckCircleIcon className="h-6 w-6 text-green-500" />
            <p className="text-gray-800 font-medium">Turno eliminado correctamente</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TurnosTable;
