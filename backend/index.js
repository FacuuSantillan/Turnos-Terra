const server = require('./src/app.js');
const { conn } = require('./src/db.js');
const { seedDatabase } = require('./seed.js');

require ('dotenv').config()
const {PORT} = process.env;

// USA { force: true } para borrar todo y empezar de nuevo
conn.sync({ force: true }).then(async () => {
  console.log("🟢 Base de datos sincronizada (Forzada).");
  
  // Ejecuta el seeder DESPUÉS de sincronizar
  await seedDatabase(); 

  server.listen(PORT, () => {
  	console.log(`🚀 Servidor escuchando en el puerto: ${PORT}`);
  });
});