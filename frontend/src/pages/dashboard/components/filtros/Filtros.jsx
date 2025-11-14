import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { filterTurnos } from '../../../../redux/actions'; 
import { 
  FunnelIcon, 
  MapPinIcon, 
  CalendarIcon, 
  ClockIcon, 
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline';
import { XCircleIcon } from '@heroicons/react/24/solid';

const FiltroTurnos = () => {
  const dispatch = useDispatch();

  const { turnos, turnosCopy, turnosFijos, turnosFijosCopy, horarios } = useSelector((state) => ({
    turnos: state.turnos,
    turnosCopy: state.turnosCopy,
    turnosFijos: state.turnosFijos,
    turnosFijosCopy: state.turnosFijosCopy,
    horarios: state.horarios,
  }));

  const [filtroCancha, setFiltroCancha] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroHorario, setFiltroHorario] = useState('');
  const [filtroCliente, setFiltroCliente] = useState('');

  useEffect(() => {
    const filtros = {
      cancha: filtroCancha,
      fecha: filtroFecha,
      horario: filtroHorario,
      cliente: filtroCliente,
    };
    dispatch(filterTurnos(filtros));
  }, [filtroCancha, filtroFecha, filtroHorario, filtroCliente, dispatch]);

  const handleLimpiarFiltros = () => {
    setFiltroCancha('');
    setFiltroFecha('');
    setFiltroHorario('');
    setFiltroCliente('');
  };

  const horariosUnicos = useMemo(() => {
    if (!Array.isArray(horarios) || horarios.length === 0) return [];
    const setDeHoras = new Set(horarios.map(h => h.hora_inicio));
    return Array.from(setDeHoras).sort((a, b) => a.localeCompare(b));
  }, [horarios]);

  return (
    <div className="relative top-[-4vh] bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-8 border border-gray-100 transition-all duration-300 hover:shadow-2xl">
      
      {/* --- Encabezado --- */}
      <div className="flex items-center gap-3 mb-8 border-b pb-3 border-gray-200">
        <FunnelIcon className="h-7 w-7 text-green-600" />
        <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">Filtrar Turnos</h2>
      </div>

      {/* --- Grid de filtros --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Filtro Cancha */}
        <FiltroCampo
          label="Cancha"
          icon={<MapPinIcon className="h-5 w-5 text-gray-400" />}
        >
          <select
            value={filtroCancha}
            onChange={(e) => setFiltroCancha(e.target.value)}
            className="w-full rounded-lg border-gray-300 bg-white text-gray-700 shadow-sm focus:border-green-500 focus:ring-green-500 pl-10 py-2 transition-all"
          >
            <option value="">Todas las canchas</option>
            <option value="1">Cancha 1</option>
            <option value="2">Cancha 2</option>
          </select>
        </FiltroCampo>

        {/* Filtro Fecha */}
        <FiltroCampo
          label="Fecha"
          icon={<CalendarIcon className="h-5 w-5 text-gray-400" />}
        >
          <input
            type="date"
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
            className="w-full rounded-lg border-gray-300 bg-white text-gray-700 shadow-sm focus:border-green-500 focus:ring-green-500 pl-10 py-2 transition-all"
          />
        </FiltroCampo>

        {/* Filtro Horario */}
        <FiltroCampo
          label="Horario"
          icon={<ClockIcon className="h-5 w-5 text-gray-400" />}
        >
          <select
            value={filtroHorario}
            onChange={(e) => setFiltroHorario(e.target.value)}
            className="w-full rounded-lg border-gray-300 bg-white text-gray-700 shadow-sm focus:border-green-500 focus:ring-green-500 pl-10 py-2 transition-all"
          >
            <option value="">Todos los horarios</option>
            {horariosUnicos.map(hora => (
              <option key={hora} value={hora}>{hora}</option>
            ))}
          </select>
        </FiltroCampo>

        {/* Filtro Cliente */}
        <FiltroCampo
          label="Cliente"
          icon={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
        >
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={filtroCliente}
            onChange={(e) => setFiltroCliente(e.target.value)}
            className="w-full rounded-lg border-gray-300 bg-white text-gray-700 shadow-sm focus:border-green-500 focus:ring-green-500 pl-10 py-2 transition-all"
          />
        </FiltroCampo>
      </div>

      {/* --- Footer --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-8 pt-5 border-t border-gray-200 gap-4">
        <button
          onClick={handleLimpiarFiltros}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          <XCircleIcon className="h-5 w-5 text-gray-500" />
          Limpiar filtros
        </button>

        <div className="text-sm text-gray-600 text-right leading-tight">
          <p>
            Turnos: <strong className="text-green-700">{turnos.length}</strong> / {turnosCopy.length}
          </p>
          <p>
            Turnos fijos: <strong className="text-green-700">{turnosFijos.length}</strong> / {turnosFijosCopy.length}
          </p>
        </div>
      </div>
    </div>
  );
};

/* --- Subcomponente para campos con ícono --- */
const FiltroCampo = ({ label, icon, children }) => (
  <div className="flex flex-col">
    <label className="text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        {icon}
      </div>
      {children}
    </div>
  </div>
);

export default FiltroTurnos;
