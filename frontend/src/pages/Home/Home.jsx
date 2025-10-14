import BarraNavegacion from "../../components/barraNavegacion/barraNavegacion";
import Turnos from "../../components/turnos/turnos";
import Formulario from "../../components/formulario/formulario";

function Home() {
  return (
    <div>
      <BarraNavegacion />
      <Turnos/>
      <Formulario/>
    </div>
  );
}

export default Home;