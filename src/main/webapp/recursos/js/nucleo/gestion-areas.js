/* Áreas — colores y claves únicas de área, alta/baja de áreas, y helper getAreaInfo/getAreaForUser. */
function normalizeAreaKey(value = '') {
  return String(value).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '');
}

function getNextAreaNumber() {
  const maxNumber = AREAS_CAT.reduce((max, area) => {
    const match = (area.id || '').match(/\d+/);
    const value = match ? Number(match[0]) : 0;
    return Math.max(max, value);
  }, 0);
  return maxNumber + 1;
}

function makeUniqueAreaKey(nombre, number) {
  const base = normalizeAreaKey(nombre) || `area${number}`;
  const existingKeys = new Set(AREAS_CAT.map((area) => area.areaKey));
  let key = base;
  let suffix = 1;
  while (existingKeys.has(key)) {
    key = `${base}${suffix}`;
    suffix += 1;
  }
  return key;
}

function getNextWorkerNumber() {
  const workerNumbers = AREAS_CAT.map((area) => Number((area.workerUser || '').replace(/^tr/, '') || 0))
    .filter((value) => Number.isFinite(value));
  return workerNumbers.length ? Math.max(...workerNumbers) + 1 : 4;
}

function getAreaColor(area) {
  if (area && area.color) return area.color;
  return PALETA_AREAS[(AREAS_CAT.indexOf(area) + 1) % PALETA_AREAS.length];
}

function randomAreaColor(existingAreas = AREAS_CAT) {
  const usedColors = new Set(existingAreas.filter((area) => area.color).map((area) => area.color));
  const availableColors = PALETA_AREAS.filter((color) => !usedColors.has(color));
  const colors = availableColors.length ? availableColors : PALETA_AREAS;
  const index = Math.floor(Math.random() * colors.length);
  return colors[index];
}

function asegurarColoresAreas() {
  const coloresBase = {
    diseno: 'var(--verde-diseno)',
    corte: 'var(--azul-corte)',
    costura: 'var(--marron-costura)'
  };

  AREAS_CAT.forEach((area) => {
    if (coloresBase[area.areaKey]) {
      area.color = coloresBase[area.areaKey];
      return;
    }

    if (!area.color) {
      area.color = randomAreaColor(AREAS_CAT.filter((item) => item !== area));
    }
  });
}

function registrarAreaComoTrabajador(area) {
  const key = area.areaKey || normalizeAreaKey(area.nom) || `area${area.id}`;
  const cls = normalizeAreaKey(area.nom) || 'area';
  const label = area.nom || 'Área';
  const worker = area.resp || 'Responsable';

  AREAS_INFO[key] = {
    label,
    cls,
    color: area.color || 'var(--marron)',
    worker
  };

  TAREAS[key] = [
    [`Revisar ${label.toLowerCase()}`, 'P-0000'],
    [`Registrar avance en ${label.toLowerCase()}`, 'P-0000'],
    [`Coordinar entrega del área`, 'P-0000']
  ];

  INCIDENCIAS[key] = [
    [`INC-${String(area.id).replace(/^A-/, '')}`, `Sin incidencias registradas en ${label}`, 'Media']
  ];

  return key;
}

asegurarColoresAreas();

function getAreaInfo(areaOrKey) {
  const area = typeof areaOrKey === 'object' ? areaOrKey : null;
  const key = area?.areaKey || (typeof areaOrKey === 'string' ? areaOrKey : null) || normalizeAreaKey(area?.nom || areaOrKey);
  const base = area || AREAS_CAT.find((item) => item.areaKey === key || item.id === key) || null;
  const fallback = {
    label: base?.nom || (typeof areaOrKey === 'string' ? areaOrKey : 'Área'),
    cls: base?.cls || '',
    color: base?.color || 'var(--marron)',
    worker: base?.resp || 'Responsable',
    areaKey: key
  };

  if (base && AREAS_INFO[key]) {
    return { ...AREAS_INFO[key], label: base.nom, color: base.color || AREAS_INFO[key].color, worker: base.resp || AREAS_INFO[key].worker, areaKey: key };
  }

  return fallback;
}

