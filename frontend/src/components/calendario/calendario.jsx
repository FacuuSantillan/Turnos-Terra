import React, { useMemo } from 'react'; 
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

// Ahora recibimos la fecha y la función para cambiarla como PROPS
const DiasCalendario = ({ selectedDate, onDateChange }) => {

  // Generamos los días aquí mismo (para no depender de variables externas)
  const dias = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => {
      const fecha = new Date();
      fecha.setDate(fecha.getDate() + i);
      
      // Formato YYYY-MM-DD para comparar
      const y = fecha.getFullYear();
      const m = String(fecha.getMonth() + 1).padStart(2, "0");
      const d = String(fecha.getDate()).padStart(2, "0");
      const fechaString = `${y}-${m}-${d}`;

      return {
        fechaObjeto: fecha,
        fechaString: fechaString
      };
    });
  }, []);

  return (
    <div className="w-full text-center">
      <Swiper
        slidesPerView={3} // O 5, según tu diseño
        spaceBetween={10}
        centeredSlides={false} // A veces centeredSlides confunde la UX si son pocos días
        className="pb-2"
      >
        {dias.map(({ fechaObjeto, fechaString }, i) => (
          <SwiperSlide key={i}>
            <button
              onClick={() => onDateChange(fechaString)} // Llamamos a la función del padre
              className={`w-full py-2 rounded-xl cursor-pointer transition-all flex flex-col items-center justify-center border ${ 
                fechaString === selectedDate
                  ? 'bg-gray-800 text-white border-gray-800 shadow-lg transform scale-105' 
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span className="font-semibold text-xs uppercase tracking-wider opacity-80">
                {fechaObjeto.toLocaleDateString('es-ES', { weekday: 'short' })}
              </span>
              <span className="font-bold text-2xl my-0.5 leading-none">
                {fechaObjeto.toLocaleDateString('es-ES', { day: '2-digit' })}
              </span>
              <span className="font-medium text-[10px] uppercase opacity-80">
                {fechaObjeto.toLocaleDateString('es-ES', { month: 'short' })}
              </span>
            </button>
          </SwiperSlide>
        ))}
      </Swiper>

      <p className="mt-3 text-sm text-gray-600">
        Viendo horarios del: {' '}
        <strong className="text-gray-900 capitalize">
          {new Date(`${selectedDate}T12:00:00`).toLocaleDateString('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </strong>
      </p>
    </div>
  );
};

export default DiasCalendario;