/* Persistencia — guarda y recupera en localStorage el estado de áreas, tareas, incidencias y usuarios. */
const STORAGE_KEY = 'hilonet_areas_state';
const PALETA_AREAS = ['#4a6fa5', '#7a5c44', '#5a7a4a', '#b77d4a', '#6b7a8f', '#a24f5d', '#5fa27a', '#8f6f98'];

function cargarEstadoPersistido() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.areas)) return null;
    return parsed;
  } catch (error) {
    return null;
  }
}

function guardarEstadoPersistido() {
  try {
    const payload = {
      areas: AREAS_CAT,
      areasInfo: AREAS_INFO,
      tareas: TAREAS,
      incidencias: INCIDENCIAS,
      usuarios: USUARIOS
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.warn('No se pudo guardar el estado de áreas:', error);
  }
}

const estadoPersistido = cargarEstadoPersistido();
if (estadoPersistido) {
  AREAS_CAT.splice(0, AREAS_CAT.length, ...((estadoPersistido.areas || []).filter(Boolean)));
  Object.assign(AREAS_INFO, estadoPersistido.areasInfo || {});
  Object.assign(TAREAS, estadoPersistido.tareas || {});
  Object.assign(INCIDENCIAS, estadoPersistido.incidencias || {});
  if (Array.isArray(estadoPersistido.usuarios)) {
    USUARIOS.splice(0, USUARIOS.length, ...estadoPersistido.usuarios);
  }
}
