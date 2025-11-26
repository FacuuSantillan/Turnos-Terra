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
        {[
          { id: "inicio", label: "Inicio" },
          { id: "formulario", label: "Datos del turno" },
          { id: "ubicacion", label: "Ubicación" },
          { id: "contacto", label: "Contacto" }
        ].map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={style.link}
            onClick={(e) => {
              e.preventDefault();
              scrollTo(item.id);
            }}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <p className={style.text}>
        © {new Date().getFullYear()} - Todos los derechos reservados.
      </p>
    </footer>
  );
}

export default Footer;
