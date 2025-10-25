
// DashboardPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
// 1. Importamos los hooks de Redux
import { useSelector, useDispatch } from 'react-redux';
import { getHorarios } from '../../redux/actions';

// 2. ELIMINAMOS la importación de 'obtenerHorarios'
// import obtenerHorarios from './acciones/obtenerHorarios';

import './DashboardPage.css'; // Importamos los estilos

// --- Constantes ---
// Sacamos las constantes fuera del componente

const defaultConfig = {
  dashboard_title: 'Dashboard Cancha de Pádel',
  club_name: 'Terra Padel Club',
  primary_color: '#011272ff',
  secondary_color: '#2563eb',
  background_color: '#004d99ff',
};

// --- Componente Utilidad: Spinner ---
// Un componente pequeño para el spinner
const LoadingSpinner = () => <div className="loading-spinner"></div>;

// --- Componente Utilidad: Toast (Notificación) ---
// Un componente para mostrar notificaciones
const Toast = ({ message, type }) => {
  const bgColor =
    type === 'success'
      ? 'bg-green-500'
      : type === 'error'
      ? 'bg-red-500'
      : 'bg-blue-500';

  return (
    <div
      className={`toast ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg`}
    >
      {message}
    </div>
  );
};

// --- Componente Principal del Dashboard ---
// Este componente contendrá toda la LÓGICA y el ESTADO.
function DashboardPage() {
  // 3. ELIMINAMOS la llamada a 'obtenerHorarios'
  // let HORARIOS_DISPONIBLES = obtenerHorarios(); 

  // ==================================================================
  // --- 1. ESTADO (STATE) ---
  // ==================================================================
  
  // --- 4. ESTADO DE REDUX ---
  const dispatch = useDispatch();
  // Leemos los horarios desde el store de Redux.
  // Esta variable se actualizará sola cuando los datos lleguen.
const HORARIOS_DISPONIBLES = useSelector((state) =>
  state.horariosCopy.map(horarioObj => horarioObj.hora_inicio)
);

  // --- Estado de la Base de Datos ---
  const [turnos, setTurnos] = useState([]);
  const [canchas, setCanchas] = useState([]);
  const [horariosConfig, setHorariosConfig] = useState([]);
  const [config, setConfig] = useState(defaultConfig); // Para Element SDK

  // --- Estado de la UI ---
  const [currentDate, setCurrentDate] = useState('');
  const [toast, setToast] = useState(null); // { message, type }
  const [recordCount, setRecordCount] = useState(0);

  // --- Estado de los Filtros ---
  const [filtros, setFiltros] = useState({
    cancha: '',
    fecha: '',
    hora: '',
    cliente: '',
  });

  // --- Estado de los Modales ---
  const [modalAbierto, setModalAbierto] = useState(null);
  const [editingTurno, setEditingTurno] = useState(null); // Guarda el turno a editar
  const [editingCancha, setEditingCancha] = useState(null); // Guarda la cancha a editar

  // ==================================================================
  // --- 2. EFECTOS (EFFECTS) ---
  // ==================================================================

  // Efecto para inicializar todo (SDKs, fecha) - Se ejecuta 1 VEZ al cargar
  useEffect(() => {
    // 5. LLAMAMOS A LA ACCIÓN DE REDUX
    // Esto le dice a Redux que busque los horarios en la API
    dispatch(getHorarios());

    // 1. Actualizar fecha actual (reemplaza updateCurrentDate)
    const now = new Date();
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    setCurrentDate(now.toLocaleDateString('es-ES', options));

    // 2. Inicializar Data SDK (reemplaza dataHandler)
    const dataHandler = {
      onDataChanged(data) {
        console.log('Data SDK: Datos recibidos', data);
        const allData = data || [];
        
        // Actualizamos el estado de React. Esto re-renderizará la UI automáticamente.
        setTurnos(allData.filter((item) => item.type === 'turno' || !item.type));
        setHorariosConfig(
          allData.filter((item) => item.type === 'horario_config')
        );
        const newCanchas = allData.filter((item) => item.type === 'cancha');
        setCanchas(newCanchas);
        setRecordCount(allData.length);

        // Lógica para inicializar canchas si no existen
        if (newCanchas.length === 0 && allData.length < 997) {
           console.log("Inicializando canchas por defecto...");
           setTimeout(() => {
             handleCreateCancha({ numero: 1, nombre: 'Cancha 1', descripcion: 'Techada' }, false);
             handleCreateCancha({ numero: 2, nombre: 'Cancha 2', descripcion: 'Aire libre' }, false);
           }, 500);
        }
      },
    };

    if (window.dataSdk) {
      window.dataSdk.init(dataHandler).catch((error) => {
        console.error('Error al inicializar Data SDK:', error);
        showToast('Error al inicializar la base de datos', 'error');
      });
    }

    // 3. Inicializar Element SDK
    if (window.elementSdk) {
      window.elementSdk
        .init({
          defaultConfig,
          render: (newConfig) => setConfig(newConfig), // El SDK actualiza el estado de React
          mapToCapabilities: (config) => ({
            // ... (lógica original de mapToCapabilities)
          }),
          mapToEditPanelValues: (config) =>
            new Map([
              ['dashboard_title', config.dashboard_title || defaultConfig.dashboard_title],
              ['club_name', config.club_name || defaultConfig.club_name],
              ['contact_info', config.contact_info || defaultConfig.contact_info],
            ]),
        })
        .catch((error) => {
          console.error('Error al inicializar Element SDK:', error);
          showToast('Error al inicializar la configuración', 'error');
        });
    }

    // 4. Setear fecha mínima en inputs de fecha
    const today = new Date().toISOString().split('T')[0];
    // (Esto se hará directamente en el JSX de los modales)
  }, [dispatch]); // 6. Agregamos 'dispatch' a las dependencias

  // ==================================================================
  // --- 3. LÓGICA DE BACKEND (AQUÍ ESTÁ LA CLAVE) ---
  // ==================================================================

  // --- Función para mostrar notificaciones ---
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // --- Lógica de TURNOS ---
  const handleCreateTurno = async (turnoData) => {
    if (recordCount >= 999) {
      showToast('Límite máximo de 999 turnos alcanzado.', 'error');
      return; 
    }
    try {
      const nuevoTurno = {
        ...turnoData,
        id: Date.now().toString(),
        type: 'turno',
        createdAt: new Date().toISOString(),
      };
      const result = await window.dataSdk.create(nuevoTurno);
      if (result.isOk) {
        showToast('Turno creado correctamente', 'success');
        handleCloseModal(); // Cierra el modal
      } else {
        throw new Error('Error del SDK al crear');
      }
    } catch (error) {
      console.error('Error al crear turno:', error);
      showToast('Error al guardar el turno', 'error');
    }
  };

  const handleUpdateTurno = async (turnoData) => {
     try {
      const dataToUpdate = { ...turnoData, __backendId: editingTurno.__backendId };
      const result = await window.dataSdk.update(dataToUpdate);
      if (result.isOk) {
        showToast('Turno actualizado correctamente', 'success');
        handleCloseModal(); // Cierra el modal y limpia editingTurno
      } else {
        throw new Error('Error del SDK al actualizar');
      }
    } catch (error) {
      console.error('Error al actualizar turno:', error);
      showToast('Error al actualizar el turno', 'error');
    }
  };

  const handleDeleteTurno = async (turno) => {
     try {
      const result = await window.dataSdk.delete(turno);
      if (result.isOk) {
        showToast('Turno eliminado correctamente', 'success');
      } else {
        throw new Error('Error del SDK al eliminar');
      }
    } catch (error) {
      console.error('Error al eliminar turno:', error);
      showToast('Error al eliminar el turno', 'error');
    }
  };

  // --- Lógica de CANCHAS ---
  const handleCreateCancha = async (canchaData, showNotif = true) => {
     if (recordCount >= 999) {
      showToast('Límite máximo de 999 registros alcanzado.', 'error');
      return;
    }
     const existe = canchas.find(c => c.numero === parseInt(canchaData.numero));
     if (existe) {
       showToast('Ya existe una cancha con ese número', 'error');
       return;
     }

     try {
       const nuevaCancha = {
         ...canchaData,
         numero: parseInt(canchaData.numero),
         id: `cancha-${Date.now()}`,
         type: 'cancha',
         createdAt: new Date().toISOString(),
       };
       const result = await window.dataSdk.create(nuevaCancha);
       if (result.isOk) {
         if (showNotif) showToast('Cancha creada correctamente', 'success');
         handleCloseModal();
       } else {
         throw new Error('Error del SDK al crear cancha');
       }
     } catch (error) {
       console.error('Error al crear cancha:', error);
       if (showNotif) showToast('Error al guardar la cancha', 'error');
     }
  };
  
  const handleUpdateCancha = async (canchaData) => {
     const existe = canchas.find(c => 
       c.numero === parseInt(canchaData.numero) && c.id !== editingCancha.id
     );
     if (existe) {
       showToast('Ya existe otra cancha con ese número', 'error');
       return;
     }

     try {
       const dataToUpdate = { 
         ...canchaData, 
         numero: parseInt(canchaData.numero),
         __backendId: editingCancha.__backendId 
       };
       const result = await window.dataSdk.update(dataToUpdate);
       if (result.isOk) {
         showToast('Cancha actualizada correctamente', 'success');
         handleCloseModal();
       } else {
         throw new Error('Error del SDK al actualizar cancha');
       }
     } catch (error) {
       console.error('Error al actualizar cancha:', error);
       showToast('Error al actualizar la cancha', 'error');
     }
  };

  const handleDeleteCancha = async (cancha) => {
    const turnosEnCancha = turnos.filter(t => t.cancha === cancha.id);
    if (turnosEnCancha.length > 0) {
      showToast(`No se puede eliminar, la cancha tiene ${turnosEnCancha.length} turno(s) asignado(s)`, 'error');
      return;
    }

     try {
      const result = await window.dataSdk.delete(cancha);
      if (result.isOk) {
        showToast('Cancha eliminada correctamente', 'success');
      } else {
        throw new Error('Error del SDK al eliminar cancha');
      }
    } catch (error) {
      console.error('Error al eliminar cancha:', error);
      showToast('Error al eliminar la cancha', 'error');
    }
  };

  // --- Lógica de HORARIOS ---
  const handleSaveHorarios = async (nuevosHorarios) => {
    console.log("Guardando horarios...", nuevosHorarios);
    let errorOcurrido = false;

    const promesas = nuevosHorarios.map(config => {
      if (config.__backendId) {
        return window.dataSdk.update(config);
      } else {
        if (recordCount + nuevosHorarios.filter(h => !h.__backendId).length > 999) {
          errorOcurrido = true;
          return Promise.reject(new Error("Límite de registros excedido"));
        }
        return window.dataSdk.create({
          id: config.id,
          hora: config.hora,
          cancha: config.cancha,
          enabled: config.enabled,
          type: 'horario_config',
          createdAt: new Date().toISOString()
        });
      }
    });

    try {
      const results = await Promise.all(promesas);
      if (results.some(r => !r.isOk) || errorOcurrido) {
         throw new Error('Una o más operaciones fallaron');
      }
      showToast('Configuración guardada correctamente', 'success');
      handleCloseModal();
    } catch(error) {
      console.error("Error al guardar horarios:", error);
      showToast('Error al guardar la configuración', 'error');
    }
  };


  // ==================================================================
  // --- 4. DATOS DERIVADOS (Memoized) ---
  // ==================================================================

  // --- Canchas Ordenadas ---
  const sortedCanchas = useMemo(() => {
    return [...canchas].sort((a, b) => a.numero - b.numero);
  }, [canchas]);

  // --- Turnos Filtrados ---
  const turnosFiltrados = useMemo(() => {
    return turnos.filter((turno) => {
      const { cancha, fecha, hora, cliente } = filtros;
      const nombreCompleto = `${turno.nombre} ${turno.apellido}`.toLowerCase();

      if (cancha && turno.cancha !== cancha) return false;
      if (fecha && turno.fecha !== fecha) return false;
      if (hora && turno.hora !== hora) return false;
      if (cliente && !nombreCompleto.includes(cliente.toLowerCase().trim()))
        return false;

      return true;
    }).sort((a, b) => { // Ordenamos aquí
        const dateA = new Date(`${a.fecha}T${a.hora}`);
        const dateB = new Date(`${b.fecha}T${b.hora}`);
        return dateA - dateB;
    });
  }, [turnos, filtros]);

  // --- Estadísticas ---
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const turnosHoy = turnos.filter((turno) => turno.fecha === today).length;

    let cancha1Count = 0;
    let cancha1Nombre = "Cancha 1";
    if (sortedCanchas.length > 0) {
      cancha1Count = turnos.filter(t => t.cancha === sortedCanchas[0].id).length;
      cancha1Nombre = sortedCanchas[0].nombre;
    }
    
    let cancha2Count = 0;
    let cancha2Nombre = "Cancha 2";
    if (sortedCanchas.length > 1) {
      cancha2Count = turnos.filter(t => t.cancha === sortedCanchas[1].id).length;
      cancha2Nombre = sortedCanchas[1].nombre;
    }

    return {
      turnosHoy,
      cancha1: { nombre: cancha1Nombre, count: cancha1Count },
      cancha2: { nombre: cancha2Nombre, count: cancha2Count },
    };
  }, [turnos, sortedCanchas]);
  

  // ==================================================================
  // --- 5. MANEJADORES DE EVENTOS (Handlers) ---
  // ==================================================================

  // --- Manejadores de Modales ---
  const handleOpenModal = (modal, data = null) => {
    if (modal === 'turno' && data) {
      setEditingTurno(data); 
    }
    if (modal === 'cancha' && data) {
      setEditingCancha(data); 
    }
    setModalAbierto(modal);
  };

  const handleCloseModal = () => {
    setModalAbierto(null);
    setEditingTurno(null); 
    setEditingCancha(null); 
  };

  // --- Manejadores de Filtros ---
  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prevFiltros) => ({
      ...prevFiltros,
      [name]: value,
    }));
  };

  const handleClearFiltros = () => {
    setFiltros({ cancha: '', fecha: '', hora: '', cliente: '' });
  };


  // ==================================================================
  // --- 6. RENDERIZADO (JSX) ---
  // ==================================================================
  return (
  <div className="bg-gray-50 min-h-screen w-[102%]">
      {/* --- Contenedor de Notificaciones --- */}
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* --- Header --- */}
      <Header
        title={config.dashboard_title}
        clubName={config.club_name}
        contactInfo={config.contact_info}
        currentDate={currentDate}
      />

      {/* --- Contenido Principal --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* --- Stats Cards --- */}
        <StatsCards stats={stats} />

        {/* --- Botones de Acción --- */}
        <ActionButtons onOpenModal={handleOpenModal} />

        {/* --- Filtros --- */}
        {/* 7. Pasamos los horarios como prop */}
        <Filters
          filtros={filtros}
          canchas={sortedCanchas}
          onFiltroChange={handleFiltroChange}
          onClearFiltros={handleClearFiltros}
          turnosMostrados={turnosFiltrados.length}
          turnosTotales={turnos.length}
          horarios={HORARIOS_DISPONIBLES} 
        />

        {/* --- Tabla de Turnos --- */}
        <TurnosTable
          turnos={turnosFiltrados} 
          canchas={canchas} 
          onEdit={(turno) => handleOpenModal('turno', turno)}
          onDelete={handleDeleteTurno} 
        />
      </main>

      {/* ================================================== */}
      {/* --- MODALES (Renderizado Condicional) --- */}
      {/* ================================================== */}

      {/* --- Modal Nuevo/Editar Turno --- */}
      {modalAbierto === 'turno' && (
        <TurnoModal
          onClose={handleCloseModal}
          onSave={editingTurno ? handleUpdateTurno : handleCreateTurno}
          turnoExistente={editingTurno}
          canchas={sortedCanchas}
          horariosConfig={horariosConfig}
          horariosDisponibles={HORARIOS_DISPONIBLES} // 7. Pasamos los horarios
        />
      )}
      
      {/* --- Modal Disponibilidad --- */}
      {modalAbierto === 'disponibilidad' && (
        <DisponibilidadModal
          onClose={handleCloseModal}
          turnos={turnos}
          canchas={sortedCanchas}
          horariosConfig={horariosConfig}
          horariosDisponibles={HORARIOS_DISPONIBLES} // 7. Pasamos los horarios
        />
      )}
      
      {/* --- Modal Configurar Horarios --- */}
      {modalAbierto === 'configurar' && (
        <ConfigurarHorariosModal
          onClose={handleCloseModal}
          onSave={handleSaveHorarios}
          canchas={sortedCanchas}
          horariosConfigActual={horariosConfig}
          horariosDisponibles={HORARIOS_DISPONIBLES} // 7. Pasamos los horarios
        />
      )}
      
      {/* --- Modal Gestionar Canchas --- */}
      {modalAbierto === 'gestionar' && (
        <GestionarCanchasModal
          onClose={handleCloseModal}
          onOpenCanchaModal={handleOpenModal}
          onDeleteCancha={handleDeleteCancha}
          canchas={sortedCanchas}
        />
      )}
      
      {/* --- Modal Nueva/Editar Cancha (se abre desde Gestionar Canchas) --- */}
      {modalAbierto === 'cancha' && (
        <CanchaModal
          onClose={handleCloseModal}
          onSave={editingCancha ? handleUpdateCancha : handleCreateCancha}
          canchaExistente={editingCancha}
          canchas={canchas}
        />
      )}
      
      {/* --- Modal Calculadora --- */}
      {modalAbierto === 'calculadora' && (
        <CalculadoraModal onClose={handleCloseModal} />
      )}
    </div>
  );
}

