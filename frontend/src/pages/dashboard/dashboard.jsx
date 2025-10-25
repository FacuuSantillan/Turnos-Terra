import React, { useState } from "react";
import Header from "./components/header/header";
import Toast from "./components/header/toastContainer/toast";
import EstadisticasCanchas from "./components/estadisticasCanchas/estadisticasCanchas";

const Dashboard = () => {
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
    <div className="w-[102%]">
      {toastInfo && <Toast message={toastInfo.message} type={toastInfo.type} />}

      <Header />
      <EstadisticasCanchas />

    </div>
  );
}

export default Dashboard;