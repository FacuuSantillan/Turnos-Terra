import React, { useState } from "react";
import style from "./formulario.module.css";
import fondoFormulario from "../../assets/fondoFormulario1.png";

function Formulario() {
  // Ahora horarios es un array de strings
  const [horarios, setHorarios] = useState({
    cancha1: ["20:00", "21:00"], // ejemplo: dos turnos seleccionados
    cancha2: [],
  });

  // Función que calcula el rango de horas
  const calcularRango = (turnos) => {
    if (!turnos || turnos.length === 0) return "Ninguno seleccionado";

    // Ordenamos los horarios por hora
    const ordenados = [...turnos].sort();
    const inicio = ordenados[0];
    const fin = sumarUnaHora(ordenados[ordenados.length - 1]);

    return `${inicio} a ${fin}`;
  };

  // Función para sumar una hora a un string "HH:MM"
  const sumarUnaHora = (hora) => {
    const [h, m] = hora.split(":").map(Number);
    const nuevaHora = (h + 1).toString().padStart(2, "0") + ":" + m.toString().padStart(2, "0");
    return nuevaHora;
  };

  return (
    <div className={style.containerFormulario}>
      <img
        className={style.fondoFormulario}
        src={fondoFormulario}
        alt="FondoFormulario"
      />
      <h1 className={style.tituloPrincipal}>
        Confirmación de datos para reserva
      </h1>

      {/* FORMULARIO */}
      <form className={style.formulario}>
        <div className={style.inputGroup}>
          <label className={style.label}>Nombre</label>
          <input className={style.form}></input>
        </div>

        <div className={style.inputGroup}>
          <label className={style.label}>Apellido</label>
          <input className={style.form}></input>
        </div>

        <div className={style.inputGroup}>
          <label className={style.label}>Teléfono</label>
          <input className={style.form}></input>
        </div>
      </form>

      {/* HORARIOS SELECCIONADOS */}
      <div className={style.horarios}>
        <h2 className={style.subtitulo}>Horario</h2>

        <div className={style.canchaBox1}>
          <b>Cancha 1</b>
          <p>{calcularRango(horarios.cancha1)}</p>
        </div>

        <div className={style.canchaBox2}>
          <b>Cancha 2</b>
          <p>{calcularRango(horarios.cancha2)}</p>
        </div>

        <button className={style.botonConfirmar}>CONFIRMAR</button>
      </div>
    </div>
  );
}

export default Formulario;
