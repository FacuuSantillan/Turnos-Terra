import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getHorarios,
  getTurnos,
  getTurnosFijos,
  getTurnosFijosLiberados,
  setHorariosSeleccionados,
} from "../../redux/actions";

import style from "./turnos.module.css";
import iconoCancha from "../../assets/iconoCancha.png";
import "boxicons";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

// ---------- Funciones auxiliares ----------

// Formatea fecha a YYYY-MM-DD local
const formatDateISO = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

// FIX: Función segura para obtener día de la semana (1-7)
// Evita errores de zona horaria construyendo la fecha localmente
const obtenerDiaSemana = (fechaISO) => {
  if (!fechaISO) return null;
  const [year, month, day] = fechaISO.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const dia = date.getDay(); // 0 (Domingo) - 6 (Sábado)
  return dia === 0 ? 7 : dia;
};

// ---------- Componente Principal ----------
function Cancha({ titulo }) {
  const dispatch = useDispatch();

  // Selectores de Redux
  const horarios = useSelector((state) => state.horariosCopy || []);
  const turnos = useSelector((state) => state.turnos || []);
  const turnosFijos = useSelector((state) => state.turnosFijos || []);
  const liberados = useSelector((state) => state.turnosFijosLiberados || []);

  // --- ESTADO LOCAL DE FECHA ---
  // Fundamental: Manejamos la fecha aquí para que sea independiente por cancha
  const [selectedDate, setSelectedDate] = useState(formatDateISO(new Date()));

  // Estados de carga y selección
  const [isLoading, setIsLoading] = useState(true);
  const [horasSeleccionadas, setHorasSeleccionadas] = useState([]);

  // Identificar ID de cancha
  const canchaId = useMemo(() => {
    if (titulo.includes("1")) return 1;
    if (titulo.includes("2")) return 2;
    return null;
  }, [titulo]);

  // 1. Carga Inicial y Reset
  useEffect(() => {
    setIsLoading(true);
    setSelectedDate(formatDateISO(new Date())); // Resetear a HOY al cambiar cancha
    setHorasSeleccionadas([]);

    dispatch(getHorarios());
    dispatch(getTurnos());
    dispatch(getTurnosFijos());
    dispatch(getTurnosFijosLiberados());

    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [dispatch, canchaId]);

  // 2. Generar Días del Calendario (14 días)
  const dias = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => {
      const fecha = new Date();
      fecha.setDate(fecha.getDate() + i);

      return {
        nombre: fecha.toLocaleDateString("es-ES", { weekday: "short" }).toUpperCase(),
        numero: fecha.getDate(),
        mes: fecha.toLocaleDateString("es-ES", { month: "short" }).toUpperCase(),
        fechaCompleta: formatDateISO(fecha),
      };
    });
  }, []);

  // 3. Filtrar Horarios Disponibles
  const horariosDisponibles = useMemo(() => {
    if (!Array.isArray(horarios) || !canchaId || !selectedDate) return [];
    if (isLoading) return [];

    const diaSemanaNum = obtenerDiaSemana(selectedDate);

    const esDisponible = (horario) => {
      if (!horario.activo) return false;

      // A) Turnos Puntuales (Ya reservados)
      const reservado = turnos.some(
        (t) =>
          t.fecha.startsWith(selectedDate) &&
          t.cancha_id === canchaId &&
          t.Horarios?.some((h) => h.id === horario.id)
      );
      if (reservado) return false;

      // B) Turnos Fijos
      const turnoFijo = turnosFijos.find(
        (tf) =>
          tf.cancha_id === canchaId &&
          tf.dia_semana === diaSemanaNum &&
          tf.Horarios?.some((h) => h.id === horario.id)
      );

      // C) Si es Fijo, verificar si está liberado
      if (turnoFijo) {
        const estaLiberado = liberados.some(
          (l) => l.turno_fijo_id === turnoFijo.id && l.fecha === selectedDate
        );
        return estaLiberado; // true = disponible
      }

      return true;
    };

    return horarios
      .filter((h) => h.cancha_id === canchaId && esDisponible(h))
      .map((h) => ({
        id: h.id,
        hora: h.hora_inicio,
      }))
      .sort((a, b) => a.hora.localeCompare(b.hora));
  }, [horarios, turnos, turnosFijos, liberados, canchaId, selectedDate, isLoading]);

  // Handler: Seleccionar hora
  const toggleHora = (id) => {
    setHorasSeleccionadas((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Handler: Cambiar fecha
  const handleDateChange = (nuevaFecha) => {
    if (selectedDate !== nuevaFecha) {
      setSelectedDate(nuevaFecha);
      setHorasSeleccionadas([]); // Limpiar selección al cambiar día
    }
  };

  return (
    <div href="#DiasyHorarios" className={style.canchaContainer}>
      {/* Título */}
      <div className={style.tituloCancha}>
        <box-icon name="chevron-left" size="md"></box-icon>
        <h2 className={style.titulo}>{titulo}</h2>
        <box-icon name="chevron-right" size="md"></box-icon>
      </div>

      <img src={iconoCancha} alt="Cancha" className={style.iconoCancha} />

      {/* Calendario Swiper */}
      <div className={style.calendarioContainer}>
        <Swiper slidesPerView={5} spaceBetween={10}>
          {dias.map((d, i) => (
            <SwiperSlide key={i}>
              <button
                className={`${style.diaBoton} ${
                  selectedDate === d.fechaCompleta ? style.diaSeleccionado : ""
                }`}
                onClick={() => handleDateChange(d.fechaCompleta)}
              >
                <span className={style.textoDia}>{i === 0 ? "HOY" : d.nombre}</span>
                <span className={style.textoNumero}>{d.numero}</span>
                <span className={style.textoMes}>{d.mes}</span>
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Grilla de Horarios */}
      <div className={style.horarios}>
        {isLoading ? (
          Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className={style.skeletonBtn}></div>
          ))
        ) : horariosDisponibles.length > 0 ? (
          horariosDisponibles.map((h) => (
            <button
              key={h.id}
              className={`${style.horaBoton} ${
                horasSeleccionadas.includes(h.id) ? style.horaSeleccionada : ""
              }`}
              onClick={() => toggleHora(h.id)}
            >
              {h.hora}
            </button>
          ))
        ) : (
          <p className={style.noHorarios}>No hay horarios disponibles</p>
        )}
      </div>

      <b className={style.expliacionHorarios}>
        *Seleccione la cantidad de horas. Si selecciona solo 15:00, el turno será de 15:00 a 16:00 hs.
      </b>

      {/* Botón Confirmar */}
      {!isLoading && horasSeleccionadas.length > 0 && (
        <button
          className={style.confirmarBtn}
          onClick={() => {
            // IMPORTANTE: Se envía la fecha seleccionada LOCALMENTE al Redux
            dispatch(setHorariosSeleccionados(canchaId, horasSeleccionadas, selectedDate));
            
            const formSection = document.getElementById("formulario");
            if (formSection)
              formSection.scrollIntoView({ behavior: "smooth" });
          }}
        >
          CONFIRMAR HORARIO ({horariosDisponibles
            .filter((h) => horasSeleccionadas.includes(h.id))
            .map((h) => h.hora)
            .join(", ")})
        </button>
      )}
    </div>
  );
}

export default Cancha;