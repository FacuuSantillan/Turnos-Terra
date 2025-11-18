const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TurnoHorario = sequelize.define('TurnoHorario', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    turno_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'turnos',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    horario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'horarios',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  }, {
    tableName: 'turno_horarios',
    timestamps: false,
  });

  return TurnoHorario;
};
