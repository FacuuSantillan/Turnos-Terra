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

const timeToMinutes = (time) => {
  if (!time) return 0;
  try {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  } catch {
    return 0;
  }
};

const TurnoDetalleModal = ({ turno, onClose }) => {
  const dispatch = useDispatch();
  const horarios = useSelector((state) => state.horariosCopy);
  const turnos = useSelector((state) => state.turnos);
  const turnosFijos = useSelector((state) => state.turnosFijos) || [];
  const liberados = useSelector((state) => state.turnosFijosLiberados) || [];
  const turnoDetail = useSelector((state) => state.turnoDetail);

  useEffect(() => {
    if (turno?.id) {
      dispatch(getTurnoById(turno.id));
    }
  }, [dispatch, turno]);

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    fecha: '',
    cancha: '',
    horas: [],
    hora_inicio: '',
    hora_fin: '',
  });
  const [apiError, setApiError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!turno) return;

    const horaInicio = turno.Horarios?.[0]?.hora_inicio || '';
    const horaFin = turno.Horarios?.[turno.Horarios.length - 1]?.hora_fin || '';

    setFormData({
      nombre: turno.Usuario?.nombre || '',
      apellido: turno.Usuario?.apellido || '',
      telefono: turno.Usuario?.telefono || '',
      fecha: turno.fecha || '',
      cancha: turno.cancha_id?.toString() || '',
      horas: turno.Horarios?.map((h) => h.id) || [],
      hora_inicio: horaInicio,
      hora_fin: horaFin,
    });

    Promise.all([
      dispatch(getHorarios()),
      dispatch(getTurnos()),
      dispatch(getTurnosFijos()),
      dispatch(getTurnosFijosLiberados()),
    ]).finally(() => setLoading(false));
  }, [dispatch, turno]);

  const horariosFiltrados = useMemo(() => {
    if (!formData.cancha || !formData.fecha || !Array.isArray(horarios))
      return [];

    const canchaId = Number(formData.cancha);
    const fecha = formData.fecha;
    const diaSemanaNum = new Date(`${fecha}T00:00:00`).getUTCDay();
    const diaSemana = diaSemanaNum === 0 ? 7 : diaSemanaNum;

    const getHorarioStatus = (horario) => {
      if (!horario.activo) return 'Deshabilitado';
      const esDelTurnoActual =
        formData.horas.includes(horario.id) &&
        Number(formData.cancha) === canchaId &&
        formData.fecha.startsWith(fecha);

      if (esDelTurnoActual) return 'Editando';

      const reservado = turnos.some(
        (t) =>
          t.id !== turno?.id &&
          t.fecha.startsWith(fecha) &&
          t.cancha_id === canchaId &&
          t.Horarios?.some((h) => h.id === horario.id)
      );
      if (reservado) return 'Reservado';

      const turnoFijo = turnosFijos.find(
        (tf) =>
          tf.cancha_id === canchaId &&
          tf.dia_semana === diaSemana &&
          tf.Horarios?.some((h) => h.id === horario.id)
      );
      if (turnoFijo) {
        const estaLiberado = liberados.some(
          (l) => l.turno_fijo_id === turnoFijo.id && l.fecha === fecha
        );
        return estaLiberado ? 'Disponible' : 'Turno Fijo';
      }

      return 'Disponible';
    };

    return horarios
      .filter((h) => h.cancha_id === canchaId && h.activo)
      .map((h) => ({
        ...h,
        status: getHorarioStatus(h),
      }))
      .sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));
  }, [horarios, turnos, turnosFijos, liberados, formData, turno?.id]);

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

  const handleSave = async (e) => {
    e.preventDefault();
    setApiError(null);

    const inicioMin = timeToMinutes(formData.hora_inicio);
    const finMin = timeToMinutes(formData.hora_fin);

    const nuevasHorasIds = horariosFiltrados
      .filter((h) => {
        const slotInicioMin = timeToMinutes(h.hora_inicio);
        return slotInicioMin >= inicioMin && slotInicioMin < finMin;
      })
      .map((h) => h.id);

    const updatedTurno = {
      id: turno.id,
      nombre: formData.nombre,
      apellido: formData.apellido,
      telefono: formData.telefono,
      fecha: formData.fecha,
      cancha_id: Number(formData.cancha),
      hora_inicio: formData.hora_inicio,
      hora_fin: formData.hora_fin,
      horas: nuevasHorasIds,
    };

    const result = await dispatch(updateTurno(updatedTurno.id, updatedTurno));
    if (result.success) {
      setSuccessMsg(true);
      setTimeout(() => {
        setSuccessMsg(false);
        setEditMode(false);
        onClose();
      }, 2000);
    } else {
      setApiError(result.error?.error || 'Error al actualizar el turno.');
    }
  };

  const handleDelete = async () => {
    if (!turno?.id) return;
    if (!window.confirm('¿Seguro que deseas eliminar este turno?')) return;
    await dispatch(deleteTurno(turno.id));
    onClose();
  };

  if (!turno) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-gradient-to-br from-black/50 via-gray-800/40 to-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn"
        onClick={onClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`bg-white/95 rounded-2xl shadow-2xl p-8 w-full max-w-lg relative border transition-all duration-300 ${
            editMode
              ? 'border-green-500/60 ring-2 ring-green-400/40 scale-[1.01]'
              : 'border-gray-200 scale-100'
          }`}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center tracking-tight">
            {editMode ? 'Editar Turno' : 'Detalle del Turno'}
          </h2>

          {apiError && (
            <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-3 rounded-lg mb-5 flex items-start gap-2 shadow-sm">
              <ExclamationTriangleIcon className="h-5 w-5 mt-0.5 text-red-500" />
              <div>
                <p className="font-semibold">Error</p>
                <p className="text-sm">{apiError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-5">
            {['nombre', 'apellido', 'telefono'].map((campo) => (
              <div key={campo}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {campo}
                </label>
                <input
                  type={campo === 'telefono' ? 'tel' : 'text'}
                  name={campo}
                  value={formData[campo]}
                  disabled
                  className="w-full border rounded-xl px-4 py-2.5 bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>
            ))}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha
                </label>
                <input
                  type="date"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                  disabled={!editMode}
                  className={`w-full border rounded-xl px-4 py-2.5 transition-all duration-200 ${
                    editMode
                      ? 'bg-white focus:ring-2 focus:ring-green-500 focus:border-green-400 shadow-sm hover:shadow-md'
                      : 'bg-gray-100 text-gray-600 cursor-not-allowed'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cancha
                </label>
                <select
                  name="cancha"
                  value={formData.cancha}
                  onChange={handleChange}
                  disabled={!editMode}
                  className={`w-full border rounded-xl px-4 py-2.5 transition-all duration-200 ${
                    editMode
                      ? 'bg-white focus:ring-2 focus:ring-green-500 focus:border-green-400 shadow-sm hover:shadow-md'
                      : 'bg-gray-100 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  <option value="">Seleccionar</option>
                  <option value="1">Cancha 1</option>
                  <option value="2">Cancha 2</option>
                </select>
              </div>
            </div>

            {editMode ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Hora inicio
                  </label>
                  <select
                    name="hora_inicio"
                    value={formData.hora_inicio || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        hora_inicio: e.target.value,
                        hora_fin: '',
                      }))
                    }
                    className="w-full border rounded-xl px-4 py-2.5 bg-white focus:ring-2 focus:ring-green-500 focus:border-green-400 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <option value="">Seleccionar hora inicio</option>
                    {horariosFiltrados
                      .filter(
                        (h) =>
                          (h.status === 'Disponible' || h.status === 'Editando') &&
                          h.hora_inicio
                      )
                      .map((h) => (
                        <option key={h.id} value={h.hora_inicio}>
                          {h.hora_inicio.slice(0, 5)}
                        </option>
                      ))};
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Hora fin
                  </label>
                  <select
                    name="hora_fin"
                    value={formData.hora_fin}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        hora_fin: e.target.value,
                      }))
                    }
                    disabled={!formData.hora_inicio}
                    className="w-full border rounded-xl px-4 py-2.5 bg-white focus:ring-2 focus:ring-green-500 focus:border-green-400 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <option value="">Seleccionar hora fin</option>
                    {(() => {
                      const inicioMin = formData.hora_inicio
                        ? timeToMinutes(formData.hora_inicio)
                        : null;

                      if (!inicioMin) return null;

                      return horariosFiltrados
                        .filter((h) => {
                          const horaFinH = timeToMinutes(h.hora_fin);
                          return (
                            (h.status === 'Disponible' || h.status === 'Editando') &&
                            horaFinH > inicioMin
                          );
                        })
                        .map((h) => (
                          <option key={h.id} value={h.hora_fin}>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hora inicio
                  </label>
                  <input
                    type="text"
                    value={formData.hora_inicio?.slice(0, 5) || ''}
                    disabled
                    className="w-full border rounded-xl px-4 py-2.5 bg-gray-100 text-gray-600 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hora fin
                  </label>
                  <input
                    type="text"
                    value={turnoDetail.hora_fin?.slice(0, 5) || ''}
                    disabled
                    className="w-full border rounded-xl px-4 py-2.5 bg-gray-100 text-gray-600 cursor-not-allowed"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-6 border-t mt-4">
              {!editMode ? (
                <>
                  <button
                    type="button"
                    onClick={() => setEditMode(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
                  >
                    <PencilIcon className="h-5 w-5" /> Editar
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all shadow-md hover:shadow-lg"
                  >
                    <TrashIcon className="h-5 w-5" /> Eliminar
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
                  >
                    Guardar
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>

      {successMsg && (
        <div className="fixed inset-0 flex justify-center items-center z-[9999] animate-fadeIn">
          <div className="bg-green-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 text-lg font-semibold animate-bounceIn">
            <CheckCircleIcon className="h-6 w-6" />
            <span>Turno actualizado con éxito</span>
          </div>
        </div>
      )}
    </>
  );
};

export default TurnoDetalleModal;
