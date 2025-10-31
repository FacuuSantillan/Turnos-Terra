import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const NuevoTurnoModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    fecha: '',
    hora: '',
    cancha: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormData({ nombre: '', apellido: '', telefono: '', fecha: '', hora: '', cancha: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
    className="fixed inset-0 bg-[rgba(0,0,0,0.35)] flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-md relative border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">
          Nuevo Turno
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              id="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition text-gray-900"
              required
            />
          </div>

          <div>
            <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-1">
              Apellido
            </label>
            <input
              type="text"
              name="apellido"
              id="apellido"
              value={formData.apellido}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition text-gray-900"
              required
            />
          </div>

          <div>
            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              name="telefono"
              id="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition text-gray-900"
              required
            />
          </div>

          <div>
            <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha
            </label>
            <input
              type="date"
              name="fecha"
              id="fecha"
              value={formData.fecha}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition text-gray-900"
              required
            />
          </div>

          <div>
            <label htmlFor="hora" className="block text-sm font-medium text-gray-700 mb-1">
              Hora
            </label>
            <select
              name="hora"
              id="hora"
              value={formData.hora}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition text-gray-900"
              required
            >
              <option value="">Seleccionar hora</option>
              <option value="9:00">09:00</option>
              <option value="10:30">10:30</option>
              <option value="12:00">12:00</option>
            </select>
          </div>

          <div>
            <label htmlFor="cancha" className="block text-sm font-medium text-gray-700 mb-1">
              Cancha
            </label>
            <select
              name="cancha"
              id="cancha"
              value={formData.cancha}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition text-gray-900"
              required
            >
              <option value="">Seleccionar cancha</option>
              <option value="1">Cancha 1</option>
              <option value="2">Cancha 2</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700 transition"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NuevoTurnoModal;
