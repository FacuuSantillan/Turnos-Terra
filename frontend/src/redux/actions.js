import axios from 'axios';

export const GET_HORARIOS = 'GET_HORARIOS'; 
export const GET_TURNOS = 'GET_TURNOS'
export const PUT_ESTADO_HORARIO = 'PUT_ESTADO_HORARIO'
export const UPDATE_DATOS_TURNO = 'UPDATE_DATOS_TURNO'
export const UPDATE_DATOS_TURNO_ERROR = 'UPDATE_DATOS_TURNO_ERROR'
export const POST_TURNO = 'POST_TURNO'
export const POST_TURNO_ERROR = 'POST_TURNO_ERROR'
export const DELETE_TURNO = "DELETE_TURNO";
export const DELETE_TURNO_ERROR = "DELETE_TURNO_ERROR";

export const GET_TURNOS_FIJOS = "GET_TURNOS_FIJOS";
export const GET_TURNOS_FIJOS_LIBERADOS = "GET_TURNOS_FIJOS_LIBERADOS";
export const POST_TURNO_FIJO_LIBERADO = "POST_TURNO_FIJO_LIBERADO";
export const POST_TURNO_FIJO_LIBERADO_ERROR = "POST_TURNO_FIJO_LIBERADO_ERROR";
export const POST_TURNO_FIJO = "POST_TURNO_FIJO";
export const POST_TURNO_FIJO_ERROR = "POST_TURNO_FIJO_ERROR";
export const UPDATE_TURNO_FIJO = "UPDATE_TURNO_FIJO";
export const UPDATE_TURNO_FIJO_ERROR = "UPDATE_TURNO_FIJO_ERROR";
export const DELETE_TURNO_FIJO = "DELETE_TURNO_FIJO";
export const DELETE_TURNO_FIJO_ERROR = "DELETE_TURNO_FIJO_ERROR";

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

export const updateTurno = (id, turnoData) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(`/modificarTurno/${id}`, turnoData);
      const turnoActualizado = response.data;
      dispatch({
        type: UPDATE_DATOS_TURNO,
        payload: turnoActualizado
      });
      return { success: true, data: turnoActualizado };
    } catch (error) {
      const errorData = error.response?.data || { error: "Error de red" };
      console.error("Error al modificar turno fijo:", errorData);
      dispatch({ type: UPDATE_DATOS_TURNO_ERROR, payload: errorData });
      return { success: false, error: errorData };
    }
  };
};

export const getTurnosFijos = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get('/turnos-fijos'); 
      return dispatch({ type: GET_TURNOS_FIJOS, payload: response.data });
    } catch (error) {
      console.error("Error al obtener turnos fijos:", error.response?.data);
    }
  };
};

export const getTurnosFijosLiberados = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get('/turnos-fijos/liberados'); 
      return dispatch({ type: GET_TURNOS_FIJOS_LIBERADOS, payload: response.data });
    } catch (error) {
      console.error("Error al obtener turnos fijos liberados:", error.response?.data);
    }
  };
};

export const liberarTurnoFijo = (liberacionData) => {
  return async (dispatch) => {
    try {
      const response = await axios.post('/turnos-fijos/liberar', liberacionData);
      dispatch({ type: POST_TURNO_FIJO_LIBERADO, payload: response.data });
      return { success: true, data: response.data };
    } catch (error) {
      const errorData = error.response?.data || { error: "Error de red" };
      dispatch({ type: POST_TURNO_FIJO_LIBERADO_ERROR, payload: errorData });
      return { success: false, error: errorData };
    }
  };
};

export const createTurnoFijo = (turnoFijoData) => {
  return async (dispatch) => {
    try {
      const response = await axios.post('/turnos-fijos/crear', turnoFijoData);
      const nuevoTurnoFijo = response.data;

      dispatch({
        type: POST_TURNO_FIJO,
        payload: nuevoTurnoFijo
      });
      return { success: true, data: nuevoTurnoFijo };

    } catch (error) {
      const errorData = error.response?.data || { error: "Error de red" };
      dispatch({
        type: POST_TURNO_FIJO_ERROR,
        payload: errorData
      });
      return { success: false, error: errorData };
    }
  };
};



export const updateTurnoFijo = (id, turnoFijoData) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(`/turnos-fijos/modificar/${id}`, turnoFijoData);
      const turnoActualizado = response.data;
      dispatch({
        type: UPDATE_TURNO_FIJO,
        payload: turnoActualizado
      });
      return { success: true, data: turnoActualizado };
    } catch (error) {
      const errorData = error.response?.data || { error: "Error de red" };
      console.error("Error al modificar turno fijo:", errorData);
      dispatch({ type: UPDATE_TURNO_FIJO_ERROR, payload: errorData });
      return { success: false, error: errorData };
    }
  };
};

export const deleteTurnoFijo = (id) => {
  return async (dispatch) => {
    try {
      await axios.delete(`/turnos-fijos/${id}`);
      dispatch({
        type: DELETE_TURNO_FIJO,
        payload: id 
      });
      return { success: true };
    } catch (error) {
      const errorData = error.response?.data || { error: "Error de red" };
      console.error("Error al eliminar turno fijo:", errorData);
      dispatch({ type: DELETE_TURNO_FIJO_ERROR, payload: errorData });
      return { success: false, error: errorData };
    }
  };
};