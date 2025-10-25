import axios from 'axios';

export const GET_HORARIOS = 'GET_HORARIOS'; 

export const getHorarios = () => {
  return async (dispatch) => {
    
    const response = await axios.get(`/`); 
    
    return dispatch({
        type: GET_HORARIOS, 
        payload: response.data
    });
  };
};