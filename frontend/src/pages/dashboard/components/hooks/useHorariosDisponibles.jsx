import { useMemo } from 'react';

export default function useHorariosDisponibles({
  horarios,
  turnos,
  turnosFijos,
  liberados,
  fecha,
  canchaId,
  turnoActual,
}) {
  return useMemo(() => {
    if (
      !canchaId ||
      !fecha ||
      !Array.isArray(horarios) ||
      !Array.isArray(turnos)
    ) {
      return [];
    }

    const turnosFijosSafe = Array.isArray(turnosFijos) ? turnosFijos : [];
    const liberadosSafe = Array.isArray(liberados) ? liberados : [];

    const diaSemanaNum = new Date(`${fecha}T00:00:00`).getUTCDay();
    const diaSemana = diaSemanaNum === 0 ? 7 : diaSemanaNum;

    const getHorarioStatus = (horario) => {
      if (!horario.activo) return 'Deshabilitado';

      // 🟢 Si el horario pertenece al turno actual (en edición), debe estar habilitado para selección
      const esDelTurnoActual =
        turnoActual &&
        turnoActual.cancha_id === canchaId &&
        turnoActual.fecha?.startsWith(fecha) &&
        Array.isArray(turnoActual.Horarios) &&
        turnoActual.Horarios.some((h) => h.id === horario.id);

      if (esDelTurnoActual) return 'Editando';

      // 🔴 Reservado por otro turno
      const reservado = turnos.some(
        (t) =>
          t.id !== turnoActual?.id && // ignoramos el turno actual
          t.fecha?.startsWith(fecha) &&
          t.cancha_id === canchaId &&
          Array.isArray(t.Horarios) &&
          t.Horarios.some((h) => h.id === horario.id)
      );
      if (reservado) return 'Reservado';

      // 🟠 Turno fijo (bloqueado salvo que esté liberado)
      const turnoFijo = turnosFijosSafe.find(
        (tf) =>
          tf.cancha_id === canchaId &&
          tf.dia_semana === diaSemana &&
          Array.isArray(tf.Horarios) &&
          tf.Horarios.some((h) => h.id === horario.id)
      );
      if (turnoFijo) {
        const estaLiberado = liberadosSafe.some(
          (l) => l.turno_fijo_id === turnoFijo.id && l.fecha === fecha
        );
        return estaLiberado ? 'Disponible' : 'Turno Fijo';
      }

      // 🟢 Disponible
      return 'Disponible';
    };

    // 🔍 Filtramos solo los horarios activos de esa cancha
    const horariosCancha = horarios.filter(
      (h) => h.cancha_id === canchaId && h.activo
    );

    // 🧠 Generamos los horarios con su estado
    const horariosConEstado = horariosCancha
      .map((h) => ({
        ...h,
        status: getHorarioStatus(h),
        disponible:
          getHorarioStatus(h) === 'Disponible' ||
          getHorarioStatus(h) === 'Editando', // estos se pueden seleccionar
      }))
      .sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));

    return horariosConEstado;
  }, [horarios, turnos, turnosFijos, liberados, fecha, canchaId, turnoActual]);
}
