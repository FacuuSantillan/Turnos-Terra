const { Router } = require('express');

const {
  crearHorarioAdmin,
  obtenerHorariosAdmin,
  modificarHorarioAdmin,
  eliminarHorarioAdmin,
  cambiarEstadoHorarioAdmin,
  obtenerTurnosAdmin
} = require('../controller/RoutesAdmin/routesAdmin');

const {
  obtenerTurnosFijos,
  obtenerTurnosFijosLiberados,
  crearLiberacion,
  crearTurnoFijo,
  modificarTurnoFijo,
  eliminarTurnoFijo
} = require('../controller/RoutesAdmin/routesTurnosFijos');

const { crearTurno } = require('../controller/RoutesPost/postTurno');
const putTurno = require('../controller/RoutesPut/putTurno');
const deleteTurno = require('../controller/RoutesDelete/deleteTurno');
const deleteCancha = require('../controller/RoutesDelete/deleteCancha');
const deleteUsuario = require('../controller/RoutesDelete/deleteUsuario');
const { obtenerUsuarioPorId } = require('../controller/RoutesGet/getUsuario');
const { obtenerCanchas } = require('../controller/RoutesGet/getCanchas');

const router = Router();

/* -------------------- GET -------------------- */
router.get('/', obtenerHorariosAdmin);
router.get('/getTurnos', obtenerTurnosAdmin);
router.get('/getUsuario/:id', obtenerUsuarioPorId);
router.get('/getCanchas', obtenerCanchas);
router.get('/turnos-fijos', obtenerTurnosFijos);
router.get('/turnos-fijos/liberados', obtenerTurnosFijosLiberados);

/* -------------------- POST -------------------- */
router.post('/', crearHorarioAdmin);
router.post('/crearTurno', crearTurno);
router.post('/turnos-fijos/liberar', crearLiberacion);
router.post('/turnos-fijos/crear', crearTurnoFijo);

/* -------------------- PUT -------------------- */
router.put('/modificarTurno/:id', putTurno);
router.put('/modificarHora/:id', modificarHorarioAdmin);
router.put('/:id', cambiarEstadoHorarioAdmin);
router.put('/turnos-fijos/modificar/:id', modificarTurnoFijo);

/* -------------------- DELETE -------------------- */
router.delete('/:id', eliminarHorarioAdmin);
router.delete('/eliminarTurno/:id', deleteTurno);
router.delete('/eliminarCancha/:id', deleteCancha);
router.delete('/eliminarUsuario/:id', deleteUsuario);
router.delete('/turnos-fijos/:id', eliminarTurnoFijo);

module.exports = router;
