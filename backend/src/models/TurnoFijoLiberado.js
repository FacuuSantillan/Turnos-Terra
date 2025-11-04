const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('TurnoFijoLiberado', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fecha: {
      type: DataTypes.DATEONLY, 
      allowNull: false,
    },

  }, {
    tableName: 'turnos_fijos_liberados',
    timestamps: false,
  });
};
