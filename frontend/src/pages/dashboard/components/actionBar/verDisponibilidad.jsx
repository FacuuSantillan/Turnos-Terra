import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getHorarios,
  getTurnos,
  getTurnosFijos,
  getTurnosFijosLiberados,
} from "../../../../redux/actions";

// --- COMPONENTE HORARIO ROW ---
const HorarioRow = ({ timeRange, status }) => {
  const styleMap = {
    Disponible: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
      time: "text-gray-700",
    },
    Reservado: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      time: "text-red-400 line-through",
    },
    "Reservado (Fijo)": {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-700",
      time: "text-yellow-500 line-through",
    },
    Deshabilitado: {
      bg: "bg-gray-100",
      border: "border-gray-200",
      text: "text-gray-500",
      time: "text-gray-400 line-through",
    },
  };

  const { bg, border, text, time } = styleMap[status] || styleMap.Deshabilitado;

  return (
    <div
      className={`flex justify-between items-center p-3 rounded-lg border ${bg} ${border} transition-all duration-200 ${
        status !== "Disponible" ? "opacity-80" : ""
      }`}
    >
      <span className={`font-medium ${time}`}>{timeRange}</span>
      <span className={`font-semibold ${text}`}>{status}</span>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
const VerDisponibilidadModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const horarios = useSelector((state) => state.horariosCopy);
  const turnos = useSelector((state) => state.turnos);
  const turnosFijos = useSelector((state) => state.turnosFijos) || [];
  const liberados = useSelector((state) => state.turnosFijosLiberados) || [];

  const [isLoading, setIsLoading] = useState(true);

  const getHoyFecha = () => new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(getHoyFecha());

  // --- CARGA DE DATOS ---
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      Promise.all([
        dispatch(getHorarios()),
        dispatch(getTurnos()),
        dispatch(getTurnosFijos()),
        dispatch(getTurnosFijosLiberados()),
      ]).finally(() => setIsLoading(false));
    }
  }, [isOpen, dispatch]);

  // Limpia estado de carga al cerrar
  useEffect(() => {
    if (!isOpen) setIsLoading(false);
  }, [isOpen]);

  // --- CÁLCULO DE DISPONIBILIDAD ---
  const [cancha1Horarios, cancha2Horarios] = useMemo(() => {
    if (!Array.isArray(horarios) || !Array.isArray(turnos) || !selectedDate) {
      return [[], []];
    }

    const diaSemanaNum = new Date(`${selectedDate}T00:00:00`).getUTCDay();
    const diaSemana = diaSemanaNum === 0 ? 7 : diaSemanaNum;

    const getHorarioStatus = (canchaId, horario) => {
      if (!horario.activo) return "Deshabilitado";

      const reservado = turnos.some(
        (t) =>
          t.fecha.startsWith(selectedDate) &&
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
          (l) => l.turno_fijo_id === turnoFijo.id && l.fecha === selectedDate
        );
        return estaLiberado ? "Disponible" : "Reservado (Fijo)";
      }

      return "Disponible";
    };

    const horariosPorCancha = horarios.reduce(
      (acc, h) => {
        acc[h.cancha_id === 1 ? 0 : 1].push(h);
        return acc;
      },
      [[], []]
    );

    const mapearHorarios = (canchaId, lista) =>
      lista
        .map((h) => ({
          id: h.id,
          timeRange: `${h.hora_inicio} a ${h.hora_fin}`,
          status: getHorarioStatus(canchaId, h),
          hora_inicio: h.hora_inicio,
        }))
        .sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));

    return [
      mapearHorarios(1, horariosPorCancha[0]),
      mapearHorarios(2, horariosPorCancha[1]),
    ];
  }, [horarios, turnos, selectedDate, turnosFijos, liberados]);

  if (!isOpen) return null;

  // --- RENDER ---
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-sm p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* HEADER */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            Disponibilidad de Canchas
          </h2>
        </div>

        {/* CUERPO */}
        <div className="p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {/* Selector de fecha */}
          <div className="mb-6">
            <label
              htmlFor="fechaDisp"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
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

          {/* CARGA */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-3">
              <svg
                className="animate-spin h-8 w-8 text-green-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              <p className="text-gray-500 animate-pulse">
                Cargando disponibilidad...
              </p>
            </div>
          ) : (
            <>
              {/* CANCHAS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cancha 1 */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="h-3 w-3 rounded-full bg-green-500"></span>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Cancha 1{" "}
                      <span className="text-sm font-normal text-gray-500">
                        (Techada)
                      </span>
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {cancha1Horarios.map((h) => (
                      <HorarioRow
                        key={h.id}
                        timeRange={h.timeRange}
                        status={h.status}
                      />
                    ))}
                  </div>
                </div>

                {/* Cancha 2 */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="h-3 w-3 rounded-full bg-purple-500"></span>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Cancha 2{" "}
                      <span className="text-sm font-normal text-gray-500">
                        (Semi-techada)
                      </span>
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {cancha2Horarios.map((h) => (
                      <HorarioRow
                        key={h.id}
                        timeRange={h.timeRange}
                        status={h.status}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* LEYENDA */}
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-8 text-sm text-gray-600">
                {[
                  { color: "bg-green-50 border-green-200", label: "Disponible" },
                  { color: "bg-red-50 border-red-200", label: "Reservado" },
                  {
                    color: "bg-yellow-50 border-yellow-200",
                    label: "Reservado (Fijo)",
                  },
                  {
                    color: "bg-gray-100 border-gray-200",
                    label: "Deshabilitado",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className={`h-3 w-3 rounded-full border ${item.color}`} />
                    {item.label}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end">
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

export default VerDisponibilidadModal;
