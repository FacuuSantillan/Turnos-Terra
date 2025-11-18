// Cancha.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getHorarios,
  getTurnos,
  getTurnosFijos,
  getTurnosFijosLiberados,
  setSelectedDate,
  setHorariosSeleccionados,
} from "../../redux/actions";

import style from "./turnos.module.css";
import iconoCancha from "../../assets/iconoCancha.png";
import "boxicons";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

// ---------- Funciones auxiliares ----------
const formatDateISO = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const obtenerDiaSemana = (fecha) => {
  const day = new Date(`${fecha}T00:00:00`).getUTCDay();
  return day === 0 ? 7 : day; // Domingo = 7
};

// ---------- Componente principal ----------
function Cancha({ titulo }) {
  const dispatch = useDispatch();

  const horarios = useSelector((state) => state.horariosCopy || []);
  const turnos = useSelector((state) => state.turnos || []);
  const turnosFijos = useSelector((state) => state.turnosFijos || []);
  const liberados = useSelector((state) => state.turnosFijosLiberados || []);

  // AHORA LA FECHA VIENE DE REDUX
  const selectedDate = useSelector((state) => state.selectedDate);

  // HORAS que selecciona el usuario
  const [horasSeleccionadas, setHorasSeleccionadas] = useState([]);

  // Identificar cancha
  const canchaId = useMemo(() => {
    if (titulo.includes("1")) return 1;
    if (titulo.includes("2")) return 2;
    return null;
  }, [titulo]);

  // Cargar datos iniciales
  useEffect(() => {
    dispatch(getHorarios());
    dispatch(getTurnos());
    dispatch(getTurnosFijos());
    dispatch(getTurnosFijosLiberados());

    // Si Redux no tiene fecha aún, setear HOY
    if (!selectedDate) {
      dispatch(setSelectedDate(formatDateISO(new Date())));
    }
  }, [dispatch]);

  // Generar los próximos 7 días
  const dias = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const fecha = new Date();
      fecha.setDate(fecha.getDate() + i);

      return {
        nombre: fecha
          .toLocaleDateString("es-ES", { weekday: "short" })
          .toUpperCase(),
        numero: fecha.getDate(),
        mes: fecha
          .toLocaleDateString("es-ES", { month: "short" })
          .toUpperCase(),
        fechaCompleta: formatDateISO(fecha),
      };
    });
  }, []);

  // Lógica principal de horarios disponibles
  const horariosDisponibles = useMemo(() => {
    if (!Array.isArray(horarios) || !canchaId || !selectedDate) return [];

    const diaSemanaNum = obtenerDiaSemana(selectedDate);

    const esDisponible = (horario) => {
      if (!horario.activo) return false;

      // Turnos ya reservados
      const reservado = turnos.some(
        (t) =>
          t.fecha.startsWith(selectedDate) &&
          t.cancha_id === canchaId &&
          t.Horarios?.some((h) => h.id === horario.id)
      );
      if (reservado) return false;

      // Turno fijo
      const turnoFijo = turnosFijos.find(
        (tf) =>
          tf.cancha_id === canchaId &&
          tf.dia_semana === diaSemanaNum &&
          tf.Horarios?.some((h) => h.id === horario.id)
      );

      if (turnoFijo) {
        const estaLiberado = liberados.some(
          (l) =>
            l.turno_fijo_id === turnoFijo.id && l.fecha === selectedDate
        );
        return estaLiberado;
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
  }, [horarios, turnos, turnosFijos, liberados, canchaId, selectedDate]);

  // seleccionar/deseleccionar horarios
  const toggleHora = (id) => {
    setHorasSeleccionadas((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
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

      {/* Calendario */}
      <div className={style.calendarioContainer}>
        <Swiper slidesPerView={5} spaceBetween={10}>
          {dias.map((d, i) => (
            <SwiperSlide key={i}>
              <button
                className={`${style.diaBoton} ${
                  selectedDate === d.fechaCompleta ? style.diaSeleccionado : ""
                }`}
                onClick={() => {
                  dispatch(setSelectedDate(d.fechaCompleta));
                  setHorasSeleccionadas([]);
                }}
              >
                <span className={style.textoDia}>
                  {i === 0 ? "HOY" : d.nombre}
                </span>
                <span className={style.textoNumero}>{d.numero}</span>
                <span className={style.textoMes}>{d.mes}</span>
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Horarios */}
      <div className={style.horarios}>
        {horariosDisponibles.length > 0 ? (
          horariosDisponibles.map((h) => (
            <button
              key={h.id}
              className={`${style.horaBoton} ${
                horasSeleccionadas.includes(h.id)
                  ? style.horaSeleccionada
                  : ""
              }`}
              onClick={() => toggleHora(h.id)}
            >
              {h.hora}
            </button>
          ))
        ) : (
          <p>No hay horarios disponibles</p>
        )}
      </div>

      <b className={style.expliacionHorarios}>
        *Seleccione la cantidad de horas. Si selecciona solo 15:00, el turno será de 15:00 a 16:00 hs.
      </b>

      {/* Confirmar */}
      {horasSeleccionadas.length > 0 && (
        <button
          className={style.confirmarBtn}
          onClick={() => {
            dispatch(setHorariosSeleccionados(canchaId, horasSeleccionadas));

            const formSection = document.getElementById("formulario");
            if (formSection)
              formSection.scrollIntoView({ behavior: "smooth" });
          }}
        >
          CONFIRMAR HORARIO (
          {horariosDisponibles
            .filter((h) => horasSeleccionadas.includes(h.id))
            .map((h) => h.hora)
            .join(", ")}
          )
        </button>
      )}
    </div>
  );
}

export default Cancha;
