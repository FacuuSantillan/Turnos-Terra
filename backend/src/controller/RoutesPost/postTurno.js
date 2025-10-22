const { Turno, Usuario, Cancha, Horario } = require('../../db');
const { Op } = require('sequelize');

const crearTurno = async (req, res) => {
  try {
    const { nombre, apellido, telefono, cancha_id, horarios_ids, fecha } = req.body;

    if (!nombre || !apellido || !telefono || !cancha_id || !horarios_ids || !fecha) {
      return res.status(400).json({ error: "Faltan datos obligatorios." });
    }

    // -------------------Buscar o crear usuario-------------------
  const [usuario] = await Usuario.findOrCreate({
  where: { telefono },
  defaults: { nombre, apellido, telefono },
});

    // -------------------Verificar que los horarios estén activos-------------------
    const horariosActivos = await Horario.findAll({
      where: { id: { [Op.in]: horarios_ids }, activo: true },
      order: [['id', 'ASC']],
    });

    if (horariosActivos.length !== horarios_ids.length)
      return res.status(400).json({ error: "Uno o más horarios no están activos." });

    // ------------------- Buscar turnos existentes en esa fecha y cancha-------------------
    const turnosExistentes = await Turno.findAll({
      where: { cancha_id, fecha },
      include: [{ model: Horario, attributes: ['id'] }],
    });

    // -------------------Obtener los horarios ya reservados-------------------
    const horariosOcupadosIds = turnosExistentes.flatMap(t =>
      t.Horarios?.map(h => h.id) || []
    );

    // -------------------Verificar si alguno de los horarios que se quieren reservar ya está ocupado-------------------
    const conflicto = horarios_ids.some(id => horariosOcupadosIds.includes(id));

    if (conflicto)
      return res.status(400).json({ error: "Uno o más horarios ya están reservados." });

    // -------------------Calcular rango de horas-------------------
    const hora_inicio = horariosActivos[0].hora_inicio;
    const hora_fin = horariosActivos[horariosActivos.length - 1].hora_fin;

    // -------------------Crear el turno principal-------------------
    const nuevoTurno = await Turno.create({
      usuario_id: usuario.id,
      cancha_id,
      fecha,
      estado: "reservado",
      hora_inicio,
      hora_fin,
    });

    // -------------------Asociar los horarios al turno-------------------
    await nuevoTurno.setHorarios(horarios_ids);

    // -------------------Traer turno completo-------------------
    const turnoConDatos = await Turno.findByPk(nuevoTurno.id, {
      include: [
        { model: Usuario, attributes: ['nombre', 'apellido', 'telefono'] },
      ],
    });

    res.status(201).json(turnoConDatos);

  } catch (error) {
    console.error("Error al crear turno:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

module.exports = { crearTurno };
