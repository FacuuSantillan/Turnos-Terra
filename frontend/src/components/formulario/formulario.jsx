import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { postTurno } from "../../redux/actions";
import style from "./formulario.module.css";
import fondoFormulario from "../../assets/PPM1.jpeg";

function Formulario() {
  const dispatch = useDispatch();

  const [confirmado, setConfirmado] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorModal, setErrorModal] = useState("");

  const [cliente, setCliente] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
  });

  // --- SELECTORES ---
  const horariosRedux = useSelector((state) => state.horariosSeleccionados);
  const horariosDB = useSelector((state) => state.horariosCopy || []);
  const fechaGlobal = useSelector((state) => state.selectedDate); // Se usa solo como fallback
  const turnos = useSelector((state) => state.turnos || []);

  // --- HELPER PARA EXTRAER DATOS (SOLUCIÓN INTELIGENTE) ---
  // Esto permite manejar la estructura de datos tanto si es un Array (viejo) como si es Objeto (nuevo con fecha)
  const getDatosCancha = (canchaId) => {
    const data = horariosRedux[canchaId];

    if (!data) return { ids: [], fecha: null, valid: false };

    // Si data es un array, significa que el Reducer guarda solo IDs. Usamos fechaGlobal.
    if (Array.isArray(data)) {
      return { ids: data, fecha: fechaGlobal, valid: data.length > 0 };
    }

    // Si data es un objeto, asumimos estructura { ids: [], fecha: "YYYY-MM-DD" }
    // Esto arregla el bug de fechas distintas por cancha.
    return {
      ids: data.ids || [],
      fecha: data.fecha || fechaGlobal, // Fallback por seguridad
      valid: (data.ids?.length || 0) > 0,
    };
  };

  const c1 = getDatosCancha(1);
  const c2 = getDatosCancha(2);

  // --- HELPERS DE TIEMPO ---
  const aMin = (hora) => {
    const [h, m] = hora.split(":").map(Number);
    return h * 60 + m;
  };

  const obtenerHorariosCompletos = (ids = []) => {
    return horariosDB.filter((h) => ids.includes(h.id));
  };

  const calcularRango = (ids) => {
    const horariosSeleccionados = obtenerHorariosCompletos(ids);
    if (!horariosSeleccionados || horariosSeleccionados.length === 0) return null;

    // Ordenamos por hora de inicio
    const sorted = [...horariosSeleccionados].sort((a, b) => 
        a.hora_inicio.localeCompare(b.hora_inicio)
    );
    
    const inicio = sorted[0].hora_inicio;
    const fin = sorted[sorted.length - 1].hora_fin;

    return { inicio, fin };
  };

  // --- VALIDACIONES ---
  const validarFormulario = () => {
    if (!cliente.nombre.trim() || !cliente.apellido.trim() || !cliente.telefono.trim()) {
      return "⚠ Todos los campos son obligatorios.";
    }
    if (!/^\d+$/.test(cliente.telefono)) {
      return "⚠ El teléfono solo puede contener números.";
    }
    if (cliente.telefono.length < 6) {
      return "⚠ El teléfono es demasiado corto.";
    }

    if (!c1.valid && !c2.valid) {
      return "⚠ Debes seleccionar al menos un horario.";
    }

    return null;
  };

  const haySuperposicion = (inicio, fin, fechaTurno, canchaId) => {
    const inicioMin = aMin(inicio);
    const finMin = aMin(fin);

    const turnosExistentes = turnos.filter(
      (t) => t.cancha_id === canchaId && t.fecha === fechaTurno
    );

    return turnosExistentes.some((t) => {
      const tInicio = aMin(t.hora_inicio);
      const tFin = aMin(t.hora_fin);
      if (finMin === tInicio || inicioMin === tFin) return false;
      return inicioMin < tFin && tInicio < finMin;
    });
  };

  // --- HANDLERS ---
  const handleOpenConfirm = () => {
    const error = validarFormulario();
    if (error) {
      setErrorModal(error);
      return;
    }
    setShowModal(true);
  };

  const handleConfirmar = async () => {
    setShowModal(false);
    const error = validarFormulario();
    if (error) {
      setErrorModal(error);
      return;
    }

    let huboError = false;

    // PROCESAR CANCHA 1
    if (c1.valid) {
      const rango1 = calcularRango(c1.ids);
      if (haySuperposicion(rango1.inicio, rango1.fin, c1.fecha, 1)) {
        setErrorModal(`⚠ El horario en Cancha 1 para el ${c1.fecha} ya está ocupado.`);
        huboError = true;
      } else {
        // Post con la fecha ESPECÍFICA de la cancha 1
        dispatch(postTurno({
            ...cliente,
            fecha: c1.fecha, 
            cancha_id: 1,
            hora_inicio: rango1.inicio,
            hora_fin: rango1.fin,
            horarios_ids: c1.ids,
        }));
      }
    }

    // PROCESAR CANCHA 2
    if (!huboError && c2.valid) {
      const rango2 = calcularRango(c2.ids);
      if (haySuperposicion(rango2.inicio, rango2.fin, c2.fecha, 2)) {
        setErrorModal(`⚠ El horario en Cancha 2 para el ${c2.fecha} ya está ocupado.`);
        huboError = true;
      } else {
        // Post con la fecha ESPECÍFICA de la cancha 2
        dispatch(postTurno({
            ...cliente,
            fecha: c2.fecha,
            cancha_id: 2,
            hora_inicio: rango2.inicio,
            hora_fin: rango2.fin,
            horarios_ids: c2.ids,
        }));
      }
    }

    if (huboError) return;

    setConfirmado(true);
    setTimeout(() => {
      const ubicacionSection = document.getElementById("ubicacion");
      if (ubicacionSection) ubicacionSection.scrollIntoView({ behavior: "smooth" });
    }, 300);
    setTimeout(() => setConfirmado(false), 2000);
  };

  // --- RENDER HELPERS ---
  const rangoC1 = c1.valid ? calcularRango(c1.ids) : null;
  const rangoC2 = c2.valid ? calcularRango(c2.ids) : null;

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
                onChange={(e) => setCliente({ ...cliente, [campo]: e.target.value })}
              />
            </div>
          ))}
        </form>

        {/* Resumen en la tarjeta */}
        <div className={style.horarios}>
          <h2 className={style.subtitulo}>Horario Seleccionado</h2>
          <div className={style.resumenItem}>
            <b>Cancha 1:</b>{" "}
            {rangoC1 
                ? `${rangoC1.inicio} a ${rangoC1.fin} hs` 
                : <span style={{opacity: 0.5}}>—</span>}
          </div>
          <div className={style.resumenItem}>
            <b>Cancha 2:</b>{" "}
            {rangoC2 
                ? `${rangoC2.inicio} a ${rangoC2.fin} hs` 
                : <span style={{opacity: 0.5}}>—</span>}
          </div>
        </div>

        <button
          type="button"
          className={style.botonConfirmar}
          onClick={handleOpenConfirm}
        >
          CONFIRMAR
        </button>
      </div>

      {/* ---------- MODAL CONFIRMACIÓN CORREGIDO ---------- */}
{showModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">

    <div className="bg-white/70 backdrop-blur-xl border border-white/40 
                    shadow-[0_8px_32px_rgba(0,0,0,0.25)] rounded-3xl 
                    p-7 w-[92%] max-w-md animate-fadeIn">

      {/* Título */}
      <h2 className="text-2xl font-extrabold mb-6 text-gray-900 tracking-wide 
                     border-b border-gray-200 pb-3">
        Confirmar Reserva
      </h2>

      {/* Datos del cliente */}
      <div className="space-y-1.5 mb-7 text-[15px] text-gray-700">
        <p><span className="font-semibold text-gray-900">Cliente:</span> {cliente.nombre} {cliente.apellido}</p>
        <p><span className="font-semibold text-gray-900">Teléfono:</span> {cliente.telefono}</p>
      </div>

      {/* Contenedor canchas */}
      <div className="bg-gray-50/80 backdrop-blur-md rounded-2xl p-5 space-y-5 
                      shadow-inner border border-gray-200">

        {/* Cancha 1 */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200/70">
          <span className="font-bold text-blue-900 text-lg">Cancha 1</span>
          {rangoC1 ? (
            <div className="text-right">
              <div className="text-gray-900 font-semibold text-[15px]">
                {rangoC1.inicio} - {rangoC1.fin}
              </div>
              <div className="text-xs text-blue-600 font-medium">{c1.fecha}</div>
            </div>
          ) : (
            <span className="text-gray-400 italic text-sm">Sin reserva</span>
          )}
        </div>

        {/* Cancha 2 */}
        <div className="flex justify-between items-center">
          <span className="font-bold text-blue-900 text-lg">Cancha 2</span>
          {rangoC2 ? (
            <div className="text-right">
              <div className="text-gray-900 font-semibold text-[15px]">
                {rangoC2.inicio} - {rangoC2.fin}
              </div>
              <div className="text-xs text-blue-600 font-medium">{c2.fecha}</div>
            </div>
          ) : (
            <span className="text-gray-400 italic text-sm">Sin reserva</span>
          )}
        </div>

      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 mt-8">
        <button
          className="px-5 py-2.5 bg-gray-200/70 hover:bg-gray-300 text-gray-700 
                     font-medium rounded-xl transition-all active:scale-95 
                     shadow-sm border border-gray-300/50"
          onClick={() => setShowModal(false)}
        >
          Cancelar
        </button>

        <button
          className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white 
                     font-bold rounded-xl shadow-xl shadow-green-300/40 
                     transition-all active:scale-95"
          onClick={handleConfirmar}
        >
          Confirmar Reserva
        </button>
      </div>

    </div>
  </div>
)}


      {/* ---------- MODAL DE ERROR ---------- */}
     {errorModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
    <div className="bg-white/90 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.2)] rounded-2xl border border-red-300 p-6 w-[90%] max-w-sm animate-fadeIn">
      
      <h2 className="text-xl font-bold mb-3 text-red-600 flex items-center gap-2">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        Atención
      </h2>

      <p className="text-gray-800 leading-relaxed mb-6">{errorModal}</p>

      <div className="flex justify-end">
        <button
          className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 font-semibold rounded-lg transition-all active:scale-95"
          onClick={() => setErrorModal("")}
        >
          Entendido
        </button>
      </div>

    </div>
  </div>
)}

      {/* ---------- CHECK DE CONFIRMACIÓN ---------- */}
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