function getAreaForUser(user) {
  const normalizedUser = (user || '').trim().toLowerCase();
  return AREAS_CAT.find((area) => area.workerUser === normalizedUser) || null;
}

function esAreaBase(area) {
  return ['diseno', 'corte', 'costura'].includes(area?.areaKey || '');
}

function eliminarArea(id) {
  const area = AREAS_CAT.find((item) => item.id === id);
  if (!area) return;

  if (esAreaBase(area)) {
    toast('Las áreas principales no se pueden eliminar.', 'error');
    return;
  }

  confirmarAccion(`¿Eliminar el área "${area.nom}" y quitarla por completo? Esta acción no se puede deshacer.`, () => {
    const index = AREAS_CAT.findIndex((item) => item.id === id);
    if (index >= 0) {
      AREAS_CAT.splice(index, 1);
    }

    delete AREAS_INFO[area.areaKey];
    delete TAREAS[area.areaKey];
    delete INCIDENCIAS[area.areaKey];

    asegurarColoresAreas();
    guardarEstadoPersistido();
    renderSidebar();
    go('areas');
    toast(`El área ${area.nom} se eliminó correctamente.`);
  });
}

function guardarEdicionArea(id) {
  const ok = validarCamposRequeridos(['editAreaNombre'], 'Ingresa el nombre del área.');
  if (!ok) return;

  const area = AREAS_CAT.find((item) => item.id === id);
  if (!area) return;

  area.nom = $('#editAreaNombre').value.trim();
  area.resp = $('#editAreaResponsable').value.trim() || 'Sin asignar';
  area.turno = $('#editAreaTurno').value;
  area.emp = Number($('#editAreaCapacidad').value) || 0;
  area.cls = normalizeAreaKey(area.nom) || area.cls;

  guardarEstadoPersistido();
  renderSidebar();
  go('detalleArea', id);
  toast('Cambios guardados con éxito.');
}

function toggleActivaArea(id, volver) {
  const area = AREAS_CAT.find((item) => item.id === id);
  if (!area) return;

  area.act = !area.act;
  guardarEstadoPersistido();
  go(volver === 'detalleArea' ? 'detalleArea' : 'areas', volver === 'detalleArea' ? id : areasPage);
  toast(`Área ${area.act ? 'activada' : 'desactivada'} correctamente.`);
}

function crearNuevaArea() {
  const nombre = $('#areaName')?.value?.trim();
  const responsable = $('#areaResponsable')?.value?.trim() || 'Sin asignar';
  const turno = $('#areaTurno')?.value?.trim() || 'Matutino';
  const capacidad = Number($('#areaCapacidad')?.value || 0);
  const descripcion = $('#areaDescripcion')?.value?.trim() || '';
  const color = $('#areaColor')?.value || randomAreaColor();
  const activa = $('#areaActiva') ? $('#areaActiva').checked : true;

  if (!nombre) {
    toast('Ingresa el nombre del área.', 'error');
    return;
  }

  const nextNumber = getNextAreaNumber();

  const areaKey = makeUniqueAreaKey(nombre, nextNumber);
  const nuevaArea = {
    id: `A-${String(nextNumber).padStart(2, '0')}`,
    nom: nombre,
    resp: responsable,
    emp: Number.isFinite(capacidad) ? capacidad : 0,
    act: activa,
    cls: normalizeAreaKey(nombre) || 'area',
    color,
    turno,
    descripcion,
    areaKey,
    workerUser: `tr${getNextWorkerNumber()}`
  };

  registrarAreaComoTrabajador(nuevaArea);
  AREAS_CAT.unshift(nuevaArea);
  asegurarColoresAreas();
  guardarEstadoPersistido();
  renderSidebar();
  go('detalleArea', nuevaArea.id);
  toast('Área creada correctamente y añadida al menú lateral.');
}
