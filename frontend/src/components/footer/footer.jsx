import React from "react";
import style from "./footer.module.css";
import logo from "../../assets/ChatGPT Image Aug 27, 2025, 04_54_05 PM.png";

function Footer() {

  const scrollTo = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className={style.footer}>
      <div className={style.logoContainer}>
        <img src={logo} alt="Logo del club" className={style.logo} />
      </div>

      <nav className={style.nav}>
        <a
          href="#inicio"
          className={style.link}
          onClick={(e) => {
            e.preventDefault();
            scrollTo("inicio");
          }}
        >
          Inicio
        </a>

        <a
          href="#formulario"
          className={style.link}
          onClick={(e) => {
            e.preventDefault();
            scrollTo("formulario");
          }}
        >
          Datos del turno
        </a>

        <a
          href="#ubicacion"
          className={style.link}
          onClick={(e) => {
            e.preventDefault();
            scrollTo("ubicacion");
          }}
        >
          Ubicación
        </a>

        <a
          href="#contacto"
          className={style.link}
          onClick={(e) => {
            e.preventDefault();
            scrollTo("contacto");
          }}
        >
          Contacto
        </a>
      </nav>

      <p className={style.text}>
        © {new Date().getFullYear()} - Todos los derechos reservados.
      </p>
    </footer>
  );
}

export default Footer;
