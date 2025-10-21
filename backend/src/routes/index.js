const { Router } = require('express');
const {
  crearHorarioAdmin,
  obtenerHorariosAdmin,
  modificarHorarioAdmin,
  eliminarHorarioAdmin,
  cambiarEstadoHorarioAdmin
} = require('../controller/RoutesAdmin/routesAdmin');

const { crearTurno } = require('../controller/RoutesPost/postTurno');

const router = Router();

//Routes post:
router.post('/crearTurno', crearTurno);

//Routes gets:


//Routes Put:


//Routes Delete


//Routes Admin:
router.get('/', obtenerHorariosAdmin);
router.post('/', crearHorarioAdmin);
router.put('/:id', modificarHorarioAdmin);
router.put('/:id', cambiarEstadoHorarioAdmin);
router.delete('/:id', eliminarHorarioAdmin);


module.exports = router;
