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
  POST_TURNO_FIJO_ERROR
} from "./actions";

//---------------------Estados iniciales--------------------------------//
const initialState = {
  horarios: [],
  horariosCopy: [], 
  
  turnos:[],
  turnosCopy:[],

  turnosFijos:[],
  turnosFijosLiberados: []
};

function reducer(state = initialState, action) {
  switch (action.type) {
      case GET_HORARIOS:
        if (!action.payload || action.payload.length === 0) {
          return {
            ...state,
            horarios: ['No hay horarios disponibles'],
          };
        }
        return {
          ...state,
          horarios: action.payload,
          horariosCopy: [...action.payload], 
        };

        case GET_TURNOS:
        if (!action.payload || action.payload.length === 0) {
          return {
            ...state,
            horarios: ['No hay turnos disponibles'],
          };
        }
        return {
          ...state,
          turnos: action.payload,
          turnosCopy: [...action.payload], 
        };

      case PUT_ESTADO_HORARIO:
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
      case POST_TURNO:
      const nuevosTurnos = [action.payload, ...state.turnos];
      
      return {
        ...state,
        turnos: nuevosTurnos,
        turnosCopy: nuevosTurnos 
      };

    case POST_TURNO_ERROR:
      console.error("ERROR EN REDUCER (POST_TURNO_ERROR):", action.payload);
      return {
        ...state 
      };

    case DELETE_TURNO:
      const turnosFiltrados = state.turnos.filter(
        (t) => t.id !== action.payload
      );
      return {
        ...state,
        turnos: turnosFiltrados,
        turnosCopy: turnosFiltrados,
      };

    case DELETE_TURNO_ERROR:
      console.error("REDUCER: Error en DELETE_TURNO:", action.payload);
      return state; 

        case GET_TURNOS_FIJOS:
        return {
          ...state,
          turnosFijos: action.payload
        };

      case GET_TURNOS_FIJOS_LIBERADOS:
        return {
          ...state,
          turnosFijosLiberados: action.payload
        };

      case POST_TURNO_FIJO:
      	return {
      	  ...state,
      	  turnosFijos: [...state.turnosFijos, action.payload]
      	};

      case POST_TURNO_FIJO_LIBERADO:
      	return {
      	  ...state,
      	  turnosFijosLiberados: [...state.turnosFijosLiberados, action.payload]
      	};

      case POST_TURNO_ERROR:
      case DELETE_TURNO_ERROR:
      case POST_TURNO_FIJO_LIBERADO_ERROR:
      case POST_TURNO_FIJO_ERROR:
      	console.error("Error en Reducer:", action.type, action.payload);
      	return state; // No cambia el estado

  	default:
  	  return state;
  }
};

 
export default reducer;