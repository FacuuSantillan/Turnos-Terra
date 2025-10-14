const { Paciente, Turno } = require('../../db')
const { Sequelize } = require("sequelize");

const getAllPacientes = async () => {

    const response = await Paciente.findAll({
        attributes: [
            'DNI',
            'nombre',
            'domicilio',
            'celular',
            'obraSocial',
            'fechaDeNacimiento',
        ],

        include: {
            model: Turno,
            attributes: ['estado', 'hora', 'fecha', 'notas', 'ProfesionalDNI', 'PacienteDNI'],
        },
    });

    return response.map((res) => {
        return {
            DNI: res.dataValues.DNI,
            nombre: res.dataValues.nombre,
            domicilio: res.dataValues.domicilio,
            celular: res.dataValues.celular,
            obraSocial: res.dataValues.obraSocial,
            fechaDeNacimiento: res.dataValues.fechaDeNacimiento,
            Turno: res.dataValues.Turnos.map((turno) => { 
                return {
                    estado: turno.dataValues.estado,
                    hora: turno.dataValues.hora,
                    fecha: turno.dataValues.fecha,
                    notas: turno.dataValues.notas,
                    ProfesionalDNI: turno.dataValues.ProfesionalDNI
                };
            }),
        };
    });
};

module.exports = getAllPacientes;
