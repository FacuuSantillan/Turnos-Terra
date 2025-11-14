import React, { useState } from "react";
import Header from "./components/header/header";
import Toast from "./components/header/toastContainer/toast";

import EstadisticasCanchas from "./components/estadisticasCanchas/estadisticasCanchas";

import ActionBar from "./components/actionBar/actionBar"
import NuevoTurnoModal from "./components/actionBar/nuevoTurnoModal";
import VerDisponibilidadModal from "./components/actionBar/verDisponibilidad";
import ConfigurarHorariosModal from "./components/actionBar/ConfigurarHorariosModal";
import CalculadoraGastosModal from "./components/actionBar/calculadoraGastosModal";
import TurnosFijosModal from "./components/actionBar/TurnosFijosModal";

import FiltroTurnos from "./components/filtros/Filtros";

import TurnosTable from "./components/cards/TurnosTable";
import TurnoDetalleModal from "./components/cards/TurnoDetalleModal";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDisponibilidadOpen, setIsDisponibilidadOpen] = useState(false);
  const [isConfigurarHorariosOpen, setIsConfigurarHorariosOpen] = useState(false)
  const [isCalculadoraOpen, setIsCalculadoraOpen] = useState(false)
  const [toastInfo, setToastInfo] = useState(null); 
  const [selectedTurno, setSelectedTurno] = useState(null);
  const [isDetalleModalOpen, setIsDetalleModalOpen] = useState(false);
  const [isTurnosFijosOpen, setIsTurnosFijosOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const sesionActiva = sessionStorage.getItem('091a26afbfcaba13f5ac05e6e697d0b58b25bc5ba5ffb931752739a653fc8bef'); 

    if (!sesionActiva) {
      navigate('/');
    }
  }, [navigate]);

  const showSuccessToast = () => {
    setToastInfo({ message: "¡Operación exitosa!", type: "success" });
    setTimeout(() => setToastInfo(null), 3000);
  };

  const handleTurnoClick = (turno) => {
    setSelectedTurno(turno);
    setIsDetalleModalOpen(true);
  };

  const showErrorToast = () => {
    setToastInfo({ message: "Hubo un error.", type: "error" });
    setTimeout(() => setToastInfo(null), 3000);
  };

  return (
    <div className="relative top-[-3vh] w-[102%]">
      {toastInfo && <Toast message={toastInfo.message} type={toastInfo.type} />}

      <Header />
      <EstadisticasCanchas />
      <ActionBar 
        onNuevoTurnoClick={() => setIsModalOpen(true)} 
        onVerDisponibilidadClick={() => setIsDisponibilidadOpen(true)} 
        onConfigurarClick={() => setIsConfigurarHorariosOpen(true)}
        onCalculadoraClick={() => setIsCalculadoraOpen(true)}
        onTurnosFijosClick={() => setIsTurnosFijosOpen(true)}
      />

      <NuevoTurnoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <VerDisponibilidadModal isOpen={isDisponibilidadOpen} onClose={() => setIsDisponibilidadOpen(false)} />
      <ConfigurarHorariosModal isOpen={isConfigurarHorariosOpen} onClose={() => setIsConfigurarHorariosOpen(false)} />
      <CalculadoraGastosModal isOpen={isCalculadoraOpen} onClose={() => setIsCalculadoraOpen(false)} />
      <TurnoDetalleModal isOpen={isDetalleModalOpen} onClose={() => setIsDetalleModalOpen(false)} turno={selectedTurno} />
      <TurnosFijosModal isOpen={isTurnosFijosOpen} onClose={() => setIsTurnosFijosOpen(false)} />
        
      <div className="px-6 py-4">
        <FiltroTurnos />
        <TurnosTable onTurnoClick={handleTurnoClick} />
      </div>

    </div>
  );
}

export default Dashboard;