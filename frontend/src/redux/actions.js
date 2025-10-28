import axios from 'axios';

export const GET_HORARIOS = 'GET_HORARIOS'; 
export const GET_TURNOS = 'GET_TURNOS'

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