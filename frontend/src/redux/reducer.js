//---------------------importacion de los types--------------------------------//
import {
  GET_HORARIOS
} from "./actions";

//---------------------Estados iniciales--------------------------------//
const initialState = {
  horarios: [],
  horariosCopy: [], 
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

    default:
      return state;
  }
};

export default reducer;