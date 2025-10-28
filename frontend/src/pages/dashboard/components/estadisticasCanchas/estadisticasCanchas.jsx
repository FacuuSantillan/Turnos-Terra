import React, { useEffect } from 'react'; 
import { useDispatch, useSelector } from 'react-redux'; 
import { getTurnos } from '../../../../redux/actions';
import { CalendarIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const EstadisticasCanchas = () => {
  const dispatch = useDispatch();
  const turnos = useSelector((state) => state.turnos);

  useEffect(() => {
    dispatch(getTurnos());
    const intervalId = setInterval(() => {
      dispatch(getTurnos());
    }, 60000); 
    return () => clearInterval(intervalId);
  }, [dispatch]);

  
  const esArrayValido = Array.isArray(turnos);

  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, '0'); 
  const dd = String(hoy.getDate()).padStart(2, '0');
  const fechaDeHoy = `${yyyy}-${mm}-${dd}`; 

  const totalTurnosHoy = esArrayValido 
    ? turnos.filter(t => t.fecha && t.fecha.startsWith(fechaDeHoy)).length 
    : 0;
  
  const turnosCancha1Hoy = esArrayValido 
    ? turnos.filter(t => 
        t.fecha && t.fecha.startsWith(fechaDeHoy) && 
        t.cancha_id === 1 
      ).length 
    : 0;
    
  const turnosCancha2Hoy = esArrayValido 
    ? turnos.filter(t => 
        t.fecha && t.fecha.startsWith(fechaDeHoy) && 
        t.cancha_id === 2 
      ).length 
    : 0;

  return (
    <div className="px-6 py-4">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 flex items-center space-x-4">

          <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full ring-1 ring-blue-200">
            <CalendarIcon className="h-6 w-6 text-blue-600" />
          </div>

          <div className='relative left-[5vh]'>
            <p className="text-sm font-medium text-gray-500">Turnos Hoy</p>
            <p className="text-2xl font-bold text-gray-900">{totalTurnosHoy}</p>
          </div>
        </div>
      
        <div className="bg-white rounded-xl shadow-lg p-6 flex items-center space-x-4">
          <div className="flex-shrink-0 bg-green-100 p-3 rounded-full ring-1 ring-green-200">
            <CheckCircleIcon className="h-6 w-6 text-green-600" />
          </div>

          <div className='relative left-[5vh]'>
            <p className="text-sm font-medium text-gray-500">Cancha 1</p>
            <p className="text-2xl font-bold text-gray-900">{turnosCancha1Hoy}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 flex items-center space-x-4">
          <div className="flex-shrink-0 bg-purple-100 p-3 rounded-full ring-1 ring-purple-200">
            <CheckCircleIcon className="h-6 w-6 text-purple-600" />
          </div>

          <div className='relative left-[5vh]'>
            <p className="text-sm font-medium text-gray-500">Cancha 2</p>
            <p className="text-2xl font-bold text-gray-900">{turnosCancha2Hoy}</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EstadisticasCanchas