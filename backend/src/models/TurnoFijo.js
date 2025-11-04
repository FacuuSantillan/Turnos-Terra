const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('TurnoFijo', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    dia_semana: {
      type: DataTypes.INTEGER, 
      allowNull: false,
    },
    hora_inicio: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hora_fin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
   
  }, {
    tableName: 'turnos_fijos',
    timestamps: false,
  });
};