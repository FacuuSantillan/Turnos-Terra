require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT } = process.env;

const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`, {
  logging: false,
  native: false,
});

const basename = path.basename(__filename);

const modelDefiners = [];

// Carga dinámica de modelos
fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

// Inyecta la conexión sequelize en cada modelo
modelDefiners.forEach(model => model(sequelize));

// Capitaliza los nombres
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map(([name, model]) => [
  name[0].toUpperCase() + name.slice(1),
  model,
]);
sequelize.models = Object.fromEntries(capsEntries);

// Extraer modelos tal como los definiste en cada archivo
const { Cancha, Turno, Usuario, Horario} = sequelize.models;

// Relaciones
Turno.belongsTo(Usuario, { foreignKey: "usuario_id" });
Turno.belongsTo(Cancha, { foreignKey: "cancha_id" });

Turno.belongsToMany(Horario, { through: 'turno_horarios', foreignKey: 'turno_id' });
Horario.belongsToMany(Turno, { through: 'turno_horarios', foreignKey: 'horario_id' });


module.exports = {
  ...sequelize.models,
  conn: sequelize,
};
