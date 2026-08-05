/* Incidencias — tareas/incidencias por área y control de cuáles ya fueron publicadas al equipo. */
function getAreaTasks(areaOrKey) {
  const key = typeof areaOrKey === 'object' ? areaOrKey.areaKey : areaOrKey;
  return TAREAS[key] || [
    ['Revisar tarea pendiente', 'P-0000'],
    ['Actualizar seguimiento del área', 'P-0000'],
    ['Coordinar entrega', 'P-0000']
  ];
}

function getAreaIncidents(areaOrKey) {
  const key = typeof areaOrKey === 'object' ? areaOrKey.areaKey : areaOrKey;
  return INCIDENCIAS[key] || [
    ['INC-000', 'Sin incidencias registradas', 'Media']
  ];
}

const INCIDENCIAS_PUBLICADAS = {};

function isIncidenciaPublicada(areaKey, idx) {
  return !!INCIDENCIAS_PUBLICADAS[areaKey]?.[idx];
}

function publicarIncidencia(areaKey, idx) {
  if (!INCIDENCIAS_PUBLICADAS[areaKey]) INCIDENCIAS_PUBLICADAS[areaKey] = {};
  INCIDENCIAS_PUBLICADAS[areaKey][idx] = true;
}

function getIncidenciasPublicadasArea(areaKey) {
  return getAreaIncidents(areaKey)
    .map((it, i) => ({ it, i }))
    .filter(({ i }) => isIncidenciaPublicada(areaKey, i));
}

function countIncidenciasSinPublicar() {
  return Object.keys(INCIDENCIAS).reduce(
    (acc, areaKey) => acc + getAreaIncidents(areaKey).filter((_, idx) => !isIncidenciaPublicada(areaKey, idx)).length,
    0
  );
}
