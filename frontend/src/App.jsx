import React from "react";
import barraNavegacion from "./components/barraNavegacion/barraNavegacion";
import Home from "./pages/Home/Home";

import { Routes, Route, useLocation } from "react-router-dom";

function App() {
  // const { pathname } = useLocation();

// hacer codigo de reserva con id del turno
// hacer login para ingresar a la dashboard de gestion
// maquetar un cobro o pago parcial del turno

  return (
    <div>
      {/* {pathname !== "/" && <DashboardNav />} */}
      {/* {pathname !== "/" && <barraNavegacion />} */}
      {/* {pathname === "/dashboard" && <Pacientes />} */}

      <Routes>
        <Route path="/" element={<Home />} />
       
      </Routes>
    </div>
  );
}

export default App;
