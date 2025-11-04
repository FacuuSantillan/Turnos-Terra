import React, { useState, useEffect, useMemo } from 'react';
import { XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import { Tab } from '@headlessui/react';
import {
  getTurnosFijos,
  getTurnosFijosLiberados,
  liberarTurnoFijo,
  getHorarios,
  createTurnoFijo,
  updateTurnoFijo,
  deleteTurnoFijo
} from '../../../../redux/actions';

// --- Componentes auxiliares ---
const AlertModal = ({ title = "Aviso", message, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-[60]">
    <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 text-center">
      <ExclamationTriangleIcon className="h-10 w-10 text-yellow-500 mx-auto mb-3" />
      <h3 className="text-lg font-semibold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600 mb-5">{message}</p>
      <button
        onClick={onClose}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
      >
        Aceptar
      </button>
    </div>
  </div>
);

const ConfirmModal = ({ title = "Confirmar", message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-[60]">
    <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 text-center">
      <ExclamationTriangleIcon className="h-10 w-10 text-red-500 mx-auto mb-3" />
      <h3 className="text-lg font-semibold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600 mb-5">{message}</p>
      <div className="flex justify-center gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Confirmar
        </button>
      </div>
    </div>
  </div>
);

// --- Funciones auxiliares ---
const getDiaSemana = (num) => {
  const dias = ['Inválido', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  return dias[num] || 'Día inválido';
};

const diasSemana = [
  { id: 1, nombre: 'Lunes' },
  { id: 2, nombre: 'Martes' },
  { id: 3, nombre: 'Miércoles' },
  { id: 4, nombre: 'Jueves' },
  { id: 5, nombre: 'Viernes' },
  { id: 6, nombre: 'Sábado' },
  { id: 7, nombre: 'Domingo' },
];

const TurnosFijosModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const horarios = useSelector((state) => state.horarios);
  const turnosFijos = useSelector((state) => state.turnosFijos) || [];
  const liberados = useSelector((state) => state.turnosFijosLiberados) || [];

  const [fechaALiberar, setFechaALiberar] = useState('');
  const [turnoFijoId, setTurnoFijoId] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [editingTurno, setEditingTurno] = useState(null);
  const [apiError, setApiError] = useState(null);

  // NUEVOS estados para los modales
  const [modalInfo, setModalInfo] = useState(null);
  const [confirmInfo, setConfirmInfo] = useState(null);

  const [newAbonoData, setNewAbonoData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    cancha: '',
    dia_semana: '',
    horas: [],
  });

  useEffect(() => {
    if (isOpen) {
      dispatch(getTurnosFijos());
      dispatch(getTurnosFijosLiberados());
      dispatch(getHorarios());
      setApiError(null);
      setEditingTurno(null);
      setSelectedTab(0);
      setNewAbonoData({ nombre: '', apellido: '', telefono: '', cancha: '', dia_semana: '', horas: [] });
      setFechaALiberar('');
      setTurnoFijoId('');
    }
  }, [isOpen, dispatch]);

  const handleLiberar = async () => {
    if (!turnoFijoId || !fechaALiberar) {
      setModalInfo({ title: "Campos incompletos", message: "Por favor selecciona un turno fijo y una fecha." });
      return;
    }
    const result = await dispatch(liberarTurnoFijo({
      turno_fijo_id: Number(turnoFijoId),
      fecha: fechaALiberar
    }));
    if (result.success) {
      setModalInfo({ title: "Éxito", message: "Turno liberado con éxito." });
      setTurnoFijoId('');
      setFechaALiberar('');
    } else {
      setModalInfo({ title: "Error", message: result.error?.error || 'No se pudo liberar el turno.' });
    }
  };

  const handleDelete = (id, nombre) => {
    setConfirmInfo({
      title: "Eliminar abono",
      message: `¿Estás seguro de eliminar el abono de ${nombre}?`,
      onConfirm: async () => {
        const result = await dispatch(deleteTurnoFijo(id));
        if (result.success) {
          setModalInfo({ title: "Eliminado", message: "Abono eliminado con éxito." });
        } else {
          setModalInfo({ title: "Error", message: "No se pudo eliminar el abono." });
        }
        setConfirmInfo(null);
      },
      onCancel: () => setConfirmInfo(null)
    });
  };

    const handleEditClick = (turnoFijo) => {
    setApiError(null);
    setEditingTurno(turnoFijo);
    setSelectedTab(1);
  };

  const handleCancelEdit = () => {
    setApiError(null);
    setEditingTurno(null);
    setSelectedTab(0);
  };

  const handleNewAbonoChange = (e) => {
    const { name, value } = e.target;
    setApiError(null);
    if (name === 'cancha' || name === 'dia_semana') {
      setNewAbonoData(prev => ({ ...prev, [name]: value, horas: [] }));
    } else {
      setNewAbonoData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNewAbonoHorasChange = (horarioId) => {
    setApiError(null);
    setNewAbonoData(prev => {
      const currentHoras = prev.horas;
      const newHoras = currentHoras.includes(horarioId)
        ? currentHoras.filter(id => id !== horarioId)
        : [...currentHoras, horarioId];
      return { ...prev, horas: newHoras };
    });
  };

  const handleNewAbonoSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    const abonoParaAPI = {
      nombre: newAbonoData.nombre,
      apellido: newAbonoData.apellido,
      telefono: newAbonoData.telefono,
      cancha_id: Number(newAbonoData.cancha),
      dia_semana: Number(newAbonoData.dia_semana),
      horarios_ids: newAbonoData.horas,
    };

    const result = editingTurno
      ? await dispatch(updateTurnoFijo(editingTurno.id, abonoParaAPI))
      : await dispatch(createTurnoFijo(abonoParaAPI));

    if (result.success) {
      setModalInfo({ title: "Éxito", message: `Abono ${editingTurno ? 'modificado' : 'creado'} con éxito.` });
      setEditingTurno(null);
      setSelectedTab(0);
    } else {
      setApiError(result.error?.error || "Error al guardar el abono.");
    }
  };

  const horariosFiltrados = useMemo(() => {
    const canchaId = Number(newAbonoData.cancha);
    const diaSemana = Number(newAbonoData.dia_semana);
    if (!canchaId || !diaSemana || !Array.isArray(horarios)) return [];
    const horariosReservadosIds = turnosFijos
      .filter(tf => tf.id !== editingTurno?.id)
      .filter(tf => tf.cancha_id === canchaId && tf.dia_semana === diaSemana)
      .flatMap(tf => tf.Horarios?.map(h => h.id) || []);
    return horarios
      .filter(h => h.cancha_id === canchaId && h.activo)
      .map(h => ({ ...h, isReservado: horariosReservadosIds.includes(h.id) }))
      .sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));
  }, [horarios, turnosFijos, newAbonoData.cancha, newAbonoData.dia_semana, editingTurno]);

  if (!isOpen) return null;

  return (
    <>
      {/* MODALES DE ALERTA Y CONFIRMACIÓN */}
      {modalInfo && <AlertModal {...modalInfo} onClose={() => setModalInfo(null)} />}
      {confirmInfo && <ConfirmModal {...confirmInfo} />}

      {/* CONTENIDO PRINCIPAL */}
      <div className="backdrop-blur-sm fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-gray-200"
          onClick={(e) => e.stopPropagation()}
        >
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-2xl">
          <h2 className="text-2xl font-semibold text-gray-800">Gestión de Turnos Fijos</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <Tab.List className="flex space-x-1 bg-gray-100 p-1 border-b border-gray-200">
            {['Gestionar Abonos', editingTurno ? 'Editar Abono' : 'Crear Abono'].map((tab, i) => (
              <Tab
                key={i}
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium transition-all duration-200 ${
                    selected
                      ? 'bg-white text-green-700 shadow-inner'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-green-600'
                  }`
                }
              >
                {tab}
              </Tab>
            ))}
          </Tab.List>

          <Tab.Panels className="overflow-y-auto">
            <Tab.Panel className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Liberar Turno</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Abono</label>
                  <select
                    value={turnoFijoId}
                    onChange={(e) => setTurnoFijoId(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 bg-white focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Seleccionar...</option>
                    {turnosFijos.map(tf => (
                      <option key={tf.id} value={tf.id}>
                        {getDiaSemana(tf.dia_semana)} {tf.hora_inicio} ({tf.Usuario?.nombre}) - {tf.Cancha?.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                  <input
                    type="date"
                    value={fechaALiberar}
                    onChange={(e) => setFechaALiberar(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {turnoFijoId && fechaALiberar && isLiberado(Number(turnoFijoId), fechaALiberar) ? (
                  <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg">
                    <CheckCircleIcon className="h-5 w-5" />
                    <span className="text-sm font-medium">Este turno ya está liberado.</span>
                  </div>
                ) : (
                  <button
                    onClick={handleLiberar}
                    disabled={!turnoFijoId || !fechaALiberar}
                    className="w-full px-5 py-2.5 rounded-lg text-white font-medium bg-green-600 hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                  >
                    Liberar Horario
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800">Abonos Activos</h3>
                <div className="max-h-80 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {turnosFijos.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No hay abonos activos.</p>
                  ) : (
                    turnosFijos.map(tf => (
                      <div key={tf.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                        <p className="font-semibold text-gray-900 capitalize">
                          {getDiaSemana(tf.dia_semana)} {tf.hora_inicio} - {tf.hora_fin}
                        </p>
                        <p className="text-sm text-gray-600 capitalize">{tf.Usuario?.nombre} {tf.Usuario?.apellido}</p>
                        <p className="text-sm text-gray-600 capitalize">{tf.Cancha?.nombre}</p>
                        <div className="flex items-center gap-4 mt-2 pt-2 border-t border-gray-200">
                          <button
                            onClick={() => handleEditClick(tf)}
                            className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <PencilIcon className="h-4 w-4" />
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(tf.id, tf.Usuario?.nombre)}
                            className="flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
                          >
                            <TrashIcon className="h-4 w-4" />
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </Tab.Panel>

            <Tab.Panel className="p-6">
              <form onSubmit={handleNewAbonoSubmit} className="space-y-5">
                {apiError && (
                  <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-3 rounded-lg flex items-start gap-2">
                    <ExclamationTriangleIcon className="h-5 w-5 mt-0.5 text-red-400" />
                    <div>
                      <p className="font-semibold">Error al guardar</p>
                      <p className="text-sm">{apiError}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['nombre', 'apellido', 'telefono'].map((campo) => (
                    <div key={campo}>
                      <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{campo}</label>
                      <input
                        type={campo === 'telefono' ? 'tel' : 'text'}
                        name={campo}
                        value={newAbonoData[campo]}
                        onChange={handleNewAbonoChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cancha</label>
                    <select
                      name="cancha"
                      value={newAbonoData.cancha}
                      onChange={handleNewAbonoChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 bg-white focus:ring-2 focus:ring-green-500"
                      required
                    >
                      <option value="">Seleccionar cancha...</option>
                      <option value="1">Cancha 1</option>
                      <option value="2">Cancha 2</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Día</label>
                    <select
                      name="dia_semana"
                      value={newAbonoData.dia_semana}
                      onChange={handleNewAbonoChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 bg-white focus:ring-2 focus:ring-green-500"
                      required
                    >
                      <option value="">Seleccionar día...</option>
                      {diasSemana.map(dia => (
                        <option key={dia.id} value={dia.id}>{dia.nombre}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Horarios</label>
                  <div className="w-full max-h-48 overflow-y-auto border border-gray-200 rounded-2xl p-3 scrollbar-thin">
                    {!newAbonoData.cancha || !newAbonoData.dia_semana ? (
                      <p className="text-gray-500 text-center py-5 text-sm">Selecciona una cancha y un día.</p>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {horariosFiltrados.map((h) => (
                          <label
                            key={h.id}
                            className={`flex items-center justify-between px-3 py-2 rounded-xl border transition-all ${
                              h.isReservado
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                                : newAbonoData.horas.includes(h.id)
                                ? 'bg-green-100 border-green-400 text-green-700'
                                : 'bg-white hover:bg-gray-50 cursor-pointer'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                value={h.id}
                                checked={newAbonoData.horas.includes(h.id)}
                                onChange={() => handleNewAbonoHorasChange(h.id)}
                                disabled={h.isReservado}
                                className="rounded text-green-600 focus:ring-green-500 disabled:cursor-not-allowed"
                              />
                              <span className="text-sm font-medium">{h.hora_inicio}</span>
                            </div>
                            {h.isReservado && <span className="text-xs font-medium">Ocupado</span>}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
                  {editingTurno && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-4 py-2.5 rounded-lg font-medium bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      Cancelar
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
                  >
                    {editingTurno ? 'Guardar Cambios' : 'Crear Abono'}
                  </button>
                </div>
              </form>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
    </>
  );
};

export default TurnosFijosModal;
