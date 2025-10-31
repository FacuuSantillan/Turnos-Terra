import React, { useState, useMemo } from 'react';
import { Switch } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const parseGastoString = (str) => {
  if (!str) return 0;
  try {
    const parts = str.replace(/,/g, ' ').split(/\s+/);
    let total = 0;
    for (const part of parts) {
      if (part.includes('*')) {
        const nums = part.split('*');
        total += (parseFloat(nums[0]) || 0) * (parseFloat(nums[1]) || 0);
      } else {
        total += parseFloat(part) || 0;
      }
    }
    return total;
  } catch {
    return 0;
  }
};

const formatARS = (num) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(num);

const CalculadoraGastosModal = ({ isOpen, onClose }) => {
  const [costoTurnoStr, setCostoTurnoStr] = useState('');
  const [otrosGastosStr, setOtrosGastosStr] = useState('');
  const [jugadores, setJugadores] = useState(6);
  const [redondear, setRedondear] = useState(true);

  const [totalBruto, porJugadorExacto, porJugadorRedondeado, totalNecesario] = useMemo(() => {
    const costo = parseGastoString(costoTurnoStr);
    const otros = parseGastoString(otrosGastosStr);
    const bruto = costo + otros;
    const numJug = jugadores > 0 ? jugadores : 1;
    const exacto = bruto / numJug;
    const redondeado = Math.ceil(exacto / 100) * 100;
    const necesario = redondeado * numJug;
    return [bruto, exacto, redondeado, necesario];
  }, [costoTurnoStr, otrosGastosStr, jugadores]);

  if (!isOpen) return null;

  return (
    <div
    className="fixed inset-0 bg-[rgba(0,0,0,0.35)] flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden"
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Calculadora de Gastos</h2>
          <p className="text-sm text-gray-500">
            Calcula cuánto debe pagar cada jugador
          </p>
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-6 space-y-4">
          {/* Costo del turno */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Costo del turno <span className="text-xs text-gray-400">(ej: 17000*2)</span>
            </label>
            <input
              type="text"
              value={costoTurnoStr}
              onChange={(e) => setCostoTurnoStr(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:border-green-600 focus:ring-green-600"
            />
          </div>

          {/* Otros gastos */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Otros gastos <span className="text-xs text-gray-400">(ej: 3000*4 2000 5000)</span>
            </label>
            <input
              type="text"
              value={otrosGastosStr}
              onChange={(e) => setOtrosGastosStr(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:border-green-600 focus:ring-green-600"
            />
          </div>

          {/* Total */}
          <div className="bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-gray-800 text-right font-semibold">
            Total: <span className="text-green-700 text-lg font-bold">{formatARS(totalBruto)}</span>
          </div>

          {/* Jugadores */}
          <div>
            <label className="text-sm font-medium text-gray-700">Cantidad de jugadores</label>
            <input
              type="number"
              min="1"
              value={jugadores}
              onChange={(e) => setJugadores(Number(e.target.value))}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:border-green-600 focus:ring-green-600"
            />
          </div>

          {/* Redondeo */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <Switch.Group as="div" className="flex items-center justify-between">
              <div>
                <Switch.Label className="text-sm font-medium text-yellow-900">
                  Redondear precios
                </Switch.Label>
                <Switch.Description className="text-xs text-yellow-800">
                  Redondea a centenas más cercanas
                </Switch.Description>
              </div>
              <Switch
                checked={redondear}
                onChange={setRedondear}
                className={`${
                  redondear ? 'bg-yellow-500' : 'bg-gray-300'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200`}
              >
                <span
                  className={`${
                    redondear ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform bg-white rounded-full transition-transform duration-200`}
                />
              </Switch>
            </Switch.Group>
          </div>

          {/* Resultado */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-700 font-medium mb-1">
              Cada jugador debe pagar:
            </p>
            <p className="text-3xl font-bold text-orange-700">
              {formatARS(redondear ? porJugadorRedondeado : porJugadorExacto)}
            </p>
            <div className="mt-2 text-xs text-gray-500">
              <p>Precio exacto: {formatARS(porJugadorExacto)}</p>
              {redondear && (
                <>
                  <p>Redondeado a: {formatARS(porJugadorRedondeado)}</p>
                  <p>Total recaudado: {formatARS(totalNecesario)}</p>
                </>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-between pt-2">
            <button
              type="button"
              onClick={() => {
                setCostoTurnoStr('');
                setOtrosGastosStr('');
                setJugadores(6);
              }}
              className="px-5 py-2 text-sm font-medium rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              Limpiar Todo
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 text-sm font-medium rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculadoraGastosModal;
