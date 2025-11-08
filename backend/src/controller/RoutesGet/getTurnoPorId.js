const { Turno, Usuario, Horario, Cancha } = require('../../db');

const obtenerTurnoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "No se proporcionó un ID." });
    }

    const turno = await Turno.findByPk(id, {
      include: [
        {
          model: Usuario,
          attributes: ['id', 'nombre', 'apellido', 'telefono'], 
        },
        {
          model: Cancha,
          attributes: ['id', 'nombre'], 
        },
      ],
    });

    if (!turno) {
      return res.status(404).json({ error: "Turno no encontrado." });
    }

    res.status(200).json(turno);
  } catch (error) {
    console.error("Error al obtener el turno:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  obtenerTurnoPorId,
};
