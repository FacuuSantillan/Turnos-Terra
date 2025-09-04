import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const DiasCalendario = () => {
  const [diaSeleccionado, setDiaSeleccionado] = useState(new Date());

  // Genera 7 días desde hoy
  const dias = Array.from({ length: 7 }, (_, i) => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + i);
    return fecha;
  });

  const formatoDia = (fecha) =>
    fecha.toLocaleDateString("es-ES", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });

  return (
    <div className="w-full text-center">
      <Swiper slidesPerView={3} spaceBetween={10} centeredSlides>
        {dias.map((fecha, i) => (
          <SwiperSlide key={i}>
            <button
              className={`px-4 py-2 rounded-md ${
                fecha.toDateString() === diaSeleccionado.toDateString()
                  ? "bg-black text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setDiaSeleccionado(fecha)}
            >
              {formatoDia(fecha)}
            </button>
          </SwiperSlide>
        ))}
      </Swiper>

      <p className="mt-3">
        Día elegido: {diaSeleccionado.toLocaleDateString("es-ES")}
      </p>
    </div>
  );
};

export default DiasCalendario;
