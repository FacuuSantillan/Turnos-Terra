const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Turno = sequelize.define('Turno', {
   id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  }, {
    tableName: "turnos",
    timestamps: false,
  });

  return Turno;
};
