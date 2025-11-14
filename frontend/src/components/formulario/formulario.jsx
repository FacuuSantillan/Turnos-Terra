import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { postTurno } from "../../redux/actions";
import style from "./formulario.module.css";
import fondoFormulario from "../../assets/PPM1.jpeg";

function Formulario() {
  const dispatch = useDispatch();

  const [confirmado, setConfirmado] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorModal, setErrorModal] = useState(""); // ⬅ MODAL DE ERROR

  const [cliente, setCliente] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
  });

  const horariosRedux = useSelector((state) => state.horariosSeleccionados);
  const horariosDB = useSelector((state) => state.horariosCopy || []);
  const fecha = useSelector((state) => state.selectedDate);
  const turnos = useSelector((state) => state.turnos || []);

  const obtenerHorariosCompletos = (ids = []) => {
    return horariosDB.filter((h) => ids.includes(h.id));
  };

  const calcularRango = (turnos) => {
    if (!turnos || turnos.length === 0) return null;

    const inicio = turnos.map((t) => t.hora_inicio).sort()[0];
    const fin = turnos.map((t) => t.hora_fin).sort().slice(-1)[0];

    return { inicio, fin };
  };

  const haySuperposicion = (inicio, fin, turnosExistentes) => {
    return turnosExistentes.some(
      (t) => inicio < t.hora_fin && t.hora_inicio < fin
    );
  };

  // Abrir modal de confirmación
  const handleOpenConfirm = () => {
    setShowModal(true);
  };

  // CONFIRMAR dentro del modal
  const handleConfirmar = async () => {
    setShowModal(false);

    // CANCHA 1
    if (horariosRedux[1]?.length > 0) {
      const horariosC1 = obtenerHorariosCompletos(horariosRedux[1]);
      const rango1 = calcularRango(horariosC1);

      const turnosCancha1 = turnos.filter(
        (t) => t.cancha_id === 1 && t.fecha === fecha
      );

      if (haySuperposicion(rango1.inicio, rango1.fin, turnosCancha1)) {
        setErrorModal("⚠ Ese rango ya está reservado en Cancha 1.");
        return;
      }

      await dispatch(
        postTurno({
          ...cliente,
          fecha,
          cancha_id: 1,
          hora_inicio: rango1.inicio,
          hora_fin: rango1.fin,
          horarios_ids: horariosRedux[1],
        })
      );
    }

    // CANCHA 2
    if (horariosRedux[2]?.length > 0) {
      const horariosC2 = obtenerHorariosCompletos(horariosRedux[2]);
      const rango2 = calcularRango(horariosC2);

      const turnosCancha2 = turnos.filter(
        (t) => t.cancha_id === 2 && t.fecha === fecha
      );

      if (haySuperposicion(rango2.inicio, rango2.fin, turnosCancha2)) {
        setErrorModal("⚠ Ese rango ya está reservado en Cancha 2.");
        return;
      }

      await dispatch(
        postTurno({
          ...cliente,
          fecha,
          cancha_id: 2,
          hora_inicio: rango2.inicio,
          hora_fin: rango2.fin,
          horarios_ids: horariosRedux[2],
        })
      );
    }

    setConfirmado(true);
    setTimeout(() => setConfirmado(false), 2000);
  };

  const rangoC1 =
    horariosRedux[1]?.length > 0
      ? calcularRango(obtenerHorariosCompletos(horariosRedux[1]))
      : null;

  const rangoC2 =
    horariosRedux[2]?.length > 0
      ? calcularRango(obtenerHorariosCompletos(horariosRedux[2]))
      : null;

  return (
    <div id="formulario" className={style.containerFormulario}>
      <img className={style.fondoFormulario} src={fondoFormulario} alt="Fondo" />
      <div className={style.card}>
        <h1 className={style.tituloPrincipal}>Confirmación de datos para reserva</h1>

        <form className={style.formulario}>
          {["nombre", "apellido", "telefono"].map((campo) => (
            <div key={campo} className={style.inputGroup}>
              <label className={style.label}>{campo.toUpperCase()}</label>
              <input
                className={style.input}
                value={cliente[campo]}
                onChange={(e) =>
                  setCliente({ ...cliente, [campo]: e.target.value })
                }
              />
            </div>
          ))}
        </form>

        <div className={style.horarios}>
          <h2 className={style.subtitulo}>Horario</h2>
          <p>
            <b>Cancha 1:</b>{" "}
            {rangoC1 ? `${rangoC1.inicio} a ${rangoC1.fin}` : "Ninguno seleccionado"}
          </p>
          <p>
            <b>Cancha 2:</b>{" "}
            {rangoC2 ? `${rangoC2.inicio} a ${rangoC2.fin}` : "Ninguno seleccionado"}
          </p>
        </div>

        <button
          type="button"
          className={style.botonConfirmar}
          onClick={handleOpenConfirm}
        >
          CONFIRMAR
        </button>
      </div>

      {/* ---------------- MODAL CONFIRMACIÓN ---------------- */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white shadow-xl rounded-xl p-6 w-[90%] max-w-md animate-fadeIn">
            <h2 className="text-xl font-bold mb-4">Confirmar Reserva</h2>

            <p><b>Nombre:</b> {cliente.nombre} {cliente.apellido}</p>
            <p><b>Teléfono:</b> {cliente.telefono}</p>
            <p><b>Fecha:</b> {fecha}</p>

            <div className="mt-4">
              <p><b>Cancha 1:</b> {rangoC1 ? `${rangoC1.inicio} a ${rangoC1.fin}` : "—"}</p>
              <p><b>Cancha 2:</b> {rangoC2 ? `${rangoC2.inicio} a ${rangoC2.fin}` : "—"}</p>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 bg-gray-300 rounded-lg"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
                onClick={handleConfirmar}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- MODAL ERROR ---------------- */}
      {errorModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-red-600 text-white shadow-xl rounded-xl p-6 w-[90%] max-w-sm animate-fadeIn">
            <h2 className="text-xl font-bold mb-3">Error</h2>
            <p>{errorModal}</p>

            <div className="flex justify-end mt-5">
              <button
                className="px-4 py-2 bg-white text-red-600 rounded-lg"
                onClick={() => setErrorModal("")}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmado && (
        <div className={style.checkOverlay}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" className={style.checkIcon}>
            <circle className={style.checkCircle} cx="26" cy="26" r="25" fill="none" />
            <path className={style.checkMark} fill="none" d="M14 27l7 7 16-16" />
          </svg>
        </div>
      )}
    </div>
  );
}

export default Formulario;
