import React, { useState } from 'react';

const FiltroTurnos = () => {
  // Estado para manejar los valores de los filtros
  const [filtroCancha, setFiltroCancha] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroHorario, setFiltroHorario] = useState('');
  const [filtroCliente, setFiltroCliente] = useState('');

  const handleLimpiarFiltros = () => {
    setFiltroCancha('');
    setFiltroFecha('');
    setFiltroHorario('');
    setFiltroCliente('');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 relative top-[-3vh]">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Filtrar Turnos</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Filtro: Cancha */}
        <div>
          <label htmlFor="filtroCancha" className="block text-sm font-medium text-gray-700 mb-1">
            Cancha
          </label>
          <select 
            id="filtroCancha"
            value={filtroCancha}
            onChange={(e) => setFiltroCancha(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            <option value="">Todas las canchas</option>
            <option value="1">Cancha 1</option>
            <option value="2">Cancha 2</option>
          </select>
        </div>

        {/* Filtro: Fecha */}
        <div>
          <label htmlFor="filtroFecha" className="block text-sm font-medium text-gray-700 mb-1">
            Fecha
          </label>
          <input 
            type="date"
            id="filtroFecha"
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
         
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        {/* Filtro: Horario */}
        <div>
          <label htmlFor="filtroHorario" className="block text-sm font-medium text-gray-700 mb-1">
            Horario
          </label>
          <select 
            id="filtroHorario"
            value={filtroHorario}
            onChange={(e) => setFiltroHorario(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            <option value="">Todos los horarios</option>
            <option value="09:00">09:00</option>
            <option value="10:00">10:00</option>
            <option value="11:00">11:00</option>
          </select>
        </div>

        {/* Filtro: Cliente */}
        <div>
          <label htmlFor="filtroCliente" className="block text-sm font-medium text-gray-700 mb-1">
            Cliente
          </label>
          <input 
            type="text"
            id="filtroCliente"
            value={filtroCliente}
            onChange={(e) => setFiltroCliente(e.target.value)}
            placeholder="Buscar por nombre..."
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Fila inferior: Limpiar filtros y Conteo */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
        
        {/* Botón/Link Limpiar Filtros */}
        <button
          onClick={handleLimpiarFiltros}
          className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          Limpiar filtros
        </button>

        {/* Conteo de turnos */}
        <span className="text-sm text-gray-500">
          Mostrando 2 de 2 turnos
        </span>
      </div>
    </div>
  );
};

export default FiltroTurnos;