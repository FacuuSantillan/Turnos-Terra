const { Turno, Usuario, Cancha, Horario } = require('../../db');
const { Op } = require('sequelize');

const crearTurno = async (req, res) => {
  try {
    const { nombre, apellido, telefono, cancha_id, horarios_ids, fecha } = req.body;

    if (!nombre || !apellido || !telefono || !cancha_id || !horarios_ids || !fecha) {
      return res.status(400).json({ error: "Faltan datos obligatorios." });
    }

  const [usuario] = await Usuario.findOrCreate({
  where: { telefono },
  defaults: { nombre, apellido, telefono },
});

    const horariosActivos = await Horario.findAll({
      where: { id: { [Op.in]: horarios_ids }, activo: true },
      order: [['id', 'ASC']],
    });

    if (horariosActivos.length !== horarios_ids.length)
      return res.status(400).json({ error: "Uno o más horarios no están activos." });

    const turnosExistentes = await Turno.findAll({
      where: { cancha_id, fecha },
      include: [{ model: Horario, attributes: ['id'] }],
    });

    const horariosOcupadosIds = turnosExistentes.flatMap(t =>
      t.Horarios?.map(h => h.id) || []
    );

    const conflicto = horarios_ids.some(id => horariosOcupadosIds.includes(id));

    if (conflicto)
      return res.status(400).json({ error: "Uno o más horarios ya están reservados." });

    const hora_inicio = horariosActivos[0].hora_inicio;
    const hora_fin = horariosActivos[horariosActivos.length - 1].hora_fin;

    const nuevoTurno = await Turno.create({
      usuario_id: usuario.id,
      cancha_id,
      fecha,
      estado: "reservado",
      hora_inicio,
      hora_fin,
    });

    await nuevoTurno.setHorarios(horarios_ids);

    const turnoConDatos = await Turno.findByPk(nuevoTurno.id, {
      include: [
        { model: Usuario, attributes: ['nombre', 'apellido', 'telefono'] },
        { model: Cancha, attributes: ['nombre'] }
      ],
    });

    res.status(201).json(turnoConDatos);

  } catch (error) {
    console.error("Error al crear turno:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

module.exports = { crearTurno };
