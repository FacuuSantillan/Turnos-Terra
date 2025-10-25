import BarraNavegacion from "../../components/barraNavegacion/barraNavegacion";
import Turnos from "../../components/turnos/turnos";
import Formulario from "../../components/formulario/formulario";
import MapaUbicacion from "../../components/mapaUbicacion/mapaUbicacion";
import Footer from "../../components/footer/footer";

import DashboardPadel from "../dashboard/dashboard";

function Home() {
  return (
    <div>
      <BarraNavegacion />
      <Turnos/>
      <Formulario/>
      <MapaUbicacion/>
      <Footer/>
  
    </div>
  );
}

export default Home;