// ==================================================================
// --- 7. SUB-COMPONENTES (HIJOS) ---
// ==================================================================

// --- Componente Header ---
function Header({ title, clubName, contactInfo, currentDate }) {
  return (
    <header className="bg-blue-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div>
            <h1 id="dashboard-title" className="text-3xl font-bold text-white">
              {title}
            </h1>
            <p id="club-name" className="text-green-100 mt-1">
              {clubName}
            </p>
          </div>
          <div className="text-right">
            <p id="contact-info" className="text-green-100">
              {contactInfo}
            </p>
            <p className="text-green-200 text-sm" id="current-date">
              {currentDate}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

// --- Componente StatsCards ---
function StatsCards({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Card: Turnos Hoy */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Turnos Hoy</p>
            <p className="text-2xl font-semibold text-gray-900" id="turnos-hoy">
              {stats.turnosHoy}
            </p>
          </div>
        </div>
      </div>
      {/* Card: Cancha 1 */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{stats.cancha1.nombre}</p>
            <p className="text-2xl font-semibold text-gray-900" id="cancha-1-count">
              {stats.cancha1.count}
            </p>
          </div>
        </div>
      </div>
      {/* Card: Cancha 2 */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-100">
            <svg
              className="w-6 h-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{stats.cancha2.nombre}</p>
            <p className="text-2xl font-semibold text-gray-900" id="cancha-2-count">
              {stats.cancha2.count}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Componente ActionButtons ---
function ActionButtons({ onOpenModal }) {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <button
        id="nuevo-turno-btn"
        onClick={() => onOpenModal('turno')}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          ></path>
        </svg>
        Nuevo Turno
      </button>
      <button
        id="disponibilidad-btn"
        onClick={() => onOpenModal('disponibilidad')}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
      >
        <svg
          className="w-5 h-5"
  _BHR_CODE_         fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
  _BHR_CODE_     </svg>
        Ver Disponibilidad
      </button>
      <button
        id="configurar-horarios-btn"
        onClick={() => onOpenModal('configurar')}
        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          ></path>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          ></path>
        </svg>
        Configurar Horarios
      </button>
      <button
        id="gestionar-canchas-btn"
        onClick={() => onOpenModal('gestionar')}
        className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          ></path>
        </svg>
        Gestionar Canchas
      </button>
      <button
        id="calculadora-btn"
        onClick={() => onOpenModal('calculadora')}
        className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16a2 2 0 002 2z"
          ></path>
        </svg>
        Calculadora
      </button>
    </div>
  );
}

// --- Componente Filters ---
function Filters({
  filtros,
  canchas,
  onFiltroChange,
  onClearFiltros,
  turnosMostrados,
  turnosTotales,
  horarios, // 8. Recibimos los horarios como prop
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Filtrar Turnos
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Filtro Cancha */}
        <div>
          <label
            htmlFor="filtro-cancha"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Cancha
          </label>
          <select
            id="filtro-cancha"
            name="cancha"
            value={filtros.cancha}
            onChange={onFiltroChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Todas las canchas</option>
            {canchas.map(cancha => (
              <option key={cancha.id} value={cancha.id}>{cancha.nombre}</option>
            ))}
          </select>
        </div>
        {/* Filtro Fecha */}
        <div>
          <label
            htmlFor="filtro-fecha"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Fecha
          </label>
          <input
            type="date"
            id="filtro-fecha"
            name="fecha"
            value={filtros.fecha}
            onChange={onFiltroChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        {/* Filtro Hora */}
        <div>
          <label
            htmlFor="filtro-hora"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Horario
          </label>
          <select
            id="filtro-hora"
            name="hora"
            value={filtros.hora}
            onChange={onFiltroChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Todos los horarios</option>
            {/* 9. Usamos la prop 'horarios' */}
            {horarios.map(hora => (
              <option key={hora} value={hora}>{hora}</option>
            ))}
          </select>
        </div>
        {/* Filtro Cliente */}
        <div>
          <label
            htmlFor="filtro-cliente"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Cliente
          </label>
          <input
            type="text"
            id="filtro-cliente"
            name="cliente"
            value={filtros.cliente}
            onChange={onFiltroChange}
            placeholder="Buscar por nombre..."
          	 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>
      {/* Botones de Filtro */}
      <div className="flex justify-between items-center mt-4">
        <button
          id="limpiar-filtros-btn"
          onClick={onClearFiltros}
          className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
        >
          Limpiar filtros
        </button>
        <div className="text-sm text-gray-600">
          Mostrando <span id="turnos-mostrados">{turnosMostrados}</span> de{' '}
          <span id="turnos-totales">{turnosTotales}</span> turnos
        </div>
      </div>
    </div>
  );
}

// --- Componente TurnosTable ---
function TurnosTable({ turnos, canchas, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          Turnos Reservados
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Teléfono
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hora
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cancha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody id="turnos-tbody" className="bg-white divide-y divide-gray-200">
            {turnos.length === 0 ? (
              <tr id="no-turnos-row">
                <td
                  colSpan="6"
                  className="px-6 py-8 text-center text-gray-500"
                >
                  No se encontraron turnos con los filtros aplicados.
                </td>
              </tr>
            ) : (
              turnos.map((turno) => (
                <TurnoRow
                  key={turno.id}
                  turno={turno}
                  canchas={canchas}
                  onEdit={onEdit}
                  onDelete={onDelete}
    _BHR_CODE_             />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- Componente TurnoRow (Fila de la tabla) ---
function TurnoRow({ turno, canchas, onEdit, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  const getColorForCancha = (canchaId) => {
    const colors = [
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-blue-100 text-blue-800',
      'bg-orange-100 text-orange-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800',
    ];
    const canchaIndex = canchas.findIndex((c) => c.id === canchaId);
    return colors[canchaIndex % colors.length] || 'bg-gray-100 text-gray-800';
  };

  const cancha = canchas.find((c) => c.id === turno.cancha);
  const canchaName = cancha ? cancha.nombre : `Cancha ID: ${turno.cancha}`;
  const canchaColor = getColorForCancha(turno.cancha);
  
  const [year, month, day] = turno.fecha.split('-');
  const fechaFormatted = `${day}/${month}/${year}`;
  
  const handleDeleteClick = () => {
    onDelete(turno); 
    setConfirmDelete(false); 
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {turno.nombre} {turno.apellido}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {turno.telefono}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {fechaFormatted}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {turno.hora}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${canchaColor}`}
        >
          {canchaName}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
        {confirmDelete ? (
          <>
            <button
              onClick={handleDeleteClick}
              className="text-red-600 hover:text-red-900 font-medium"
            >
              ¿Confirmar?
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="text-gray-600 hover:text-gray-900"
            >
              Cancelar
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onEdit(turno)} 
              className="text-blue-600 hover:text-blue-900 transition-colors"
            >
              Editar
            </button>
            <button
              onClick={() => setConfirmDelete(true)} 
              className="text-red-600 hover:text-red-900 transition-colors"
            >
              Eliminar
            </button>
          </>
        )}
      </td>
    </tr>
  );
}

// ==================================================================
// --- 8. COMPONENTES DE MODALES ---
// ==================================================================

// --- Componente TurnoModal ---
// 8. Recibimos 'horariosDisponibles' como prop
function TurnoModal({ onClose, onSave, turnoExistente, canchas, horariosConfig, horariosDisponibles }) {
  const [formData, setFormData] = useState({
    nombre: turnoExistente?.nombre || '',
    apellido: turnoExistente?.apellido || '',
    telefono: turnoExistente?.telefono || '',
    fecha: turnoExistente?.fecha || '',
    hora: turnoExistente?.hora || '',
    cancha: turnoExistente?.cancha || '',
    id: turnoExistente?.id || null, 
    type: 'turno',
    createdAt: turnoExistente?.createdAt || null,
    __backendId: turnoExistente?.__backendId || null,
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [today] = useState(new Date().toISOString().split('T')[0]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await onSave(formData); 
    setIsSaving(false);
  };

  const isHorarioEnabled = (hora, canchaId) => {
    const canchaNum = canchas.find(c => c.id === canchaId)?.numero;
    if (!canchaNum) return true; 
    
    const configId = `${hora}-${canchaNum}`;
    const config = horariosConfig.find((c) => c.id === configId);
    return config ? config.enabled : true; 
  };

  // Opciones de horarios filtrados
  const opcionesHorario = useMemo(() => {
    // 9. Usamos la prop 'horariosDisponibles'
    if (!formData.cancha) return horariosDisponibles; 
    
    return horariosDisponibles.filter(hora => 
      isHorarioEnabled(hora, formData.cancha)
    );
  }, [formData.cancha, horariosConfig, canchas, horariosDisponibles]); // 9. Añadimos la prop a las dependencias
  
  // Efecto para actualizar las horas si la cancha cambia
  useEffect(() => {
    if (formData.cancha && !opcionesHorario.includes(formData.hora)) {
      setFormData(prev => ({ ...prev, hora: '' }));
    }
  }, [formData.cancha, opcionesHorario, formData.hora]);


  return (
    <div
      id="turno-modal"
      className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center min-h-screen px-4 fade-in"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 id="modal-title" className="text-lg font-semibold text-gray-900">
            {turnoExistente ? 'Editar Turno' : 'Nuevo Turno'}
          </h3>
        </div>
        
        <form id="turno-form" className="px-6 py-4 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"/>
          </div>
          <div>
            <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
          	 <input type="text" id="apellido" name="apellido" value={formData.apellido} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"/>
          </div>
          <div>
            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input type="tel" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"/>
          </div>
          <div>
            <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
          	 <input type="date" id="fecha" name="fecha" value={formData.fecha} onChange={handleChange} min={today} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"/>
          </div>
          <div>
          	 <label htmlFor="cancha" className="block text-sm font-medium text-gray-700 mb-1">Cancha</label>
          	 <select id="cancha" name="cancha" value={formData.cancha} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
            	 <option value="">Seleccionar cancha</option>
            	 {canchas.map(cancha => (
              	 <option key={cancha.id} value={cancha.id}>{cancha.nombre} ({cancha.descripcion})</option>
            	 ))}
          	 </select>
          </div>
          <div>
          	 <label htmlFor="hora" className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
          	 <select id="hora" name="hora" value={formData.hora} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" disabled={!formData.cancha}>
            	 <option value="">{formData.cancha ? 'Seleccionar hora' : 'Selecciona una cancha primero'}</option>
            	 {opcionesHorario.map(hora => (
              	  <option key={hora} value={hora}>{hora}</option>
            	 ))}
          	 </select>
          </div>
        </form>
        
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
        	 <button id="cancel-btn" type="button" onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors" disabled={isSaving}>
          	 Cancelar
        	 </button>
        	 <button id="save-btn" type="submit" form="turno-form" className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors flex items-center gap-2" disabled={isSaving}>
          	 {isSaving ? (
            	 <>
              	 <span>Guardando...</span>
              	 <LoadingSpinner />
            	 </>
          	 ) : (
          	 	 <span>Guardar</span>
          	 )}
        	 </button>
        </div>
      </div>
    </div>
  );
}

// --- Componente DisponibilidadModal ---
// 8. Recibimos 'horariosDisponibles' como prop
function DisponibilidadModal({ onClose, turnos, canchas, horariosConfig, horariosDisponibles }) {
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);

  const isHorarioEnabled = (hora, canchaId) => {
    const canchaNum = canchas.find(c => c.id === canchaId)?.numero;
    if (!canchaNum) return true; 
    
    const configId = `${hora}-${canchaNum}`;
    const config = horariosConfig.find((c) => c.id === configId);
    return config ? config.enabled : true; 
  };

  const getColorForCancha = (canchaId) => {
    const colors = [
      { bg: 'bg-green-500', text: 'text-green-800', bgLight: 'bg-green-100' },
      { bg: 'bg-purple-500', text: 'text-purple-800', bgLight: 'bg-purple-100' },
      { bg: 'bg-blue-500', text: 'text-blue-800', bgLight: 'bg-blue-100' },
      { bg: 'bg-orange-500', text: 'text-orange-800', bgLight: 'bg-orange-100' },
      { bg: 'bg-pink-500', text: 'text-pink-800', bgLight: 'bg-pink-100' },
      { bg: 'bg-indigo-500', text: 'text-indigo-800', bgLight: 'bg-indigo-100' },
    ];
  	 const canchaIndex = canchas.findIndex((c) => c.id === canchaId);
  	 return colors[canchaIndex % colors.length] || { bg: 'bg-gray-500', text: 'text-gray-800', bgLight: 'bg-gray-100' };
  };

  // Datos de disponibilidad calculados
  const disponibilidad = useMemo(() => {
  	 const turnosFecha = turnos.filter(turno => turno.fecha === fecha);
  	 
  	 return canchas.map(cancha => {
      // 9. Usamos la prop 'horariosDisponibles'
  	 	 const horarios = horariosDisponibles.map(hora => {
  	 	 	 const enabled = isHorarioEnabled(hora, cancha.id);
  	 	 	 const ocupado = turnosFecha.some(t => t.hora === hora && t.cancha === cancha.id);
  	 	 	 
  	 	 	 let status = 'Disponible';
  	 	 	 let color = 'bg-green-100 text-green-800';
  	 	 	 
  	 	 	 if (!enabled) {
  	 	 	 	 status = 'Deshabilitado';
  	 	 	 	 color = 'bg-gray-100 text-gray-600';
  	 	 	 } else if (ocupado) {
  	 	 	 	 status = 'Ocupado';
  	 	 	 	 color = 'bg-red-100 text-red-800';
  	 	 	 }
  	 	 	 
  	 	 	 return { hora, status, color };
  	 	 });
  	 	 return { ...cancha, horarios, color: getColorForCancha(cancha.id) };
  	 });
  }, [fecha, turnos, canchas, horariosConfig, horariosDisponibles]); // 9. Añadimos la prop a las dependencias

  return (
  	 <div
  	 	 id="disponibilidad-modal"
  	 	 className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center min-h-screen px-4 fade-in"
  	 >
  	 	 <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
  	 	 	 <div className="px-6 py-4 border-b border-gray-200">
  	 	 	 	 <h3 className="text-lg font-semibold text-gray-900">
  	 	 	 	 	 Disponibilidad de Canchas
  	 	 	 	 </h3>
  	 	 	 </div>
  	 	 	 
  	 	 	 <div className="px-6 py-4 overflow-y-auto">
  	 	 	 	 <div className="mb-4">
  	 	 	 	 	 <label htmlFor="fecha-disponibilidad" className="block text-sm font-medium text-gray-700 mb-2">
  	 	 	 	 	 	 Seleccionar Fecha
  	 	 	 	 	 </label>
  	 	 	 	 	 <input
  	 	 	 	 	 	 type="date"
  	 	 	 	 	 	 id="fecha-disponibilidad"
  	 	 	 	 	 	 value={fecha}
  	 	 	 	 	 	 onChange={(e) => setFecha(e.target.value)}
  	 	 	 	 	 	 className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  	 	 	 	 	 />
  	 	 	 	 </div>
  	 	 	 	 
  	 	 	 	 <div id="disponibilidad-grid" className="grid grid-cols-1 md:grid-cols-2 gap-6">
  	 	 	 	 	 {disponibilidad.length === 0 ? (
  	 	 	 	 	 	 	<div className="col-span-full text-center py-8 text-gray-500">
  	 	 	 	 	 	 		No hay canchas configuradas. Ve a "Gestionar Canchas".
  	 	 	 	 	 	 	</div>
  	 	 	 	 	 ) : (
  	 	 	 	 	 	 disponibilidad.map(cancha => (
  	 	 	 	 	 	 	 <div key={cancha.id} className="bg-gray-50 rounded-lg p-4">
  	 	 	 	 	 	 	 	 <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
  	 	 	 	 	 	 	 	 	 <span className={`w-3 h-3 ${cancha.color.bg} rounded-full`}></span>
  	 	 	 	 	 	 	 	 	 {cancha.nombre}
  	 	 	 	 	 	 	 	 	 <span className="text-sm font-normal text-gray-600">({cancha.descripcion})</span>
  	 	 	 	 	 	 	 	 </h4>
  	 	 	 	 	 	 	 	 <div className="space-y-2">
  	 	 	 	 	 	 	 	 	 {cancha.horarios.map(h => (
  	 	 	 	 	 	 	 	 	 	 <div key={h.hora} className={`flex justify-between items-center p-2 rounded ${h.color}`}>
  	 	 	 	 	 	 	 	 	 	 	 <span>{h.hora}</span>
  	 	 	 	 	 	 	 	 	 	 	 <span className="text-sm font-medium">{h.status}</span>
  	 	 	 	 	 	 	 	 	 	 </div>
  	 	 	 	 	 	 	 	 	 ))}
  	 	 	 	 	 	 	 	 </div>
  	 	 	 	 	 	 	 </div>
  	 	 	 	 	 	 ))
  	 	 	 	 	 )}
  	 	 	 	 </div>
  	 	 	 </div>
  	 	 	 
  	 	 	 <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
  	 	 	 	 <button id="close-disponibilidad-btn" onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors">
  	 	 	 	 	 Cerrar
  	 	 	 	 </button>
  	 	 	 </div>
  	 	 </div>
  	 </div>
  );
}

// --- Componente ConfigurarHorariosModal ---
// 8. Recibimos 'horariosDisponibles' como prop
function ConfigurarHorariosModal({ onClose, onSave, canchas, horariosConfigActual, horariosDisponibles }) {
  // Estado local para manejar los cambios antes de guardar
  const [horarios, setHorarios] = useState(() => {
  	 const initialState = [];
  	 canchas.forEach(cancha => {
      // 9. Usamos la prop 'horariosDisponibles'
  	 	 horariosDisponibles.forEach(hora => {
  	 	 	 const configId = `${hora}-${cancha.numero}`;
  	 	 	 const configExistente = horariosConfigActual.find(c => c.id === configId);
  	 	 	 if (configExistente) {
  	 	 	 	 initialState.push({ ...configExistente });
  	 	 	 } else {
  	 	 	 	 initialState.push({
  	 	 	 	 	 id: configId,
  	 	 	 	 	 hora: hora,
  	 	 	 	 	 cancha: cancha.numero,
  	 	 	 	 	 enabled: true, // Habilitado por defecto
  	 	 	 	 	 type: 'horario_config',
  	 	 	 	 });
  	 	 	 }
  	 	 });
  	 });
  	 return initialState;
  });
  
  const [isSaving, setIsSaving] = useState(false);

  const toggleHorario = (hora, canchaNum, enabled) => {
  	 const configId = `${hora}-${canchaNum}`;
  	 setHorarios(prevHorarios => 
  	 	 prevHorarios.map(h => 
  	 	 	 h.id === configId ? { ...h, enabled } : h
  	 	 )
  	 );
  };
  
  const handleSave = async () => {
  	 setIsSaving(true);
  	 const cambios = horarios.filter(h => {
  	 	 const original = horariosConfigActual.find(ho => ho.id === h.id);
  	 	 if (!original) return true; // Es nuevo
  	 	 return original.enabled !== h.enabled; // Cambió
  	 });

  	 await onSave(cambios); 
  	 setIsSaving(false);
  };

  const getColorForCancha = (canchaId) => {
  	 const colors = [
  	 	 { bg: 'bg-green-500', text: 'text-green-800', bgLight: 'bg-green-100', ring: 'peer-focus:ring-green-300', peer: 'peer-checked:bg-green-600' },
  	 	 { bg: 'bg-purple-500', text: 'text-purple-800', bgLight: 'bg-purple-100', ring: 'peer-focus:ring-purple-300', peer: 'peer-checked:bg-purple-600' },
  	 	 { bg: 'bg-blue-500', text: 'text-blue-800', bgLight: 'bg-blue-100', ring: 'peer-focus:ring-blue-300', peer: 'peer-checked:bg-blue-600' },
  	 	 { bg: 'bg-orange-500', text: 'text-orange-800', bgLight: 'bg-orange-100', ring: 'peer-focus:ring-orange-300', peer: 'peer-checked:bg-orange-600' },
  	 	 { bg: 'bg-pink-500', text: 'text-pink-800', bgLight: 'bg-pink-100', ring: 'peer-focus:ring-pink-300', peer: 'peer-checked:bg-pink-600' },
  	 	 { bg: 'bg-indigo-500', text: 'text-indigo-800', bgLight: 'bg-indigo-100', ring: 'peer-focus:ring-indigo-300', peer: 'peer-checked:bg-indigo-600' },
  	 ];
  	 const canchaIndex = canchas.findIndex((c) => c.id === canchaId);
  	 return colors[canchaIndex % colors.length] || { bg: 'bg-gray-500', text: 'text-gray-800', bgLight: 'bg-gray-100', ring: 'peer-focus:ring-gray-300', peer: 'peer-checked:bg-gray-600' };
  };

  return (
  	 <div id="configurar-horarios-modal" className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center min-h-screen px-4 fade-in">
  	 	 <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
  	 	 	 <div className="px-6 py-4 border-b border-gray-200">
  	 	 	 	 <h3 className="text-lg font-semibold text-gray-900">Configurar Horarios de Canchas</h3>
  	 	 	 	 <p className="text-sm text-gray-600 mt-1">Habilita o deshabilita horarios para cada cancha</p>
  	 	 	 </div>
  	 	 	 
  	 	 	 <div className="px-6 py-4 overflow-y-auto">
  	 	 	 	 <div id="horarios-grid" className="grid grid-cols-1 md:grid-cols-2 gap-6">
  	 	 	 	 	 {canchas.length === 0 ? (
  	 	 	 	 	 	 <div className="col-span-full text-center py-8 text-gray-500">
            	 	 	 		No hay canchas configuradas. Ve a "Gestionar Canchas".
  	 	 	 	 	 	 </div>
  	 	 	 	 	 ) : (
  	 	 	 	 	 	 canchas.map(cancha => {
  	 	 	 	 	 	 	 const colors = getColorForCancha(cancha.id);
  	 	 	 	 	 	 	 return (
  	 	 	 	 	 	 	 	 <div key={cancha.id} className="bg-gray-50 rounded-lg p-4">
  	 	 	 	 	 	 	 	 	 <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
  	 	 	 	 	 	 	 	 	 	 <span className={`w-3 h-3 ${colors.bg} rounded-full`}></span>
  	 	 	 	 	 	 	 	 	 	 {cancha.nombre}
  	 	 	 	 	 	 	 	 	 	 <span className="text-sm font-normal text-gray-600">({cancha.descripcion})</span>
  	 	 	 	 	 	 	 	 	 </h4>
  	 	 	 	   	 	 	 	 <div className="space-y-3">
                        {/* 9. Usamos la prop 'horariosDisponibles' */}
  	 	 	 	 	 	 	 	 	 {horariosDisponibles.map(hora => {
  	 	 	 	 	 	 	 	 	 	 const configId = `${hora}-${cancha.numero}`;
  	 	 	 	 	 	 	 	 	 	 const config = horarios.find(h => h.id === configId);
  	 	 	 	 	 	 	 	 	 	 const enabled = config ? config.enabled : true;
  	 	 	 	 	 	 	 	 	 	 
  	 	 	 	 	 	 	 	 	 	 return (
  	 	 	 	 	 	 	 	 	 	 	 <div key={configId} className="flex items-center justify-between p-3 bg-white rounded-lg border">
  	 	 	 	 	 	 	 	 	 	 	 	 <span className="font-medium text-gray-900">{hora}</span>
                        	 	 	 	 	 	 <label className="relative inline-flex items-center cursor-pointer">
                          	 	 	 	 	 	 	 <input 
                          	 	 	 	 	 	 	 	 type="checkbox" 
                          	 	 	 	 	 	 	 	 checked={enabled} 
                          	 	 	 	 	 	 	 	 className="sr-only peer" 
                          	 	 	 	 	 	 	 	 onChange={(e) => toggleHorario(hora, cancha.numero, e.target.checked)}
                          	 	 	 	 	 	 	 />
  	 	 	 	 	 	 	 	 	 	 	 	 <div className={`w-11 h-6 bg-gray-200 ${colors.ring} rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${colors.peer}`}></div>
  	 	 	 	 	 	 	 	 	 	 	 	 </label>
  	 	 	 	 	 	 	 	 	 	 	 </div>
  	 	 	 	 	 	 	 	 	 	 );
  	 	 	 	 	 	 	 	 	 })}
  	 	 	 	 	 	 	 	 </div>
  	 	 	 	 	 	 	 </div>
  	 	 	 	 	 	 	 );
  	 	 	 	 	 	 })
  	 	 	 	 	 )}
  	 	 	 	 </div>
  	 	 	 </div>
  	 	 	 
  	 	 	 <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
  	 	 	 	 <button id="close-configurar-btn" onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors" disabled={isSaving}>Cerrar</button>
  	 	 	 	 <button id="save-configuracion-btn" onClick={handleSave} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors flex items-center gap-2" disabled={isSaving}>
  	 	 	 	 	 {isSaving ? (
  	 	 	 	 	 	 <>
  	 	 	 	 	 	 	 <span>Guardando...</span>
  	 	 	 	 	 	 	 <LoadingSpinner />
  	 	 	 	 	 	 </>
  	 	 	 	 	 ) : (
  	 	 	 	 	 	 <span>Guardar Configuración</span>
  	 	 	 	 	 )}
  	 	 	 	 </button>
  	 	 	 </div>
  	 	 </div>
  	 </div>
  );
}

// --- Componente GestionarCanchasModal ---
function GestionarCanchasModal({ onClose, onOpenCanchaModal, onDeleteCancha, canchas }) {
  const getColorForCancha = (canchaId) => {
  	 const colors = [
  	 	 'bg-green-100 text-green-800',
  	 	 'bg-purple-100 text-purple-800',
  	 	 'bg-blue-100 text-blue-800',
  	 	 'bg-orange-100 text-orange-800',
  	 	 'bg-pink-100 text-pink-800',
  	 	 'bg-indigo-100 text-indigo-800',
  	 ];
  	 const canchaIndex = canchas.findIndex((c) => c.id === canchaId);
  	 return colors[canchaIndex % colors.length] || 'bg-gray-100 text-gray-800';
  };
  
  return (
  	 <div id="gestionar-canchas-modal" className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center min-h-screen px-4 fade-in">
  	 	 <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
  	 	 	 <div className="px-6 py-4 border-b border-gray-200">
  	 	 	 	 <h3 className="text-lg font-semibold text-gray-900">Gestionar Canchas</h3>
  	 	 	 	 <p className="text-sm text-gray-600 mt-1">Agrega, edita o elimina las canchas de tu club</p>
  	 	 	 </div>
  	 	 	 
  	 	 	 <div className="px-6 py-4 overflow-y-auto">
  	 	 	 	 <div className="mb-6">
  	 	 	 	 	 <button id="nueva-cancha-btn" onClick={() => onOpenCanchaModal('cancha', null)} className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
  	 	 	 	 	 	 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
  	 	 	 	 	 	 Nueva Cancha
  	 	 	 	 	 </button>
  	 	 	 	 </div>
  	 	 	 	 
  	 	 	 	 <div id="canchas-list" className="space-y-4">
  	 	 	 	 	 {canchas.length === 0 ? (
  	 	 	 	 	 	 <div className="text-center py-8 text-gray-500">
  	 	 	 	 	 	 	 No hay canchas configuradas. ¡Agrega la primera cancha!
  	 	 	 	 	 	 </div>
  	 	 	 	 	 ) : (
  	 	 	 	 	 	 canchas.map(cancha => {
  	 	 	 	 	 	 	 const color = getColorForCancha(cancha.id).replace('text-', 'bg-').replace('-800', '-500');
  	 	 	 	 	 	 	 return (
  	 	 	 	 	 	 	 	 <CanchaCard
  	 	 	 	 	 	 	 	 	 key={cancha.id}
  	 	 	 	 	 	 	 	 	 cancha={cancha}
  	 	 	 	 	 	 	 	 	 color={color}
  	 	 	 	 	 	 	 	 	 onEdit={() => onOpenCanchaModal('cancha', cancha)}
  	 	 	 	 	 	 	 	 	 onDelete={() => onDeleteCancha(cancha)}
  	 	 	 	 	 	 	 	 />
  	 	 	 	 	 	 	 )
  	 	 	 	 	 	 })
  	 	 	 	 	 )}
  	 	 	 	 </div>
  	 	 	 </div>
  	 	 	 
  	 	 	 <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
  	 	 	 	 <button id="close-gestionar-canchas-btn" onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors">Cerrar</button>
  	 	 	 </div>
  	 	 </div>
  	 </div>
  );
}

// --- Componente CanchaCard (usado en GestionarCanchasModal) ---
function CanchaCard({ cancha, color, onEdit, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = () => {
  	 onDelete(); 
  	 setConfirmDelete(false);
  };

  return (
  	 <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
  	 	 <div className="flex items-center gap-4">
  	 	 	 <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center text-white font-bold`}>
  	 	 	 	 {cancha.numero}
  	 	 	 </div>
  	 	 	 <div>
  	 	 	 	 <h4 className="font-semibold text-gray-900">{cancha.nombre}</h4>
  	 	 	 	 <p className="text-sm text-gray-600">{cancha.descripcion}</p>
  	 	 	 </div>
  	 	 </div>
  	 	 <div className="flex items-center gap-2">
  	 	 	 {confirmDelete ? (
  	 	 	 	 <>
  	 	 	 	 	 <button onClick={handleDelete} className="text-red-600 hover:text-red-900 font-medium">¿Confirmar?</button>
  	 	 	 	 	 <button onClick={() => setConfirmDelete(false)} className="text-gray-600 hover:text-gray-900 font-medium">Cancelar</button>
  	 	 	 	 </>
  	 	 	 ) : (
  	 	 	 	 <>
  	 	 	 	 	 <button onClick={onEdit} className="text-blue-600 hover:text-blue-900 font-medium transition-colors">
  	 	 	 	 	 	 Editar
  	 	 	 	 	 </button>
  	 	 	 	 	 <button onClick={() => setConfirmDelete(true)} className="text-red-600 hover:text-red-900 font-medium transition-colors">
  	 	 	 	 	 	 Eliminar
  	 	 	 	 	 </button>
  	 	 	 	 </>
  	 	 	 )}
  	 	 </div>
  	 </div>
  );
}


// --- Componente CanchaModal ---
function CanchaModal({ onClose, onSave, canchaExistente, canchas }) {
  const [formData, setFormData] = useState({
  	 numero: canchaExistente?.numero || (canchas.length > 0 ? Math.max(...canchas.map(c => c.numero)) + 1 : 1),
  	 nombre: canchaExistente?.nombre || '',
  	 descripcion: canchaExistente?.descripcion || '',
  	 id: canchaExistente?.id || null, 
  	 type: 'cancha',
  	 createdAt: canchaExistente?.createdAt || null,
  	 __backendId: canchaExistente?.__backendId || null,
  });
  
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
  	 const { name, value } = e.target;
  	 setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
  	 e.preventDefault();
  	 setIsSaving(true);
  	 await onSave(formData); 
  	 setIsSaving(false);
  };

  return (
  	 <div id="cancha-modal" className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center min-h-screen px-4 fade-in">
  	 	 <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
  	 	 	 <div className="px-6 py-4 border-b border-gray-200">
  	 	 	 	 <h3 id="cancha-modal-title" className="text-lg font-semibold text-gray-900">
Â 	 	 	 	 	 {canchaExistente ? 'Editar Cancha' : 'Nueva Cancha'}
  	 	 	 	 </h3>
  	 	 	 </div>
  	 	 	 <form id="cancha-form" className="px-6 py-4 space-y-4" onSubmit={handleSubmit}>
  	 	 	 	 <div>
  	 	 	 	 	 <label htmlFor="cancha-numero" className="block text-sm font-medium text-gray-700 mb-1">Número de Cancha</label>
  	 	 	 	 	 <input type="number" id="cancha-numero" name="numero" value={formData.numero} onChange={handleChange} min="1" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"/>
  	 	 	 	 </div>
  	 	 	 	 <div>
  	 	 	 	 	 <label htmlFor="cancha-nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Cancha</label>
  	 	 	 	 	 <input type="text" id="cancha-nombre" name="nombre" value={formData.nombre} onChange={handleChange} required placeholder="Ej: Cancha Principal" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"/>
  	 	 	 	 </div>
  	 	 	 	 <div>
  	 	 	 	 	 <label htmlFor="cancha-descripcion" className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
  	 	 	 	 	 <select id="cancha-descripcion" name="descripcion" value={formData.descripcion} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
  	 	 	 	 	 	 <option value="">Seleccionar tipo</option>
  	 	 	 	 	 	 <option value="Techada">Techada</option>
  	 	 	 	 	 	 <option value="Aire libre">Aire libre</option>
  	 	 	 	 	 	 <option value="Semi-techada">Semi-techada</option>
  	 	 	 	 	 	 <option value="Cubierta">Cubierta</option>
  	 	 	 	 	 </select>
  	 	 	 	 </div>
  	 	 	 </form>
  	 	 	 <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
  	 	 	 	 <button id="cancel-cancha-btn" type="button" onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors" disabled={isSaving}>Cancelar</button>
  	 	 	 	 <button id="save-cancha-btn" type="submit" form="cancha-form" className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors flex items-center gap-2" disabled={isSaving}>
  	 	 	 	 	 {isSaving ? (
  	 	 	 	 	 	 <>
  	 	 	 	 	 	 	 <span>Guardando...</span>
  	 	 	 	 	 	 	 <LoadingSpinner />
  	 	 	 	 	 	 </>
  	 	 	 	 	 ) : (
  	 	 	 	 	 	 <span>Guardar</span>
  	 	 	 	 	 )}
  	 	 	 	 </button>
  	 	 	 </div>
  	 	 </div>
  	 </div>
  );
}

// --- Componente CalculadoraModal ---
function CalculadoraModal({ onClose }) {
  const [costoTurno, setCostoTurno] = useState('');
  const [otrosGastos, setOtrosGastos] = useState('');
  const [jugadores, setJugadores] = useState(4);
  const [redondear, setRedondear] = useState(true);

  const parseExpression = (input) => {
  	 if (!input) return 0;
  	 try {
  	 	 if (input.includes('*')) {
  	 	 	 const parts = input.split('*');
  	 	 	 if (parts.length === 2) {
  	 	 	 	 const num1 = parseFloat(parts[0].trim());
  	 	 	 	 const num2 = parseFloat(parts[1].trim());
  	 	 	 	 if (!isNaN(num1) && !isNaN(num2)) return num1 * num2;
  	 	 	 }
  	 	 }
  	 	 const num = parseFloat(input);
  	 	 return isNaN(num) ? 0 : num;
  	 } catch (e) { return 0; }
  };

  const parseMultipleValues = (input) => {
  	 if (!input) return 0;
  	 try {
  	 	 let total = 0;
  	 	 const values = input.split(/[,\s]+/).filter(v => v.trim() !== '');
  	 	 for (const value of values) {
  	 	 	 total += parseExpression(value.trim());
  	 	 }
  	 	 return total;
  	 } catch (e) { return 0; }
  };

  const smartRound = (precio) => {
  	 const hundreds = Math.floor(precio / 100);
  	 const remainder = precio % 100;
  	 if (remainder === 0) return precio;
  	 return (hundreds + 1) * 100;
  };

  const resultado = useMemo(() => {
  	 const totalCostoTurno = parseExpression(costoTurno);
  	 const totalOtrosGastos = parseMultipleValues(otrosGastos);
  	 const total = totalCostoTurno + totalOtrosGastos;
  	 const cantJugadores = parseInt(jugadores) || 1;
  	 
  	 if (total === 0) {
  	 	 return { total: 0, porJugador: 0, detalle: '' };
  	 }
  	 
  	 const precioExacto = total / cantJugadores;
  	 let precioFinal = precioExacto;
  	 let detalle = `<div>$${total.toLocaleString('es-AR')} ÷ ${cantJugadores} jugadores</div>`;

  	 if (redondear) {
  	 	 precioFinal = smartRound(precioExacto);
  	 	 if (precioFinal !== precioExacto) {
  	 	 	 detalle = `
  	 	 	 	 <div class="space-y-1">
  	 	 	 	 	 <div>Precio exacto: $${precioExacto.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
  	 	 	 	 	 <div>Redondeado a: $${precioFinal.toLocaleString('es-AR')}</div>
  	 	 	 	 	 <div class="text-yellow-600">Total recaudado: $${(precioFinal * cantJugadores).toLocaleString('es-AR')}</div>
  	 	 	 	 </div>
  	 	 	 `;
  	 	 }
  	 }
  	 
  	 return {
  	 	 total: total.toLocaleString('es-AR'),
  	 	 porJugador: precioFinal.toLocaleString('es-AR'),
  	 	 detalle: detalle
  	 };

  }, [costoTurno, otrosGastos, jugadores, redondear]);

  const limpiarCalculadora = () => {
  	 setCostoTurno('');
  	 setOtrosGastos('');
  	 setJugadores(4);
  	 setRedondear(true);
  };

  return (
  	 <div id="calculadora-modal" className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center min-h-screen px-4 fade-in">
  	 	 <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
  	 	 	 <div className="px-6 py-4 border-b border-gray-200">
  	 	 	 	 <h3 className="text-lg font-semibold text-gray-900">Calculadora de Gastos</h3>
  	 	 	 	 <p className="text-sm text-gray-600 mt-1">Calcula cuánto debe pagar cada jugador</p>
  	 	 	 </div>
  	 	 	 <div className="px-6 py-4 space-y-4">
  	 	 	 	 {/* Gastos */}
  	 	 	 	 <div>
  	 	 	 	 	 <label className="block text-sm font-medium text-gray-700 mb-2">Gastos del Turno</label>
  	 	 	 	 	 <div className="space-y-3">
  	 	 	 	 	 	 <div>
  	 	 	 	 	 	 	 <label htmlFor="costo-turno" className="block text-xs text-gray-600 mb-1">Costo del turno (ej: 17000*2)</label>
  	 	 	 	 	 	 	 <input type="text" id="costo-turno" value={costoTurno} onChange={e => setCostoTurno(e.target.value)} placeholder="17000*2 o solo 17000" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"/>
  	 	 	 	 	 	 </div>
  	 	 	 	 	 	 <div>
  	 	 	 	 	 	 	 <label htmlFor="otros-gastos" className="block text-xs text-gray-600 mb-1">Otros gastos (ej: 3000*4, 2000 5000)</label>
  	 	   	 	 	 	 <input type="text" id="otros-gastos" value={otrosGastos} onChange={e => setOtrosGastos(e.target.value)} placeholder="3000*4 o 2000 5000 2400" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"/>
  	 	 	 	 	 	 </div>
  	 	 	 	 	 </div>
  	 	 	 	 </div>
  	 	 	 	 {/* Total */}
  	 	 	 	 <div className="bg-gray-50 rounded-lg p-3">
  	 	 	 	 	 <div className="flex justify-between items-center">
  	 	 	 	 	 	 <span className="font-medium text-gray-700">Total:</span>
  	 	 	 	 	 	 <span id="total-gastos" className="text-lg font-bold text-gray-900">${resultado.total}</span>
  	 	 	 	 	 </div>
  	 	 	 	 </div>
  	 	 	 	 {/* Jugadores */}
  	 	 	 	 <div>
  	 	 	 	 	 <label htmlFor="cantidad-jugadores" className="block text-sm font-medium text-gray-700 mb-1">Cantidad de jugadores</label>
  	 	 	 	 	 <input type="number" id="cantidad-jugadores" value={jugadores} onChange={e => setJugadores(e.target.value)} placeholder="4" min="1" max="20" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"/>
  	 	 	 	 </div>
  	 	 	 	 {/* Redondeo */}
  	 	 	 	 <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
  	 	 	 	 	 <div>
  	 	 	 	 	 	 <span className="font-medium text-gray-700">Redondear precios</span>
  	 	 	 	 	 	 <p className="text-xs text-gray-600">Redondea a centenas más cercanas</p>
  	 	 	 	 	 </div>
  	 	 	 	 	 <label className="relative inline-flex items-center cursor-pointer">
  	 	 	 	 	 	 <input type="checkbox" id="redondeo-toggle" checked={redondear} onChange={e => setRedondear(e.target.checked)} className="sr-only peer"/>
  	 	 	 	 	 	 <div className="w-11 h-6 bg-gray-200 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
  	 	 	 	 	 </label>
  	 	 	 	 </div>
  	 	 	 	 {/* Resultado */}
  	 	 	 	 <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
  	 	 	 	 	 <div className="text-center">
  	 	 	 	 	 	 <p className="text-sm text-gray-600 mb-1">Cada jugador debe pagar:</p>
  	 	 	 	 	 	 <p id="precio-por-jugador" className="text-2xl font-bold text-yellow-700">${resultado.porJugador}</p>
D 	 	 	 	 	 	 <div id="detalle-calculo" className="mt-2 text-xs text-gray-500" dangerouslySetInnerHTML={{ __html: resultado.detalle }}></div>
  	 	 	 	 	 </div>
  	 	 	 	 </div>
  	 	 	 	 <button id="limpiar-calculadora-btn" onClick={limpiarCalculadora} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-md transition-colors font-medium">Limpiar Todo</button>
  	 	 	 </div>
  	 	 	 <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
  	 	 	 	 <button id="close-calculadora-btn" onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors">Cerrar</button>
  	 	 	 </div>
  	 	 </div>
  	 </div>
  );
}


// --- Exportar el componente principal ---
export default DashboardPage;