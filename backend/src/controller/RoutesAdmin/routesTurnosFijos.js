// Importamos los modelos necesarios
const { TurnoFijo, TurnoFijoLiberado, Usuario, Cancha, Horario } = require('../../db');
const { Op } = require('sequelize');

const obtenerTurnosFijos = async (req, res) => {
  try {
    const turnosFijos = await TurnoFijo.findAll({
      include: [
        { model: Usuario, attributes: ['nombre', 'apellido', 'telefono'] }, // Incluye teléfono
        { model: Cancha, attributes: ['nombre'] },
        { model: Horario, attributes: ['id', 'hora_inicio', 'hora_fin'], through: { attributes: [] } }
      ],
      order: [['dia_semana', 'ASC'], ['hora_inicio', 'ASC']]
    });
    res.status(200).json(turnosFijos);
  } catch (error) {
    console.error("Error al obtener turnos fijos:", error);
    res.status(500).json({ error: error.message });
  }
};

const obtenerTurnosFijosLiberados = async (req, res) => {
  try {
    const liberados = await TurnoFijoLiberado.findAll();
    res.status(200).json(liberados);
  } catch (error) {
    console.error("Error al obtener liberados:", error);
    res.status(500).json({ error: error.message });
  }
};

const crearLiberacion = async (req, res) => {
  const { turno_fijo_id, fecha } = req.body;
  if (!turno_fijo_id || !fecha) {
    return res.status(400).json({ error: "Faltan datos (turno_fijo_id y fecha son obligatorios)" });
  }
  try {
    const [liberacion, created] = await TurnoFijoLiberado.findOrCreate({
      where: { turno_fijo_id, fecha },
      defaults: { turno_fijo_id, fecha }
    });
    res.status(created ? 201 : 200).json(liberacion);
  } catch (error) {
    console.error("Error al crear liberación:", error);
    res.status(500).json({ error: error.message });
  }
};

