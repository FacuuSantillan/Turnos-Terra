import React from "react";
import axios from "axios";
import Home from "./pages/Home/Home";
import Dashboard from "./pages/dashboard/dashboard";
import Login from "./components/login/login";

import { Routes, Route, useLocation } from "react-router-dom";

axios.defaults.baseURL = 'https://turnos-terra.onrender.com'
// axios.defaults.baseURL = 'http://localhost:3001'



function App() {

  return (
    <div>
      {/* {pathname !== "/" && <DashboardNav />} */}
      {/* {pathname !== "/" && <barraNavegacion />} */}
      {/* {pathname === "/dashboard" && <Pacientes />} */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/091a26afbfcaba13f5ac05e6e697d0b58b25bc5ba5ffb931752739a653fc8bef" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
