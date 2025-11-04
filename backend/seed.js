const { Horario, Cancha } = require('./src/db.js');
const { Op } = require('sequelize');

async function seedDatabase() {
  try {
    console.log("⏳ Inicializando datos...");

    // ---------- 1. CREA CANCHAS ----------
    const canchasData = [
      { nombre: "Cancha 1", ubicacion: "adelante", tipo: "césped", techada: true },
      { nombre: "Cancha 2", ubicacion: "atrás", tipo: "césped", techada: true },
    ];

    for (const cancha of canchasData) {
      const [existing, created] = await Cancha.findOrCreate({
        where: { nombre: cancha.nombre },
        defaults: cancha,
      });
      if (created) {
        console.log(`✅ ${cancha.nombre} creada.`);
      } else {
        console.log(`ℹ️ ${cancha.nombre} ya existe.`);
      }
    }

    const totalHorarios = await Horario.count();

    if (totalHorarios === 0) {
      const horarios = [];

      const canchas = await Cancha.findAll();
      for (const cancha of canchas) {
        for (let h = 0; h < 24; h++) {
          const horaInicio = `${h.toString().padStart(2, '0')}:00`;
          const horaFin = `${(h + 1).toString().padStart(2, '0')}:00`;
          horarios.push({
            hora_inicio: horaInicio,
            hora_fin: horaFin,
            activo: true,
            cancha_id: cancha.id,
          });
        }
      }

      await Horario.bulkCreate(horarios);
      console.log(`✅ ${horarios.length} horarios creados (${24 * canchas.length} total).`);
    } else {
      console.log("ℹ️ Los horarios ya existen, no se crearán nuevamente.");
    }

    console.log("🌱 Seed completado con éxito.");

  } catch (error) {
    console.error("❌ Error al inicializar la base de datos:", error);
  }
}

module.exports = { seedDatabase };