// --- (CORREGIDO: Acepta datos de usuario) ---
const crearTurnoFijo = async (req, res) => {
  try {
    const { nombre, apellido, telefono, cancha_id, dia_semana, horarios_ids } = req.body;

    if (!nombre || !apellido || !telefono || !cancha_id || !dia_semana || !horarios_ids || !horarios_ids.length) {
      return res.status(400).json({ error: "Faltan datos obligatorios (nombre, apellido, telefono, cancha_id, dia_semana, horarios_ids)." });
    }

    // Busca o crea al usuario
    const [usuario] = await Usuario.findOrCreate({
      where: { telefono },
      defaults: { nombre, apellido, telefono },
    });

    // Valida los horarios
    const horarios = await Horario.findAll({
      where: {
        id: { [Op.in]: horarios_ids },
        cancha_id: cancha_id,
        activo: true
      },
      order: [['hora_inicio', 'ASC']]
    });

    if (horarios.length !== horarios_ids.length) {
      return res.status(400).json({ error: "Uno o más horarios no son válidos, no están activos o no pertenecen a la cancha seleccionada." });
    }

    // Busca conflictos
    const conflicto = await TurnoFijo.findOne({
      where: { cancha_id, dia_semana },
      include: [{
        model: Horario,
        where: { id: { [Op.in]: horarios_ids } }
      }]
    });

    if (conflicto) {
      return res.status(400).json({ error: "Uno o más de estos horarios ya están reservados como turno fijo para este día de la semana." });
    }

    // Calcula horas
    const hora_inicio = horarios[0].hora_inicio;
    const hora_fin = horarios[horarios.length - 1].hora_fin;

    // Crea el TurnoFijo usando el ID de usuario encontrado
    const nuevoTurnoFijo = await TurnoFijo.create({
      usuario_id: usuario.id, // <-- ID de usuario de findOrCreate
      cancha_id,
      dia_semana,
      hora_inicio,
      hora_fin
    });

    await nuevoTurnoFijo.setHorarios(horarios_ids);

    // Devuelve el turno completo (incluyendo el Usuario)
    const turnoFijoCompleto = await TurnoFijo.findByPk(nuevoTurnoFijo.id, {
      include: [
        { model: Usuario, attributes: ['nombre', 'apellido', 'telefono'] },
        { model: Cancha, attributes: ['nombre'] },
        { model: Horario, attributes: ['id', 'hora_inicio', 'hora_fin'], through: { attributes: [] } }
      ]
    });

    res.status(201).json(turnoFijoCompleto);

  } catch (error) {
    console.error("Error al crear turno fijo:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

// --- (CORREGIDO: Acepta datos de usuario) ---
const modificarTurnoFijo = async (req, res) => {
  const { id } = req.params; // ID del TurnoFijo a modificar
  try {
    const { nombre, apellido, telefono, cancha_id, dia_semana, horarios_ids } = req.body;

    if (!nombre || !apellido || !telefono || !cancha_id || !dia_semana || !horarios_ids || !horarios_ids.length) {
    	return res.status(400).json({ error: "Faltan datos obligatorios (nombre, apellido, telefono, cancha_id, dia_semana, horarios_ids)." });
  	}

    const turnoFijo = await TurnoFijo.findByPk(id);
    if (!turnoFijo) {
      return res.status(404).json({ error: "Turno fijo (abono) no encontrado." });
    }

    const [usuario] = await Usuario.findOrCreate({
      where: { telefono },
      defaults: { nombre, apellido, telefono },
    });

    const horarios = await Horario.findAll({
  	  where: {
  	  	id: { [Op.in]: horarios_ids },
  	  	cancha_id: cancha_id,
  	  	activo: true
  	  },
  	  order: [['hora_inicio', 'ASC']]
  	});

    if (horarios.length !== horarios_ids.length) {
    	return res.status(400).json({ error: "Uno o más horarios no son válidos, no están activos o no pertenecen a la cancha seleccionada." });
  	}

    const conflicto = await TurnoFijo.findOne({
  	  where: {
        id: { [Op.not]: id }, 
  	  	cancha_id,
  	  	dia_semana
  	  },
  	  include: [{
  	  	model: Horario,
  	  	where: { id: { [Op.in]: horarios_ids } }
  	  }]
  	});

    if (conflicto) {
    	return res.status(400).json({ error: "El nuevo horario entra en conflicto con otro abono existente." });
  	}

    const hora_inicio = horarios[0].hora_inicio;
  	const hora_fin = horarios[horarios.length - 1].hora_fin;

    await turnoFijo.update({
      usuario_id: usuario.id, // <-- ID de usuario de findOrCreate
      cancha_id,
      dia_semana,
      hora_inicio,
      hora_fin
    });

    await turnoFijo.setHorarios(horarios_ids);

    const turnoFijoCompleto = await TurnoFijo.findByPk(id, {
  	  include: [
  	  	{ model: Usuario, attributes: ['nombre', 'apellido', 'telefono'] },
  	  	{ model: Cancha, attributes: ['nombre'] },
  	  	{ model: Horario, attributes: ['id', 'hora_inicio', 'hora_fin'], through: { attributes: [] } }
  	  ]
  	});

    res.status(200).json(turnoFijoCompleto);

  } catch (error) {
    console.error("Error al modificar turno fijo:", error);
  	res.status(500).json({ error: "Error interno del servidor." });
  }
};

// --- (NUEVO CONTROLADOR: ELIMINAR TURNO FIJO) ---
const eliminarTurnoFijo = async (req, res) => {
  const { id } = req.params; 
  try {
    const turnoFijo = await TurnoFijo.findByPk(id);
    if (!turnoFijo) {
      return res.status(404).json({ error: "Turno fijo (abono) no encontrado." });
    }
    
    await turnoFijo.destroy();

    res.status(200).json({ message: "Turno fijo (abono) eliminado correctamente." });

  } catch (error) {
    console.error("Error al eliminar turno fijo:", error);
  	res.status(500).json({ error: "Error interno del servidor." });
  }
};

module.exports = {
  obtenerTurnosFijos,
  obtenerTurnosFijosLiberados,
  crearLiberacion,
  crearTurnoFijo,
  modificarTurnoFijo,
  eliminarTurnoFijo
};