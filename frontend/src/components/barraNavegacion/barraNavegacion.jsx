import React, { useState } from "react";
import style from "./barraNavegacion.module.css";
import fondoNavBar from "../../assets/imagenFondo.jpg";
import Logo from "../../assets/ChatGPT Image Aug 27, 2025, 04_54_05 PM.png";
import { Routes, Route, useLocation } from "react-router-dom";

function BarraNavegacion() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <nav className={style.navbar}>
      <div className={style.overlay}></div>
      <img src={fondoNavBar} alt="Fondo NavBar" className={style.fondo} />

      <div className={style.contenido}>
        <h1 className={style.logo}>
          <img src={Logo} alt="Logo" className={style.imagenLogo} />
        </h1>

        {/* Botón hamburguesa */}
        <button 
          className={style.botonHamburguesa}
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          ☰
        </button>

        {/* Menú lateral */}
        <ul className={`${style.menu} ${menuAbierto ? style.menuActivo : ""}`}>
    
          <li><a href="/admin" onClick={() => setMenuAbierto(false)}>Dias y Horarios</a></li>
          <li><a href="#servicios" onClick={() => setMenuAbierto(false)}>Datos del turno</a></li>
          <li><a href="#proyectos" onClick={() => setMenuAbierto(false)}>Ubicación</a></li>
          <li><a href="#contacto" onClick={() => setMenuAbierto(false)}>Contacto</a></li>
        </ul>
      </div>
    </nav>
  );
}

export default BarraNavegacion;
