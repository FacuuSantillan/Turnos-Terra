import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TurnoForm from '../hooks/turnoForm';
import TurnoDetalleModal from './TurnoDetalleModal';

import {
  getTurnos,
  getTurnosFijos,
  deleteTurno,
  updateTurno,
  getHorarios,
  getTurnosFijosLiberados,
} from '../../../../redux/actions';

import {
  CalendarDaysIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const formatFecha = (fechaString) => {
  if (!fechaString) return '';
  const [year, month, day] = fechaString.split('T')[0].split('-');
  return `${day}/${month}/${year}`;
};

const getDiaSemana = (num) => {
  const dias = [
    'Inválido',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ];
  return dias[num] || 'Día inválido';
};

const TurnosTable = () => {
  const dispatch = useDispatch();
  const turnos = useSelector((state) => state.turnos);
  const turnosFijos = useSelector((state) => state.turnosFijos);
  const horarios = useSelector((state) => state.horarios);
  const liberados = useSelector((state) => state.liberados);

  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);

  const [turnoAEliminar, setTurnoAEliminar] = useState(null);
  const [turnoAEditar, setTurnoAEditar] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    fecha: '',
    cancha: '',
    horas: [],
  });

  const [showDetalleModal, setShowDetalleModal] = useState(false);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        dispatch(getTurnos()),
        dispatch(getTurnosFijos()),
        dispatch(getHorarios()),
        dispatch(getTurnosFijosLiberados()),
      ]);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const turnosCombinados = useMemo(() => {
    const normales = turnos.map((t) => ({
      ...t,
      tipo: 'Normal',
      fechaFormato: formatFecha(t.fecha),
    }));
    const fijos = turnosFijos.map((tf) => ({
      ...tf,
      tipo: 'Fijo',
      fechaFormato: getDiaSemana(tf.dia_semana),
    }));
    return [...normales, ...fijos];
  }, [turnos, turnosFijos]);

  const handleEliminarClick = (turno) => {
    setTurnoAEliminar(turno);
    setShowConfirmModal(true);
  };

  const confirmarEliminacion = async () => {
    if (!turnoAEliminar) return;
    try {
      await dispatch(deleteTurno(turnoAEliminar.id));
      setShowConfirmModal(false);
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 2000);
      fetchData();
    } catch (error) {
      console.error('Error al eliminar turno:', error);
    }
  };

  const handleEditarClick = (turno) => {
    setTurnoAEditar(turno);
    setFormData({
      nombre: turno.Usuario?.nombre || '',
      apellido: turno.Usuario?.apellido || '',
      telefono: turno.Usuario?.telefono || '',
      fecha: turno.fecha?.split('T')[0] || '',
      cancha: turno.Cancha?.id || '',
      horas: [turno.HorarioId].filter(Boolean),
    });
    setShowEditModal(true);
  };

  const handleGuardarCambios = async () => {
    if (!turnoAEditar) return;
    try {
      const payload = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono,
        fecha: formData.fecha,
        canchaId: Number(formData.cancha),
        horas: formData.horas,
      };

      const response = await dispatch(updateTurno(turnoAEditar.id, payload));

      if (response?.success) {
        setShowEditModal(false);
        setShowUpdateSuccess(true);
        fetchData();
        setTimeout(() => setShowUpdateSuccess(false), 2000);
      } else {
        alert('Error al guardar los cambios');
      }
    } catch (error) {
      console.error('Error al guardar cambios:', error);
    }
  };

  const handleVerDetalle = (turno) => {
    setTurnoSeleccionado(turno);
    setShowDetalleModal(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="tennis-ball"></div>
        <p className="text-gray-600 font-medium">Cargando turnos...</p>
      </div>
    );
  }

  const handleDetalleModalClose = () => {
    setShowDetalleModal(false);
    fetchData();
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 relative">
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
              {[
                'Cliente',
                'Teléfono',
                'Fecha / Día',
                'Hora',
                'Tipo',
                'Cancha',
                'Acciones',
              ].map((header) => (
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
                  onClick={() => handleVerDetalle(turno)}
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
                    {turno.hora_inicio.slice(0, 5)} a{' '}
                    {turno.hora_fin.slice(0, 5)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${
                        turno.tipo === 'Normal'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-lime-100 text-lime-700'
                      }`}
                    >
                      {turno.tipo}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 shadow-sm">
                      {turno.Cancha?.nombre}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-4 text-sm font-medium">
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

      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-[450px] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Editar Turno</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <TurnoForm
              formData={formData}
              setFormData={setFormData}
              horarios={horarios}
              turnos={turnos}
              turnosFijos={turnosFijos}
              liberados={liberados}
              isLoading={loading}
              mode="editar"
            />

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardarCambios}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500 mr-2" />
                Confirmar eliminación
              </h3>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              ¿Seguro que querés eliminar el turno de{' '}
              <span className="font-semibold text-gray-800">
                {turnoAEliminar?.Usuario?.nombre}{' '}
                {turnoAEliminar?.Usuario?.apellido}
              </span>
              ?
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEliminacion}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {(showSuccessModal || showUpdateSuccess) && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-xl flex items-center gap-3">
            <CheckCircleIcon className="h-6 w-6 text-green-500" />
            <p className="text-gray-800 font-medium">
              {showUpdateSuccess
                ? 'Turno actualizado correctamente'
                : 'Turno eliminado correctamente'}
            </p>
          </div>
        </div>
      )}

      {showDetalleModal && (
        <TurnoDetalleModal
          isOpen={showDetalleModal}
          onClose={handleDetalleModalClose}
          turno={turnoSeleccionado}
        />
      )}
    </div>
  );
};

export default TurnosTable;