import React from "react";
import style from "./mapaUbicacion.module.css";

function MapaUbicacion() {
  return (
    <section className={style.mapaSection}>
      <div className={style.textContainer}>
        <h2 className={style.title}>📍Nuestra Ubicación</h2>
        <p className={style.description}>

        </p>
      </div>

      <div className={style.mapaContainer}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d744.9284719651847!2d-65.58743243204441!3d-27.360191178751517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses-419!2sar!4v1760653030076!5m2!1ses-419!2sar"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Mapa de ubicación"
        ></iframe>
      </div>

      <a
        href="https://www.google.com/maps/place/Terra+padel/@-27.3608441,-65.5872203,17.75z/data=!4m6!3m5!1s0x9423c5001d3ff397:0x6c46d4f09c8a8dd!8m2!3d-27.360094!4d-65.5872442!16s%2Fg%2F11wqf12qhd?entry=ttu&g_ep=EgoyMDI1MTAxNC4wIKXMDSoASAFQAw%3D%3D" // 👉 reemplazá con el link directo de tu club
        target="_blank"
        rel="noopener noreferrer"
        className={style.mapaButton}
      >
        Ver en Google Maps
      </a>
    </section>
  );
}

export default MapaUbicacion;
