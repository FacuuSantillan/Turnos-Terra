const { Cancha } = require('../../db');

const obtenerCanchas = async (req, res) => {
  try {
    const canchas = await Cancha.findAll({
      order: [['id', 'ASC']], 
    });

    res.status(200).json(canchas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  obtenerCanchas,
};