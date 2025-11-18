// --- CÓDIGO COMPLETO Y FINAL ---

import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  updateTurno,
  deleteTurno,
  getHorarios,
  getTurnos,
  getTurnosFijos,
  getTurnosFijosLiberados,
  getTurnoById
} from '../../../../redux/actions';

import {
  XMarkIcon,
  PencilIcon,
  CheckCircleIcon,
  TrashIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

/* -------------------- Helpers -------------------- */

const timeToMinutes = (time) => {
  if (!time) return 0;
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

/* -------------------- COMPONENTE -------------------- */

const TurnoDetalleModal = ({ turno, onClose }) => {
  const dispatch = useDispatch();

  const horarios = useSelector((state) => state.horariosCopy);
  const turnos = useSelector((state) => state.turnos);
  const turnosFijos = useSelector((state) => state.turnosFijos);
  const liberados = useSelector((state) => state.turnosFijosLiberados);

  const turnoDetail = useSelector((state) => state.turnoDetail);

  /* --------- Estado local --------- */
  const [editMode, setEditMode] = useState(false);

  const [apiError, setApiError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    fecha: '',
    cancha: '',
    hora_inicio: '',
    hora_fin: '',
  });

  /* --------- Carga inicial --------- */

  useEffect(() => {
    if (!turno?.id) return;

    dispatch(getTurnoById(turno.id));
    dispatch(getHorarios());
    dispatch(getTurnos());
    dispatch(getTurnosFijos());
    dispatch(getTurnosFijosLiberados());
  }, [dispatch, turno]);

  /* --------- Cargar datos al modal --------- */

  useEffect(() => {
    if (!turno) return;

    setFormData({
      nombre: turno.Usuario?.nombre || '',
      apellido: turno.Usuario?.apellido || '',
      telefono: turno.Usuario?.telefono || '',
      fecha: turno.fecha,
      cancha: turno.cancha_id?.toString(),
      hora_inicio: turno.hora_inicio?.slice(0, 5),   // <-- FIX
      hora_fin: turno.hora_fin?.slice(0, 5),         // <-- FIX
    });
  }, [turno]);

  /* --------- Filtrar horarios válidos --------- */

  const horariosFiltrados = useMemo(() => {
    if (!formData.cancha || !formData.fecha) return [];

    const canchaId = Number(formData.cancha);

    return horarios
      ?.filter((h) => h.cancha_id === canchaId)
      .sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));
  }, [horarios, formData]);

  /* --------- Cambios --------- */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setApiError(null);

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'cancha' || name === 'fecha'
        ? { hora_inicio: '', hora_fin: '' }
        : {}),
    }));
  };

  /* --------- Guardar cambios --------- */

  const handleSave = async (e) => {
    e.preventDefault();
    setApiError(null);

    if (!formData.hora_inicio || !formData.hora_fin) {
      setApiError('Debes seleccionar un rango válido.');
      return;
    }

    const inicioMin = timeToMinutes(formData.hora_inicio);
    const finMin = timeToMinutes(formData.hora_fin);

    if (inicioMin >= finMin) {
      setApiError('La hora de fin debe ser mayor a la de inicio.');
      return;
    }

    const updatedTurno = {
      id: turno.id,
      usuario_id: turno.usuario_id,
      cancha_id: Number(formData.cancha),
      fecha: formData.fecha,
      hora_inicio: formData.hora_inicio,
      hora_fin: formData.hora_fin,
    };

    const result = await dispatch(updateTurno(turno.id, updatedTurno));

    if (!result.success) {
      setApiError(result.error?.error || 'Error al actualizar.');
      return;
    }

    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      setEditMode(false);
      onClose();
    }, 1500);
  };

  /* --------- Eliminar turno --------- */

  const handleDelete = async () => {
    if (!window.confirm('¿Eliminar turno?')) return;
    await dispatch(deleteTurno(turno.id));
    onClose();
  };

  /* --------- Render --------- */

  if (!turno) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">

        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative">

          {/* Cerrar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
            {editMode ? 'Editar Turno' : 'Detalle del Turno'}
          </h2>

          {/* Error */}
          {apiError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-lg mb-4 text-red-700 flex gap-2">
              <ExclamationTriangleIcon className="h-5 w-5" />
              {apiError}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-5">

            {/* Datos del cliente */}
            {['nombre', 'apellido', 'telefono'].map((c) => (
              <div key={c}>
                <label className="block text-sm font-medium">{c.toUpperCase()}</label>
                <input
                  type="text"
                  value={formData[c]}
                  disabled
                  className="w-full px-4 py-2.5 border rounded-xl bg-gray-100 cursor-not-allowed"
                />
              </div>
            ))}

            {/* Fecha - cancha */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Fecha</label>
                <input
                  type="date"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                  disabled={!editMode}
                  className={`w-full px-4 py-2.5 border rounded-xl ${
                    editMode ? 'bg-white' : 'bg-gray-100 cursor-not-allowed'
                  }`}
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Cancha</label>
                <select
                  name="cancha"
                  value={formData.cancha}
                  onChange={handleChange}
                  disabled={!editMode}
                  className={`w-full px-4 py-2.5 border rounded-xl ${
                    editMode ? 'bg-white' : 'bg-gray-100 cursor-not-allowed'
                  }`}
                >
                  <option value="">Seleccionar</option>
                  <option value="1">Cancha 1</option>
                  <option value="2">Cancha 2</option>
                </select>
              </div>
            </div>

            {/* Horarios */}
            {editMode ? (
              <div className="grid grid-cols-2 gap-4">

                {/* inicio */}
                <div>
                  <label className="block mb-2 text-sm font-semibold">Hora inicio</label>
                  <select
                    name="hora_inicio"
                    value={formData.hora_inicio}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        hora_inicio: e.target.value,
                        hora_fin: '',
                      }))
                    }
                    className="w-full px-4 py-2.5 border rounded-xl"
                  >
                    <option value="">Seleccionar</option>
                    {horariosFiltrados.map((h) => (
                      <option key={h.id} value={h.hora_inicio.slice(0,5)}>
                        {h.hora_inicio.slice(0, 5)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* fin */}
                <div>
                  <label className="block mb-2 text-sm font-semibold">Hora fin</label>
                  <select
                    name="hora_fin"
                    value={formData.hora_fin}
                    disabled={!formData.hora_inicio}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        hora_fin: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 border rounded-xl"
                  >
                    <option value="">Seleccionar</option>

                    {(() => {
                      const inicioMin = timeToMinutes(formData.hora_inicio);
                      return horariosFiltrados
                        .filter((h) => timeToMinutes(h.hora_fin) > inicioMin)
                        .map((h) => (
                          <option key={h.id} value={h.hora_fin.slice(0,5)}>
                            {h.hora_fin.slice(0, 5)}
                          </option>
                        ));
                    })()}
                  </select>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Hora inicio</label>
                  <input
                    type="text"
                    value={formData.hora_inicio}
                    disabled
                    className="w-full px-4 py-2.5 border rounded-xl bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block mb-1">Hora fin</label>
                  <input
                    type="text"
                    value={formData.hora_fin}
                    disabled
                    className="w-full px-4 py-2.5 border rounded-xl bg-gray-100"
                  />
                </div>
              </div>
            )}

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-6 border-t mt-4">

              {!editMode ? (
                <>
                  <button
                    type="button"
                    onClick={() => setEditMode(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <PencilIcon className="h-5 w-5" />
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <TrashIcon className="h-5 w-5" />
                    Eliminar
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Guardar
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Éxito */}
      {successMsg && (
        <div className="fixed inset-0 flex justify-center items-center z-[9999]">
          <div className="bg-green-600 text-white px-8 py-4 rounded-2xl shadow-xl flex items-center gap-3 text-lg font-semibold animate-bounceIn">
            <CheckCircleIcon className="h-6 w-6" />
            Turno actualizado con éxito
          </div>
        </div>
      )}
    </>
  );
};

export default TurnoDetalleModal;
