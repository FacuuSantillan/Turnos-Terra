import axios from 'axios';

export const GET_HORARIOS = 'GET_HORARIOS'; 
export const GET_TURNOS = 'GET_TURNOS'
export const PUT_ESTADO_HORARIO = 'PUT_ESTADO_HORARIO'
export const POST_TURNO = 'POST_TURNO'
export const POST_TURNO_ERROR = 'POST_TURNO_ERROR'
export const DELETE_TURNO = "DELETE_TURNO";
export const DELETE_TURNO_ERROR = "DELETE_TURNO_ERROR";

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

export const postTurno = (turnoData) => {
  return async (dispatch) => {
    try {
      const response = await axios.post('/crearTurno', turnoData);
      const nuevoTurno = response.data;

      dispatch({
        type: POST_TURNO,
        payload: nuevoTurno
      });

      return { success: true, data: nuevoTurno }; 
      
    } catch (error) {
      const errorData = error.response?.data || { error: "Error de red" };
      console.error("Error al crear el turno:", errorData);

      dispatch({
        type: POST_TURNO_ERROR,
        payload: errorData 
      });

      return { success: false, error: errorData };
    }
  };
};

export const deleteTurno = (id) => {
  return async (dispatch) => {
    try {
      await axios.delete(`/eliminarTurno/${id}`);
      
      dispatch({
        type: DELETE_TURNO,
        payload: id 
      });
      return { success: true };

    } catch (error) {
      console.error("Error al eliminar el turno:", error.response?.data);
      dispatch({
        type: DELETE_TURNO_ERROR,
        payload: error.response?.data
      });
      return { success: false, error: error.response?.data };
    }
  };
};