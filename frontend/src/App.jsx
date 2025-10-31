import React from "react";
import axios from "axios";
import Home from "./pages/Home/Home";
import Dashboard from "./pages/dashboard/dashboard";

import { Routes, Route, useLocation } from "react-router-dom";

axios.defaults.baseURL = 'http://localhost:3001/'


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
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
