const { Horario, Cancha } = require('./src/db.js'); // No importamos Horario2
const { Op } = require('sequelize');

async function seedDatabase() {
  try {
  	console.log("⏳ Inicializando datos...");

  	// ---------- 1. CREA CANCHAS PRIMERO ----------
  	const existingCanchas = await Cancha.count();
  	if (existingCanchas === 0) {
  	  await Cancha.bulkCreate([
  	  	{ nombre: "Cancha 1", ubicacion: "adelante", tipo: "césped", techada: true },
  	  	{ nombre: "Cancha 2", ubicacion: "atrás", tipo: "césped", techada: true },
  	  ]);
  	  console.log("✅ Canchas creadas correctamente.");
  	} else {
  	  console.log("ℹ️ Las canchas ya existen.");
  	}

  	// ---------- 2. CREA 48 HORARIOS (24 por cancha) ----------
  	const existingHorarios = await Horario.count();
  	if (existingHorarios === 0) {
  	  const horarios = [];
  	  
  	  // Itera sobre las canchas (ID 1 y ID 2)
  	  for (let canchaId = 1; canchaId <= 2; canchaId++) {
  	  	// Crea 24 horarios para CADA cancha
  	  	for (let h = 0; h < 24; h++) {
  	  	  const horaInicio = `${h.toString().padStart(2, '0')}:00`;
  	  	  const horaFin = `${(h + 1).toString().padStart(2, '0')}:00`;
  	  	  horarios.push({
  	  	  	hora_inicio: horaInicio,
  	  	  	hora_fin: horaFin,
  	  	  	activo: true,
  	  	  	cancha_id: canchaId // <-- ESTO ES LO QUE FALTABA
  	  	  });
  	  	}
  	  }
  	  await Horario.bulkCreate(horarios); 
  	  console.log("✅ 48 Horarios (24 por cancha) creados.");
  	} else {
  	  console.log("ℹ️ Los horarios ya existen.");
  	}

  	console.log("🌱 Seed completado con éxito.");

  } catch (error) {
  	console.error("❌ Error al inicializar la base de datos:", error);
  }
}

module.exports = { seedDatabase };