const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
 const Horario = sequelize.define('Horario', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    hora_inicio: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    hora_fin: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: "horarios",
    timestamps: false,
  });
  return Horario;
};
