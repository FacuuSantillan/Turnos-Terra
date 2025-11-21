import React, { useState } from "react";
import style from "./barraNavegacion.module.css";
import fondoNavBar from "../../assets/imagenFondo.jpg";
import Logo from "../../assets/ChatGPT Image Aug 27, 2025, 04_54_05 PM.png";
import { Routes, Route, useLocation } from "react-router-dom";

function BarraNavegacion() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <nav id="inicio" className={style.navbar}>
      <div className={style.overlay}></div>
      <img src={fondoNavBar} alt="Fondo NavBar" className={style.fondo} />

      <div className={style.contenido}>
        <h1 className={style.logo}>
          <img src={Logo} alt="Logo" className={style.imagenLogo} />
        </h1>

        <button 
          className={style.botonHamburguesa}
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          ☰
        </button>

        <ul className={`${style.menu} ${menuAbierto ? style.menuActivo : ""}`}>

          <li>
  <a
    href="/login"
    onClick={() => setMenuAbierto(false)}
  >
    Login
  </a>
</li>
    
          <li>
  <a
    href="#inicio"
    onClick={(e) => {
      e.preventDefault();
      document.getElementById("inicio")?.scrollIntoView({ behavior: "smooth" });
      setMenuAbierto(false);
    }}
  >
    Días y Horarios
  </a>
</li>

<li>
  <a
    href="#formulario"
    onClick={(e) => {
      e.preventDefault();
      document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" });
      setMenuAbierto(false);
    }}
  >
    Datos del turno
  </a>
</li>

<li>
  <a
    href="#ubicacion"
    onClick={(e) => {
      e.preventDefault();
      document.getElementById("ubicacion")?.scrollIntoView({ behavior: "smooth" });
      setMenuAbierto(false);
    }}
  >
    Ubicación
  </a>
</li>

        </ul>
      </div>
    </nav>
  );
}

export default BarraNavegacion;
