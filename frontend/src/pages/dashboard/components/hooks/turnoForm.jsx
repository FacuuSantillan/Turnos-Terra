// src/components/TurnoForm.js
import React from 'react';
import useHorariosDisponibles from './useHorariosDisponibles';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

const TurnoForm = ({
  formData,
  setFormData,
  horarios,
  turnos,
  turnosFijos,
  liberados,
  isLoading,
  mode = 'crear',
}) => {
  const horariosFiltrados = useHorariosDisponibles({
    horarios,
    turnos,
    turnosFijos,
    liberados,
    fecha: formData.fecha,
    canchaId: Number(formData.cancha),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cancha' || name === 'fecha') {
      setFormData((prev) => ({ ...prev, [name]: value, horas: [] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleHorasChange = (id) => {
    const horario = horariosFiltrados.find((h) => h.id === id);
    if (horario && horario.status !== 'Disponible') return;

    setFormData((prev) => {
      const already = prev.horas.includes(id);
      return {
        ...prev,
        horas: already ? prev.horas.filter((h) => h !== id) : [...prev.horas, id],
      };
    });
  };

  return (
    <form className="space-y-5">
      {/* Campos del usuario */}
      {['nombre', 'apellido', 'telefono'].map((campo) => (
        <div key={campo}>
          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{campo}</label>
          <input
            type={campo === 'telefono' ? 'tel' : 'text'}
            name={campo}
            value={formData[campo]}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white shadow-sm hover:shadow-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            required
          />
        </div>
      ))}

      {/* Fecha */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
        <input
          type="date"
          name="fecha"
          value={formData.fecha}
          onChange={handleChange}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white shadow-sm hover:shadow-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
          required
        />
      </div>

      {/* Cancha */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cancha</label>
        <select
          name="cancha"
          value={formData.cancha}
          onChange={handleChange}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white shadow-sm hover:shadow-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
          required
        >
          <option value="">Seleccionar cancha</option>
          <option value="1">Cancha 1</option>
          <option value="2">Cancha 2</option>
        </select>
      </div>

      {/* Horarios */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Horarios disponibles
        </label>
        <div className="w-full max-h-48 overflow-y-auto border border-gray-200 rounded-2xl p-3 bg-gray-50">
          {isLoading ? (
            <p className="text-gray-500 text-center py-5 text-sm animate-pulse">Cargando...</p>
          ) : horariosFiltrados.length === 0 ? (
            <p className="text-gray-500 text-center py-5 text-sm">No hay horarios disponibles.</p>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {horariosFiltrados.map((h) => {
                const isSelected = formData.horas.includes(h.id);
                let style = 'bg-white border-gray-200 cursor-pointer';
                if (h.status === 'Reservado' || h.status === 'Turno Fijo')
                  style = 'bg-gray-100 text-gray-500 cursor-not-allowed';
                if (isSelected) style = 'bg-green-100 border-green-400 text-green-700';
                return (
                  <label
                    key={h.id}
                    className={`flex items-center px-3 py-2 rounded-xl border ${style}`}
                  >
                    <input
                      type="checkbox"
                      value={h.id}
                      checked={isSelected}
                      onChange={() => handleHorasChange(h.id)}
                      disabled={h.status !== 'Disponible'}
                      className="mr-2"
                    />
                    {h.hora_inicio}
                  </label>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default TurnoForm;
