// Importa useEffect y la acción filterTurnos
import React, { useEffect } from 'react'; 
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useDispatch, useSelector } from 'react-redux';
// Ajusta la ruta para importar AMBAS acciones
import { setSelectedDate, filterTurnos } from '../../redux/actions'; 

// ... (tus funciones helper como formatDateISO y la generación de 'dias' no cambian)
// ...

const DiasCalendario = () => {
  const dispatch = useDispatch();
  const diaSeleccionado = useSelector((state) => state.selectedDate);

  // --- 🚀 AÑADIDO: El "Efecto Secundario" ---
  // Este hook se ejecutará cada vez que 'diaSeleccionado' o 'dispatch' cambien.
  useEffect(() => {
    // Nos aseguramos de que haya una fecha seleccionada
    if (diaSeleccionado) {
      
      // 1. Despachamos la acción de filtrado
      //    Tu reducer (que ya está listo) recibirá esta acción
      //    y filtrará las listas 'turnos' y 'turnosFijos'.
      dispatch(filterTurnos({ fecha: diaSeleccionado }));
    
      // 2. (Opcional) Si también quieres filtrar por cancha, 
      //    necesitarías el ID de la cancha aquí. Por ahora,
      //    solo filtramos por fecha.
      // dispatch(filterTurnos({ 
      //   fecha: diaSeleccionado, 
      //   cancha: idDeLaCanchaSeleccionada 
      // }));
    }
  }, [diaSeleccionado, dispatch]); // <-- Dependencias del Effect

  const handleSelectDia = (fechaString) => {
    // Esto sigue igual: actualiza el estado 'selectedDate' en Redux
    dispatch(setSelectedDate(fechaString));
    
    // ¡Y eso es todo! Al cambiar 'selectedDate', el useEffect
    // de arriba se disparará automáticamente y llamará a filterTurnos.
  };

  // --- Tu JSX (Swiper, etc.) no necesita cambios ---
  // Se queda exactamente como lo tienes.
  return (
    <div className="w-full text-center">
      <Swiper
        slidesPerView={3}
        spaceBetween={10}
        centeredSlides
        slideToClickedSlide={true} 
      >
        {dias.map(({ fechaObjeto, fechaString }, i) => (
          <SwiperSlide
            key={i}
            onClick={() => handleSelectDia(fechaString)}
            className={`py-2 rounded-md cursor-pointer transition-all ${ 
              fechaString === diaSeleccionado
                ? 'bg-gray-800 text-white' 
                : 'bg-gray-100 text-gray-700'
            }`}
            style={{
              transform: fechaString === diaSeleccionado ? 'scale(1.05)' : 'scale(0.9)',
              opacity: fechaString === diaSeleccionado ? 1 : 0.7,
            }}
          >
            <div className="flex flex-col items-center justify-center h-full">
              <span className="font-semibold text-xs uppercase tracking-wider">
                {fechaObjeto.toLocaleDateString('es-ES', { weekday: 'short' })}
              </span>
              <span className="font-bold text-2xl my-1">
                {fechaObjeto.toLocaleDateString('es-ES', { day: '2-digit' })}
              </span>
              <span className="font-medium text-xs uppercase">
                {fechaObjeto.toLocaleDateString('es-ES', { month: 'short' })}
              </span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <p className="mt-4 text-gray-600">
        Día elegido: {' '}
        <strong className="text-gray-900">
          {new Date(`${diaSeleccionado}T12:00:00`).toLocaleDateString('es-ES', {
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