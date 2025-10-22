const { usuario } = require('../../db');

const deleteUsuario = async(req, res) =>{
    try {
        const { id } = req.params;

        const Usuario = await Usuario.findOne({
            where: {
                id: id
            }
        });
        
        if (!Usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        await usuario.destroy();        
        res.status(200).json('Usuario eliminado correctamente.')
    
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = deleteUsuario