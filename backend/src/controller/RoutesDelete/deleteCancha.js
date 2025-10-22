const { cancha } = require('../../db');

const deleteCancha = async(req, res) =>{
    try {
        const { id } = req.params;

        const Cancha = await Cancha.findOne({
            where: {
                id: id
            }
        });
        
        if (!Cancha) {
            return res.status(404).json({ message: 'Cancha no encontrado' });
        }

        await cancha.destroy();        
        res.status(200).json('Cancha eliminado correctamente.')
    
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = deleteCancha