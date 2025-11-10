//---------------------importacion de los types--------------------------------//
import {
  GET_HORARIOS,
  GET_TURNOS,
  PUT_ESTADO_HORARIO,
  POST_TURNO,
  POST_TURNO_ERROR,
  DELETE_TURNO,
  DELETE_TURNO_ERROR,
  GET_TURNOS_FIJOS,
  GET_TURNOS_FIJOS_LIBERADOS,
  POST_TURNO_FIJO_LIBERADO,
  POST_TURNO_FIJO_LIBERADO_ERROR,
  POST_TURNO_FIJO,
  POST_TURNO_FIJO_ERROR,
  DELETE_TURNO_FIJO, // --- AÑADIDO ---
  DELETE_TURNO_FIJO_ERROR, // --- AÑADIDO ---
  GET_TURNO_ID,
  FILTER_TURNOS,
} from "./actions";

//---------------------Estados iniciales--------------------------------//
const initialState = {
  horarios: [],
  horariosCopy: [], 
  
  turnos:[],
  turnosCopy:[],

  turnosFijos:[],
  turnosFijosCopy: [], // <-- AÑADIDO: Copia maestra para filtros
  turnosFijosLiberados: [],

  turnoDetail: {}
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_HORARIOS:
      if (!action.payload || action.payload.length === 0) {
        return {
          ...state,
          horarios: [],
          horariosCopy: [],
        };
      }
      return {
        ...state,
        horarios: action.payload,
        horariosCopy: [...action.payload], 
      };
      
    case GET_TURNO_ID:
      return {
        ...state,
        turnoDetail: action.payload,
      };

    case GET_TURNOS:
      if (!action.payload || action.payload.length === 0) {
        return {
          ...state,
          turnos: [],
          turnosCopy: []
        };
      }
      return {
        ...state,
        turnos: action.payload,
        turnosCopy: [...action.payload], 
      };

    // --- LÓGICA DE FILTRADO MODIFICADA ---
    case FILTER_TURNOS: {
      const { cancha, fecha, horario, cliente } = action.payload;
      
      // --- 1. Filtrar Turnos Regulares ---
      let turnosRegularesFiltrados = [...state.turnosCopy];

      if (cancha) {
        turnosRegularesFiltrados = turnosRegularesFiltrados.filter(
          (t) => t.cancha_id === Number(cancha)
        );
      }
      if (fecha) {
        turnosRegularesFiltrados = turnosRegularesFiltrados.filter((t) => t.fecha === fecha);
      }
      if (horario) {
        turnosRegularesFiltrados = turnosRegularesFiltrados.filter((t) => t.hora_inicio === horario);
      }
      if (cliente) {
        const clienteLower = cliente.toLowerCase();
        turnosRegularesFiltrados = turnosRegularesFiltrados.filter((t) => 
          t.Usuario && 
          (t.Usuario.nombre.toLowerCase().includes(clienteLower) ||
           t.Usuario.apellido.toLowerCase().includes(clienteLower))
        );
      }

      // --- 2. Filtrar Turnos Fijos (¡NUEVO!) ---
      let turnosFijosFiltrados = [...state.turnosFijosCopy];

      if (cancha) {
        turnosFijosFiltrados = turnosFijosFiltrados.filter(
          (tf) => tf.cancha_id === Number(cancha)
        );
      }
      
      // Conversión de fecha a día de la semana
      if (fecha) {
        // Usamos T12:00:00 para evitar problemas de zona horaria con new Date()
        const safeDate = new Date(`${fecha}T12:00:00`);
        const jsDay = safeDate.getDay(); // 0=Domingo, 1=Lunes, ...
        const diaSemanaApp = (jsDay === 0) ? 7 : jsDay; // 1=Lunes, ..., 7=Domingo
        
        turnosFijosFiltrados = turnosFijosFiltrados.filter(
          (tf) => tf.dia_semana === diaSemanaApp
        );
      }
      
      if (horario) {
        // Asumimos que tf.hora_inicio existe, si no, habría que iterar el array de Horarios
        turnosFijosFiltrados = turnosFijosFiltrados.filter((tf) => tf.hora_inicio === horario);
      }
      
      if (cliente) {
        const clienteLower = cliente.toLowerCase();
        turnosFijosFiltrados = turnosFijosFiltrados.filter((tf) => 
          tf.Usuario && 
          (tf.Usuario.nombre.toLowerCase().includes(clienteLower) ||
           tf.Usuario.apellido.toLowerCase().includes(clienteLower))
        );
      }

      // --- 3. Devolver estado ---
      return {
        ...state,
        turnos: turnosRegularesFiltrados,
        turnosFijos: turnosFijosFiltrados, // <-- Actualizamos la lista filtrada de fijos
      };
    }

    case PUT_ESTADO_HORARIO: {
      if (!action.payload || !action.payload.id) {
        return state;
      }
      const horariosActualizados = state.horarios.map(horario => {
        if (horario.id === action.payload.id) {
          return action.payload; 
        }
        return horario;
      });
      return {
        ...state,
        horarios: horariosActualizados,
        horariosCopy: [...horariosActualizados]
      };
    }

    // --- LÓGICA DE POST/DELETE MEJORADA ---
    case POST_TURNO: {
      // Añade a AMBAS listas (la visible y la copia maestra)
      const nuevosTurnos = [action.payload, ...state.turnos];
      const nuevosTurnosCopy = [action.payload, ...state.turnosCopy];
      return {
        ...state,
        turnos: nuevosTurnos,
        turnosCopy: nuevosTurnosCopy 
      };
    }
    
    case DELETE_TURNO: {
      // Elimina de AMBAS listas
      const turnosFiltrados = state.turnos.filter(
        (t) => t.id !== action.payload
      );
      const turnosCopyFiltrados = state.turnosCopy.filter(
        (t) => t.id !== action.payload
      );
      return {
        ...state,
        turnos: turnosFiltrados,
        turnosCopy: turnosCopyFiltrados,
      };
    }

    // --- LÓGICA DE TURNOS FIJOS MODIFICADA ---
    case GET_TURNOS_FIJOS:
      return {
        ...state,
        turnosFijos: action.payload,
        turnosFijosCopy: action.payload // <-- AÑADIDO
      };

    case GET_TURNOS_FIJOS_LIBERADOS:
      return {
        ...state,
        turnosFijosLiberados: action.payload
      };

    case POST_TURNO_FIJO: {
      // Añade a AMBAS listas
      const nuevosFijos = [...state.turnosFijos, action.payload];
      const nuevosFijosCopy = [...state.turnosFijosCopy, action.payload];
      return {
        ...state,
        turnosFijos: nuevosFijos,
        turnosFijosCopy: nuevosFijosCopy,
      };
    }

    case DELETE_TURNO_FIJO: {
      // Elimina de AMBAS listas
      const fijosFiltrados = state.turnosFijos.filter(
        (tf) => tf.id !== action.payload
      );
      const fijosCopyFiltrados = state.turnosFijosCopy.filter(
        (tf) => tf.id !== action.payload
      );
      return {
        ...state,
        turnosFijos: fijosFiltrados,
        turnosFijosCopy: fijosCopyFiltrados,
      };
    }

    case POST_TURNO_FIJO_LIBERADO:
      return {
        ...state,
        turnosFijosLiberados: [...state.turnosFijosLiberados, action.payload]
      };

    // --- Cases de Error ---
    case POST_TURNO_ERROR:
    case DELETE_TURNO_ERROR:
    case DELETE_TURNO_FIJO_ERROR:
    case POST_TURNO_FIJO_LIBERADO_ERROR:
    case POST_TURNO_FIJO_ERROR:
      console.error("Error en Reducer:", action.type, action.payload);
      return state; 

    default:
      return state;
  }
};

export default reducer;