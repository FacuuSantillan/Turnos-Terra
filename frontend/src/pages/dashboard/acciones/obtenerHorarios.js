import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, connect, useDispatch } from 'react-redux';
import { getHorarios } from '../../../redux/actions';

const obtenerHorarios = async () => {
    const dispatch = useDispatch();
    
      useEffect(() => {
        dispatch(getHorarios());
      }, [dispatch]); 
      
      let horarios = useSelector((state) => state.horariosCopy);
      
      console.log("Horarios actuales:", horarios);

}

export default obtenerHorarios;