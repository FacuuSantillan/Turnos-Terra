const { Router } = require('express');

//Posts
const { createProfesional,
        createPaciente,
        createUsuario, 
        createTurno } = require('./handlers')

//Gets
const { getPaciente,
        getProfesional,
        getTurno } = require('./handlers')

//Put
const { updatePaciente,
        updateProfesional,
        updateTurno } = require('./handlers')

//Delete 
const { deletePacientes,
        deleteProfesionals,
        deleteTurnos } = require('./handlers')



const router = Router();

//Routes post:
router.post('/postProfesional', createProfesional); 
router.post('/postPaciente', createPaciente); 
router.post('/postUsuario', createUsuario);
router.post('/postTurno', createTurno);

//Routes gets:
router.get('/getpacientes', getPaciente);
router.get('/getprofesional', getProfesional);
router.get('/getturno', getTurno);

//Routes Put:
router.put('/updatepaciente/:dni', updatePaciente);
router.put('/updateProfesional/:dni', updateProfesional);
router.put('/updateTurno/:id', updateTurno);

//Routes Delete
router.delete('/deletapaciente/:dni', deletePacientes);
router.delete('/deleteprofesional/:dni', deleteProfesionals);
router.delete('/deleteturno/:id', deleteTurnos);

module.exports = router;
