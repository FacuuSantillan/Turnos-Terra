const { Router } = require('express');

// Controladores de administrador
const {
  crearHorarioAdmin,
  obtenerHorariosAdmin,
  modificarHorarioAdmin,
  eliminarHorarioAdmin,
  cambiarEstadoHorarioAdmin
} = require('../controller/RoutesAdmin/routesAdmin');

// Controladores de turnos, canchas y usuarios
const { crearTurno } = require('../controller/RoutesPost/postTurno');
const putTurno = require('../controller/RoutesPut/putTurno');
const deleteTurno = require('../controller/RoutesDelete/deleteTurno');
const deleteCancha = require('../controller/RoutesDelete/deleteCancha');
const deleteUsuario = require('../controller/RoutesDelete/deleteUsuario');

const router = Router();

// Crear un nuevo turno
router.post('/crearTurno', crearTurno);

// Modificar turno existente
router.put('/modificarTurno/:id', putTurno);

// Eliminar turno
router.delete('/eliminarTurno/:id', deleteTurno);

// Eliminar cancha
router.delete('/eliminarCancha/:id', deleteCancha);

// Eliminar usuario
router.delete('/eliminarUsuario/:id', deleteUsuario);

// Obtener todos los horarios
router.get('/', obtenerHorariosAdmin);

// Crear horario
router.post('/', crearHorarioAdmin);

// Modificar horario
router.put('/:id', modificarHorarioAdmin);

// Cambiar estado (activo/inactivo)
router.put('/:id', cambiarEstadoHorarioAdmin);

// Eliminar horario
router.delete('/:id', eliminarHorarioAdmin);

module.exports = router;
