const { Paciente } = require('../../db');

const deletePaciente = async (req, res) => {
    const { dni } = req.params;

        const paciente = await Paciente.findOne({
            where: {
                DNI: dni
            }
        });
        
        if (!paciente) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }

    await paciente.destroy();
};

module.exports = deletePaciente

