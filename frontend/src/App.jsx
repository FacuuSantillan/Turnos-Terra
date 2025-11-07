import React from "react";
import axios from "axios";
import Home from "./pages/Home/Home";
import Dashboard from "./pages/dashboard/dashboard";

import { Routes, Route, useLocation } from "react-router-dom";

// axios.defaults.baseURL = 'https://turnos-terra.onrender.com'
axios.defaults.baseURL = 'http://localhost:3001'



function App() {

  return (
    <div>
      {/* {pathname !== "/" && <DashboardNav />} */}
      {/* {pathname !== "/" && <barraNavegacion />} */}
      {/* {pathname === "/dashboard" && <Pacientes />} */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
