const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('Horario', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    hora_inicio: {
      type: DataTypes.STRING, 
      allowNull: false,
    },
    hora_fin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  
  }, { timestamps: false, tableName: 'horarios' }); 
};