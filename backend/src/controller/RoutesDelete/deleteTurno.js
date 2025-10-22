const { Turno } = require('../../db');

const deleteTurno = async(req, res) =>{
    try {
        const { id } = req.params;

        const turno = await Turno.findOne({
            where: {
                id: id
            }
        });
        
        if (!turno) {
            return res.status(404).json({ message: 'Turno no encontrado' });
        }

        await turno.destroy();        
        res.status(200).json('turno eliminado correctamente.')
    
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = deleteTurno