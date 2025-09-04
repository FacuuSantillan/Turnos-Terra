import React from "react";
import barraNavegacion from "./components/barraNavegacion/barraNavegacion";
import Home from "./pages/Home/Home";

import { Routes, Route, useLocation } from "react-router-dom";

function App() {
  // const { pathname } = useLocation();

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
