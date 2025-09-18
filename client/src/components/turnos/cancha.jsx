// Cancha.jsx
import React, { useState } from "react";
import style from "./turnos.module.css";
import iconoCancha from "../../assets/iconoCancha.png";

import 'boxicons';

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

function Cancha({ titulo }) {
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);
  const [horasSeleccionadas, setHorasSeleccionadas] = useState([]);

  // Próximos 7 días dinámicos
  const dias = Array.from({ length: 7 }, (_, i) => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + i);
    return {
      nombre: fecha.toLocaleDateString("es-ES", { weekday: "short" }).toUpperCase(),
      numero: fecha.getDate(),
      mes: fecha.toLocaleDateString("es-ES", { month: "short" }).toUpperCase(),
    };
  });

 const horarios = [ { hora: "14:00", estado: "ocupado" }, 
  { hora: "15:00", estado: "disponible" }, 
  { hora: "16:00", estado: "ocupado" }, 
  { hora: "17:00", estado: "disponible" }, 
  { hora: "18:00", estado: "disponible" }, 
  { hora: "19:00", estado: "disponible" }, 
  { hora: "20:00", estado: "disponible" }, 
  { hora: "21:00", estado: "disponible" }, 
  { hora: "22:00", estado: "ocupado" }, 
  { hora: "23:00", estado: "disponible" }, ];

  const toggleHora = (hora) => { 
    if (horasSeleccionadas.includes(hora)) {
       setHorasSeleccionadas(horasSeleccionadas.filter((h) => h !== hora)); 
      } else { setHorasSeleccionadas([...horasSeleccionadas, hora]); } 
    };

  return (
    <div className={style.canchaContainer}>
 
      <div className={style.tituloCancha}>
  <box-icon name="chevron-left" size="md"></box-icon>
  <h2 className={style.titulo}>{titulo}</h2>
  <box-icon name="chevron-right" size="md"></box-icon>
</div>
     
      <img src={iconoCancha} alt="Cancha" className={style.iconoCancha} />

      {/* Calendario con Swiper */}
      <div className={style.calendarioContainer}>
        <Swiper slidesPerView={5} spaceBetween={10}>
          {dias.map((d, i) => (
            <SwiperSlide key={i}>
              <button
                className={`${style.diaBoton} ${
                  diaSeleccionado === i ? style.diaSeleccionado : ""
                }`}
                onClick={() => setDiaSeleccionado(i)}
              >
                <span className={style.textoDia}>{d.nombre}</span>
                <span className={style.textoNumero}>{d.numero}</span>
                <span className={style.textoMes}>{d.mes}</span>
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Horarios */}
       <div className={style.horarios}>
        {horarios.map((h, i) => (
          <button
            key={i}
            disabled={h.estado === "ocupado"}
            className={`
              ${style.horaBoton} 
              ${h.estado === "ocupado" ? style.horaOcupada : ""}
              ${horasSeleccionadas.includes(h.hora) ? style.horaSeleccionada : ""}
            `}
            onClick={() => toggleHora(h.hora)}
          >
            {h.hora}
          </button>
        ))}
      </div>
      <b className={style.expliacionHorarios}>
        *Seleccione la cantidad de horas.Si selecciona solo 15:00, el turno será de 15:00 a 16:00 hs.
      </b>

      {horasSeleccionadas.length > 0 && (
        <button className={style.confirmarBtn}>
          CONFIRMAR HORARIO ({horasSeleccionadas.join(", ")})
        </button>
      )}
    </div>
  );
}

export default Cancha;
