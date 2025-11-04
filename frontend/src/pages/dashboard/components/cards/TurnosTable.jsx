import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTurnos } from '../../../../redux/actions';

const formatFecha = (fechaString) => {
  if (!fechaString) return '';
  const [year, month, day] = fechaString.split('T')[0].split('-');
  return `${day}/${month}/${year}`;
};

const TurnosTable = ({ onTurnoClick }) => {
  const dispatch = useDispatch();
  const turnos = useSelector((state) => state.turnos);

  useEffect(() => {
    dispatch(getTurnos());
  }, [dispatch]);

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Turnos Reservados</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              {['Cliente', 'Teléfono', 'Fecha', 'Hora', 'Cancha', 'Acciones'].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {turnos.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-10 text-center text-gray-500 text-sm italic"
                >
                  No hay turnos reservados.
                </td>
              </tr>
            ) : (
              turnos.map((turno, index) => (
                <tr
                  key={turno.id || index}
                  onClick={() => onTurnoClick(turno)}
                  className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer border-b border-gray-100"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 capitalize">
                    {turno.Usuario?.nombre} {turno.Usuario?.apellido}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {turno.Usuario?.telefono}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatFecha(turno.fecha)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {turno.hora_inicio} a {turno.hora_fin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 shadow-sm">
                      {turno.Cancha?.nombre}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800 font-semibold ml-4 transition-colors"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TurnosTable;
