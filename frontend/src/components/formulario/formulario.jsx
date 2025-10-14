import React, { useState } from "react";
import style from "./formulario.module.css";
import fondoFormulario from "../../assets/PPM1.jpeg";

function Formulario() {
  const [confirmado, setConfirmado] = useState(false);
  const [horarios, setHorarios] = useState({
    cancha1: ["20:00", "21:00"],
    cancha2: [],
  });

  const calcularRango = (turnos) => {
    if (!turnos || turnos.length === 0) return "Ninguno seleccionado";
    const ordenados = [...turnos].sort();
    const inicio = ordenados[0];
    const fin = sumarUnaHora(ordenados[ordenados.length - 1]);
    return `${inicio} a ${fin}`;
  };

  const sumarUnaHora = (hora) => {
    const [h, m] = hora.split(":").map(Number);
    return (h + 1).toString().padStart(2, "0") + ":" + m.toString().padStart(2, "0");
  };

  return (
    <div id="formulario" className={style.containerFormulario}>
      <img className={style.fondoFormulario} src={fondoFormulario} alt="Fondo" />

      <div className={style.card}>
        <h1 className={style.tituloPrincipal}>
          Confirmación de datos para reserva
        </h1>

        {/* FORMULARIO */}
        <form className={style.formulario}>
          <div className={style.inputGroup}>
            <label className={style.label}>Nombre</label>
            <input className={style.input} />
          </div>

          <div className={style.inputGroup}>
            <label className={style.label}>Apellido</label>
            <input className={style.input} />
          </div>

          <div className={style.inputGroup}>
            <label className={style.label}>Teléfono</label>
            <input className={style.input} />
          </div>
        </form>

        {/* HORARIOS */}
        <div className={style.horarios}>
          <h2 className={style.subtitulo}>Horario</h2>
          <p><b>Cancha 1:</b> {calcularRango(horarios.cancha1)}</p>
          <p><b>Cancha 2:</b> {calcularRango(horarios.cancha2)}</p>
        </div>

        <button
  type="button"
  className={style.botonConfirmar}
  onClick={() => {
    setConfirmado(true);
    setTimeout(() => setConfirmado(false), 2000); // Se esconde después de 2s
  }}
>
  CONFIRMAR
</button>
      </div>
      {confirmado && (
  <div className={style.checkOverlay}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 52 52"
      className={style.checkIcon}
    >
      <circle className={style.checkCircle} cx="26" cy="26" r="25" fill="none" />
      <path className={style.checkMark} fill="none" d="M14 27l7 7 16-16" />
    </svg>
  </div>
)}
    </div>
    
  );
}

export default Formulario;
