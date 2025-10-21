const { Horario } = require('../../db');

// Crear un nuevo horario
const crearHorarioAdmin = async (req, res) => {
  try {
    const { hora_inicio, hora_fin } = req.body;

    if (!hora_inicio || !hora_fin) {
      return res.status(400).json({ error: 'Faltan datos: hora_inicio o hora_fin' });
    }

    const nuevoHorario = await Horario.create({
      hora_inicio,
      hora_fin,
      activo: true
    });

    res.status(201).json(nuevoHorario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los horarios
const obtenerHorariosAdmin = async (req, res) => {
  try {
    const horarios = await Horario.findAll({
      order: [['id', 'ASC']], 
    });

    res.status(200).json(horarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Modificar un horario (ej. cambiar hora_inicio o fin)
const modificarHorarioAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { hora_inicio, hora_fin, activo } = req.body;

    const horario = await Horario.findByPk(id);
    if (!horario) {
      return res.status(404).json({ error: 'Horario no encontrado' });
    }

    if (hora_inicio) horario.hora_inicio = hora_inicio;
    if (hora_fin) horario.hora_fin = hora_fin;
    if (activo !== undefined) horario.activo = activo;

    await horario.save();

    res.status(200).json(horario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un horario
const eliminarHorarioAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const horario = await Horario.findByPk(id);

    if (!horario) {
      return res.status(404).json({ error: 'Horario no encontrado' });
    }

    await horario.destroy();
    res.status(200).json({ message: 'Horario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Activar o desactivar un horario
const cambiarEstadoHorarioAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { activo } = req.body;

    const horario = await Horario.findByPk(id);
    if (!horario) {
      return res.status(404).json({ error: 'Horario no encontrado' });
    }

    horario.activo = activo;
    await horario.save();

    res.status(200).json({
      message: `Horario ${activo ? 'activado' : 'desactivado'} correctamente`,
      horario
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  crearHorarioAdmin,
  obtenerHorariosAdmin,
  modificarHorarioAdmin,
  eliminarHorarioAdmin,
  cambiarEstadoHorarioAdmin
};
