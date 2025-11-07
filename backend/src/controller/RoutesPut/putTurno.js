const { Turno, Usuario, Cancha, Horario } = require('../../db');
const { Op } = require('sequelize');

const putTurno = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      usuario,
      usuarioId,
      usuario_id,
      cancha_id,
      canchaId,
      horaInicio,
      horaFin,
      hora_inicio,
      hora_fin,
      ...turnoData
    } = req.body;

    const usuarioIdFinal = usuarioId || usuario_id;
    const canchaIdFinal = canchaId || cancha_id;
    const inicio = horaInicio || hora_inicio;
    const fin = horaFin || hora_fin;

    // 1️⃣ Buscar turno existente
    const turno = await Turno.findByPk(id, { include: Horario });
    if (!turno) return res.status(404).json({ error: 'Turno no encontrado.' });

    // 2️⃣ Actualizar datos del usuario
    if (usuario && usuario.id) {
      const usuarioExistente = await Usuario.findByPk(usuario.id);
      if (usuarioExistente) {
        await usuarioExistente.update(usuario);
      } else {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }
    }

    // 3️⃣ Validar usuario y cancha
    if (usuarioIdFinal) {
      const usuarioExistente = await Usuario.findByPk(usuarioIdFinal);
      if (!usuarioExistente)
        return res.status(400).json({ error: 'Usuario no válido.' });
      turno.usuario_id = usuarioIdFinal;
    }

    let nuevaCanchaId = turno.cancha_id;
    if (canchaIdFinal) {
      const cancha = await Cancha.findByPk(canchaIdFinal);
      if (!cancha) return res.status(400).json({ error: 'Cancha no válida.' });
      nuevaCanchaId = canchaIdFinal;
    }

    // 4️⃣ Actualizar horarios
    if (inicio && fin) {
      const horaInicioFmt = inicio.includes(':') ? inicio : `${inicio}:00`;
      const horaFinFmt = fin.includes(':') ? fin : `${fin}:00`;

      // 🔹 Buscar nuevos horarios dentro del rango
      const nuevosHorarios = await Horario.findAll({
        where: {
          [Op.and]: [
            { hora_inicio: { [Op.gte]: horaInicioFmt } },
            { hora_fin: { [Op.lte]: horaFinFmt } },
            { activo: true },
          ],
        },
      });

      if (!nuevosHorarios.length) {
        return res.status(400).json({
          error: 'No se encontraron horarios válidos en el nuevo rango.',
        });
      }

      // 🔹 Liberar los horarios anteriores
      await turno.setHorarios([]);

      // 🔹 Asignar los nuevos
      await turno.setHorarios(nuevosHorarios.map((h) => h.id));

      // Actualizar horas del turno
      turno.hora_inicio = horaInicioFmt;
      turno.hora_fin = horaFinFmt;
    }

    // 5️⃣ Guardar cambios
    await turno.update({
      ...turnoData,
      cancha_id: nuevaCanchaId,
      hora_inicio: turno.hora_inicio,
      hora_fin: turno.hora_fin,
    });

    // 6️⃣ Retornar el turno actualizado
    const turnoActualizado = await Turno.findByPk(id, {
      include: [
        { model: Usuario, attributes: ['nombre', 'apellido', 'telefono'] },
        { model: Cancha, attributes: ['id', 'nombre'] },
        { model: Horario, attributes: ['hora_inicio', 'hora_fin'] },
      ],
    });

    return res.status(200).json(turnoActualizado);
  } catch (error) {
    console.error('Error al modificar turno:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = putTurno;
