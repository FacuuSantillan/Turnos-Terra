import React, { useState, useEffect, useMemo } from 'react';
import { XMarkIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import {
  getHorarios,
  postTurno,
  getTurnos,
  getTurnosFijos,
  getTurnosFijosLiberados
} from '../../../../redux/actions';

const NuevoTurnoModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  const horarios = useSelector((state) => state.horariosCopy);
  const turnos = useSelector((state) => state.turnos);
  const turnosFijos = useSelector((state) => state.turnosFijos) || [];
  const liberados = useSelector((state) => state.turnosFijosLiberados) || [];

  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    fecha: '',
    horas: [],
    cancha: '',
  });

  // --- Carga inicial ---
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setApiError(null);
      setFormData({ nombre: '', apellido: '', telefono: '', fecha: '', horas: [], cancha: '' });

      Promise.all([
        dispatch(getHorarios()),
        dispatch(getTurnos()),
        dispatch(getTurnosFijos()),
        dispatch(getTurnosFijosLiberados())
      ]).finally(() => {
        setIsLoading(false);
      });
    }
  }, [isOpen, dispatch]);

  // --- Lógica de disponibilidad ---
  const horariosFiltrados = useMemo(() => {
    const canchaId = Number(formData.cancha);
    const fecha = formData.fecha;

    if (!canchaId || !fecha || !Array.isArray(horarios) || !Array.isArray(turnos)) {
      return [];
    }

    const diaSemanaNum = new Date(`${fecha}T00:00:00`).getUTCDay();
    const diaSemana = diaSemanaNum === 0 ? 7 : diaSemanaNum;

    const getHorarioStatus = (horario) => {
      if (!horario.activo) return "Deshabilitado";

      const reservado = turnos.some(
        (t) =>
          t.fecha.startsWith(fecha) &&
          t.cancha_id === canchaId &&
          t.Horarios?.some((h) => h.id === horario.id)
      );
      if (reservado) return "Reservado";

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
        return estaLiberado ? "Disponible" : "Reservado (Fijo)";
      }

      return "Disponible";
    };

    return horarios
      .filter((h) => h.cancha_id === canchaId)
      .map((h) => ({
        ...h,
        status: getHorarioStatus(h),
      }))
      .sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));
  }, [horarios, turnos, formData.cancha, formData.fecha, turnosFijos, liberados]);

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setApiError(null);
    if (name === 'cancha' || name === 'fecha') {
      setFormData((prev) => ({ ...prev, [name]: value, horas: [] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleHorasChange = (horarioId) => {
    const horario = horariosFiltrados.find(h => h.id === horarioId);
    if (horario && horario.status !== 'Disponible') return;

    setFormData((prev) => {
      const already = prev.horas.includes(horarioId);
      return {
        ...prev,
        horas: already
          ? prev.horas.filter((h) => h !== horarioId)
          : [...prev.horas, horarioId],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    const turno = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      telefono: formData.telefono,
      fecha: formData.fecha,
      cancha_id: Number(formData.cancha),
      horarios_ids: formData.horas,
    };

    const result = await dispatch(postTurno(turno));
    if (result.success) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
    } else {
      setApiError(result.error?.error || 'Error al crear el turno. Intente de nuevo.');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative border border-gray-100 transition-all duration-300 hover:shadow-3xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Nuevo Turno</h2>

          {apiError && (
            <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-3 rounded-lg mb-5 flex items-start gap-2">
              <ExclamationTriangleIcon className="h-5 w-5 mt-0.5 text-red-400" />
              <div>
                <p className="font-semibold">Error al guardar</p>
                <p className="text-sm">{apiError}</p>
              </div>
            </div>
          )}

          {/* FORMULARIO */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {['nombre', 'apellido', 'telefono'].map((campo) => (
              <div key={campo}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {campo}
                </label>
                <input
                  type={campo === 'telefono' ? 'tel' : 'text'}
                  name={campo}
                  value={formData[campo]}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white shadow-sm hover:shadow-md transition focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  required
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white shadow-sm hover:shadow-md transition focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cancha</label>
              <select
                name="cancha"
                value={formData.cancha}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white shadow-sm hover:shadow-md transition focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                required
              >
                <option value="">Seleccionar cancha</option>
                <option value="1">Cancha 1</option>
                <option value="2">Cancha 2</option>
              </select>
            </div>

            {/* Horarios */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Horarios disponibles
              </label>
              <div className="w-full max-h-48 overflow-y-auto border border-gray-200 rounded-2xl bg-gradient-to-b from-white to-gray-50 shadow-inner p-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {isLoading ? (
                  <p className="text-gray-500 text-center py-5 text-sm animate-pulse">Cargando...</p>
                ) : !formData.cancha || !formData.fecha ? (
                  <p className="text-gray-500 text-center py-5 text-sm">
                    Selecciona una cancha y una fecha.
                  </p>
                ) : horariosFiltrados.length === 0 ? (
                  <p className="text-gray-500 text-center py-5 text-sm">
                    No hay horarios disponibles.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {horariosFiltrados.map((h) => {
                      let style = "bg-white border-gray-200 hover:bg-gray-50 cursor-pointer";
                      if (h.status !== 'Disponible') {
                        style = 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed';
                      } else if (formData.horas.includes(h.id)) {
                        style = 'bg-green-100 border-green-400 text-green-700 shadow-sm';
                      }

                      return (
                        <label
                          key={h.id}
                          className={`flex items-center justify-between px-3 py-2 rounded-xl border transition-all duration-200 ${style}`}
                        >
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              value={h.id}
                              checked={formData.horas.includes(h.id)}
                              onChange={() => handleHorasChange(h.id)}
                              disabled={h.status !== 'Disponible'}
                              className="relative right-2 rounded text-green-600 focus:ring-green-500 disabled:cursor-not-allowed disabled:text-gray-400"
                            />
                            <span
                              className={`text-sm font-medium ${
                                h.status !== 'Disponible' ? 'line-through' : ''
                              }`}
                            >
                              {h.hora_inicio}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-[4.5vh] py-2 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={formData.horas.length === 0 || isLoading}
                className="px-[4vh] py-2 rounded-lg text-white font-medium bg-green-600 hover:bg-green-700 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ✅ Mensaje de éxito centrado */}
      {showSuccess && (
        <div className="fixed inset-0 flex justify-center items-center z-[9999]">
          <div className="bg-green-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 text-lg font-semibold animate-fadeIn">
            <CheckCircleIcon className="h-6 w-6" />
            <span>Turno creado con éxito</span>
          </div>
        </div>
      )}
    </>
  );
};

export default NuevoTurnoModal;
