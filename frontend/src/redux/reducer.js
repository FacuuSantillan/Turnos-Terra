//---------------------importacion de los types--------------------------------//
import {
  GET_HORARIOS,
  GET_TURNOS,
  PUT_ESTADO_HORARIO
} from "./actions";

//---------------------Estados iniciales--------------------------------//
const initialState = {
  horarios: [],
  horariosCopy: [], 
  
  turnos:[],
  turnosCopy:[]
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

    default:
      return state;
  }
};
 
export default reducer;