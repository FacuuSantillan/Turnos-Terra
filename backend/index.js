const server = require('./src/app.js');
const { conn } = require('./src/db.js');
const { seedDatabase } = require('./seed.js');

require ('dotenv').config()
const {PORT} = process.env;

conn.sync({ force: false }).then(() => {
  
 conn.sync({ force: false }).then(async () => {
  console.log("🟢 Base de datos sincronizada.");
  server.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en el puerto: ${PORT}`);
  });
  await seedDatabase(); 

});
});
