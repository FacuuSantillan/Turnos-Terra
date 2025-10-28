import React, { useState } from "react";
import Header from "./components/header/header";
import Toast from "./components/header/toastContainer/toast";
import EstadisticasCanchas from "./components/estadisticasCanchas/estadisticasCanchas";
import ActionBar from "./components/actionBar/actionBar"
import NuevoTurnoModal from "./components/actionBar/nuevoTurnoModal";
// Asegúrate de que este nombre coincida con tu importación anterior
import VerDisponibilidadModal from "./components/actionBar/verDisponibilidad"; 

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDisponibilidadOpen, setIsDisponibilidadOpen] = useState(false);
  const [toastInfo, setToastInfo] = useState(null); 

  const showSuccessToast = () => {
    setToastInfo({ message: "¡Operación exitosa!", type: "success" });
    setTimeout(() => setToastInfo(null), 3000);
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
      />

      <NuevoTurnoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <VerDisponibilidadModal isOpen={isDisponibilidadOpen} onClose={() => setIsDisponibilidadOpen(false)} />

    </div>
  );
}

export default Dashboard;