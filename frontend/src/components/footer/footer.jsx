import React from "react";
import style from "./Footer.module.css";
import logo from "../../assets/ChatGPT Image Aug 27, 2025, 04_54_05 PM.png"; 

function Footer() {
  return (
    <footer className={style.footer}>
      <div className={style.logoContainer}>
        <img src={logo} alt="Logo del club" className={style.logo} />
      </div>

            <nav className={style.nav}>
        <a href="#inicio" className={style.link}>Inicio</a>
        <a href="#datos" className={style.link}>Datos</a>
        <a href="#ubicacion" className={style.link}>Ubicación</a>
        <a href="#ubicacion" className={style.link}>Contacto</a>
      </nav>

      <p className={style.text}>
        © {new Date().getFullYear()} Club Terra Padel Concepcion - Todos los derechos reservados.
      </p>
    </footer>
  );
}

export default Footer;
