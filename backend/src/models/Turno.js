const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Turno = sequelize.define('Turno', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    hora_inicio: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    hora_fin: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM("pendiente", "reservado", "cancelado"),
      defaultValue: "reservado",
    },
  }, {
    tableName: "turnos",
    timestamps: false,
  });

  return Turno;
};
