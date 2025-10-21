const { Horario, Cancha } = require('./src/db.js');
const { Op } = require('sequelize');

async function seedDatabase() {
  try {
    console.log("⏳ Inicializando datos...");

    // ---------- CREA HORARIOS ----------
    const existingHorarios = await Horario.count();
    if (existingHorarios === 0) {
      const horarios = [];
      for (let h = 0; h < 24; h++) {
        const horaInicio = `${h.toString().padStart(2, '0')}:00`;
        const horaFin = `${(h + 1).toString().padStart(2, '0')}:00`;
        horarios.push({
          hora_inicio: horaInicio,
          hora_fin: horaFin,
          activo: true,
        });
      }
      await Horario.bulkCreate(horarios);
      console.log("✅ Horarios creados correctamente.");
    } else {
      console.log("ℹ️ Los horarios ya existen, no se vuelven a crear.");
    }

    // ---------- CREA CANCHAS ----------
    const existingCanchas = await Cancha.count();
    if (existingCanchas === 0) {
      await Cancha.bulkCreate([
        {
          nombre: "Cancha 1",
          ubicacion: "adelante",
          tipo: "césped",
          techada: true,
        },
        {
          nombre: "Cancha 2",
          ubicacion: "atrás",
          tipo: "césped",
          techada: true,
        },
      ]);
      console.log("✅ Canchas creadas correctamente.");
    } else {
      console.log("ℹ️ Las canchas ya existen, no se vuelven a crear.");
    }

    console.log("🌱 Seed completado con éxito.");

  } catch (error) {
    console.error("❌ Error al inicializar la base de datos:", error);
  }
}

module.exports = { seedDatabase };
