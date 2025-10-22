const { Turno, Usuario, Cancha, Horario } = require('../../db');
const { Op } = require('sequelize');

const putTurno = async (req, res) => {
  try {
    const { id } = req.params;
    const { usuario, cancha_id, horaInicio, horaFin, ...turnoData } = req.body;

    // 1️⃣ Buscar el turno existente
    const turno = await Turno.findByPk(id);
    if (!turno) return res.status(404).json({ error: 'Turno no encontrado.' });

    // 2️⃣ Actualizar datos de usuario si se envían
    if (usuario && usuario.id) {
      const usuarioExistente = await Usuario.findByPk(usuario.id);
      if (usuarioExistente) {
        await usuarioExistente.update(usuario);
      } else {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }
    }

    // 3️⃣ Actualizar cancha si se envía
    let nuevaCanchaId = turno.cancha_id;
    if (cancha_id) {
      const cancha = await Cancha.findByPk(cancha_id);
      if (!cancha) return res.status(400).json({ error: 'Cancha no válida.' });
      nuevaCanchaId = cancha_id;
    }

    // 4️⃣ Actualizar horarios si se envían horaInicio / horaFin
    if (horaInicio || horaFin) {
      if (!horaInicio || !horaFin) {
        return res.status(400).json({ error: 'Debes enviar horaInicio y horaFin para actualizar el rango horario.' });
      }

      // Formatear horas
      const inicioFormateado = horaInicio.replace('hs', '').trim();
      const finFormateado = horaFin.replace('hs', '').trim();

      const horaInicioFmt = inicioFormateado.includes(':') ? inicioFormateado : `${inicioFormateado}:00`;
      const horaFinFmt = finFormateado.includes(':') ? finFormateado : `${finFormateado}:00`;

      // Buscar todos los horarios intermedios
      const nuevosHorarios = await Horario.findAll({
        where: {
          hora_inicio: { [Op.gte]: horaInicioFmt },
          hora_fin: { [Op.lte]: horaFinFmt },
          activo: true
        },
        order: [['hora_inicio', 'ASC']]
      });

      if (!nuevosHorarios.length) {
        return res.status(400).json({ error: 'No se encontraron horarios válidos en ese rango.' });
      }

      // Actualizar la tabla intermedia
      await turno.setHorarios(nuevosHorarios.map(h => h.id));

      // Actualizar horas en el turno principal
      turno.hora_inicio = nuevosHorarios[0].hora_inicio;
      turno.hora_fin = nuevosHorarios[nuevosHorarios.length - 1].hora_fin;
    }

    // 5️⃣ Actualizar otros campos y cancha
    await turno.update({
      ...turnoData,
      cancha_id: nuevaCanchaId,
      hora_inicio: turno.hora_inicio,
      hora_fin: turno.hora_fin
    });

    // 6️⃣ Retornar turno actualizado con relaciones
    const turnoActualizado = await Turno.findByPk(id, {
      include: [
        { model: Usuario, attributes: ['nombre', 'apellido', 'telefono'] },
        { model: Cancha, attributes: ['id', 'nombre'] },
      ],
    });

    res.status(200).json(turnoActualizado);
  } catch (error) {
    console.error('Error al modificar turno:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = putTurno;
