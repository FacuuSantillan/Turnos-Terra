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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormData({ nombre: '', apellido: '', telefono: '', fecha: '', hora: '', cancha: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose} 
    >
      <div 
        className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()} 
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Nuevo Turno</h2>

        <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input 
              type="text" 
              name="nombre" 
              id="nombre" 
              value={formData.nombre}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required 
            />
          </div>

          <div>
            <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
            <input 
              type="text" 
              name="apellido" 
              id="apellido" 
              value={formData.apellido}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required 
            />
          </div>

          <div>
            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input 
              type="tel" 
              name="telefono" 
              id="telefono" 
              value={formData.telefono}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required 
            />
          </div>

          <div>
            <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <input 
              type="date" 
              name="fecha" 
              id="fecha" 
              value={formData.fecha}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required 
            />
          </div>

          <div>
            <label htmlFor="hora" className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
            <select 
              name="hora" 
              id="hora" 
              value={formData.hora}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            >
              <option value="">Seleccionar hora</option>
              <option value="9:00">9:00</option>
              <option value="10:30">10:30</option>
              <option value="12:00">12:00</option>
            </select>
          </div>

          <div>
            <label htmlFor="cancha" className="block text-sm font-medium text-gray-700 mb-1">Cancha</label>
            <select 
              name="cancha" 
              id="cancha" 
              value={formData.cancha}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            >
              <option value="">Seleccionar cancha</option>
              <option value="1">Cancha 1</option>
              <option value="2">Cancha 2</option>
            </select>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="px-5 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700"
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