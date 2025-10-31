import axios from 'axios';

export const GET_HORARIOS = 'GET_HORARIOS'; 
export const GET_TURNOS = 'GET_TURNOS'
export const PUT_ESTADO_HORARIO = 'PUT_ESTADO_HORARIO'

export const getHorarios = () => {
  return async (dispatch) => {
    
    const response = await axios.get(`/`); 
    
    return dispatch({
        type: GET_HORARIOS, 
        payload: response.data
    });
  };
};

export const getTurnos = () => {
  return async (dispatch) => {
    
    const response = await axios.get(`/getTurnos`); 
    
    return dispatch({
        type: GET_TURNOS, 
        payload: response.data
    });
  };
};

export const updateHorarioActivo = (id, nuevoEstado) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(`/modificarHora/${id}`, nuevoEstado);
      const horarioActualizado = response.data;

      dispatch({
        type: PUT_ESTADO_HORARIO,
        payload: horarioActualizado 
      });

    } catch (error) {
      console.error("Error al actualizar el horario:", error);
    }
  };
};