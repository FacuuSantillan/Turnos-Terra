// Turnos.jsx
import React from "react";
import Cancha from "./cancha";
import style from "./turnos.module.css";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function Turnos() {
  return (
    <div className={style.wrapper}>
      {/* Desktop: dos canchas lado a lado */}
      <div className={style.desktopView}>
        <Cancha titulo="CANCHA 1 " />
        <Cancha titulo="CANCHA 2" />
      </div>

      {/* Mobile: slider con flechas y swipe */}
      <div className={style.mobileView}>
        <Swiper
          pagination={{ clickable: true }}
          className={style.swiperCanchas}
        >
          <SwiperSlide>
            <Cancha titulo="CANCHA 1" />
          </SwiperSlide>
          <SwiperSlide>
            <Cancha titulo="CANCHA 2" />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
}

export default Turnos;
