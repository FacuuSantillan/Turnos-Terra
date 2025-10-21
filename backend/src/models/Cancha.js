const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Cancha = sequelize.define('Cancha', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, //"Cancha 1" o "Cancha 2"
    },
    activa: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
  }, {
    timestamps: false,
  });
  return Cancha;
};
