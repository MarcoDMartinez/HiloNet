/* Vista Inicio (trabajador) — tareas asignadas al área, con opción de tomar/completar/dejar cada una. */
let inicioPage = 0;
let tareaEstados = {};

function getEstadoTarea(areaKey, idx) {
  if (!tareaEstados[areaKey]) tareaEstados[areaKey] = [];
  if (tareaEstados[areaKey][idx] === undefined) {
    tareaEstados[areaKey][idx] = idx === 0 ? 'proc' : 'pend';
  }
  return tareaEstados[areaKey][idx];
}

function setEstadoTarea(areaKey, idx, estado) {
  if (!tareaEstados[areaKey]) tareaEstados[areaKey] = [];
  tareaEstados[areaKey][idx] = estado;
}

function tomarTarea(areaKey, idx) {
  setEstadoTarea(areaKey, idx, 'proc');
  go('inicio');
  toast('Has tomado la tarea correctamente.');
}

function completarTarea(areaKey, idx) {
  setEstadoTarea(areaKey, idx, 'comp');
  go('inicio');
  toast('Tarea marcada como completada.');
}

function dejarTarea(areaKey, idx) {
  setEstadoTarea(areaKey, idx, 'pend');
  go('inicio');
  toast('Has dejado la tarea. Ahora está disponible para el equipo.');
}

function taskRow(task, i, a) {
  const estado = getEstadoTarea(a.areaKey, i);
  const estadoLabel = estado === 'proc' ? 'En proceso' : estado === 'comp' ? 'Completada' : 'Pendiente';
  const acciones = estado === 'proc'
    ? `<button class="btn btn-sm" style="background:${a.color}; color:#fff" data-action="completar-tarea" data-area="${a.areaKey}" data-idx="${i}">Marcar completada</button>
       <button class="btn btn-ghost btn-sm" data-action="dejar-tarea" data-area="${a.areaKey}" data-idx="${i}">Dejar tarea</button>`
    : estado === 'comp'
      ? ''
      : `<button class="btn btn-sm" style="background:${a.color}; color:#fff" data-action="tomar-tarea" data-area="${a.areaKey}" data-idx="${i}">Tomar tarea</button>`;

  return `
    <div class="list-row ${a.cls}" style="border-left-color:${a.color || 'var(--marron)'}">
      <div class="grow">
        <div class="title">${task[0]}</div>
        <div class="meta">${task[1]} · ${a.label}</div>
      </div>
      <span class="badge ${estado}">${estadoLabel}</span>
      <div class="flex gap-10">${acciones}</div>
    </div>`;
}

WORKER.inicio = function (arg) {
  const a = getAreaInfo(session.area), t = getAreaTasks(session.area);
  const totalPaginas = Math.max(1, Math.ceil(t.length / WORKER_PAGE_SIZE));
  inicioPage = (arg !== undefined && arg !== null) ? (parseInt(arg, 10) || 0) : 0;
  inicioPage = Math.min(Math.max(inicioPage, 0), totalPaginas - 1);
  const inicioIdx = inicioPage * WORKER_PAGE_SIZE;
  const rows = t.slice(inicioIdx, inicioIdx + WORKER_PAGE_SIZE).map((task, i) => taskRow(task, inicioIdx + i, a)).join('');
  return `
    <h1>¡Hola, ${a.worker.split(' ')[0]}!</h1>
    <div class="stats">
      <div class="stat"><div class="n" style="color:${a.color}">2</div><div class="l">Actividades pendientes</div></div>
      <div class="stat"><div class="n" style="color:${a.color}">1</div><div class="l">Incidencias abiertas</div></div>
      <div class="stat"><div class="n" style="color:${a.color}">3</div><div class="l">Pedidos activos</div></div>
    </div>
    <h2>Tareas de mi área</h2>
    <p class="page-sub">Estas son las actividades asignadas al área de ${a.label}.</p>
    <div id="taskList">${rows || '<p class="muted">No hay tareas asignadas.</p>'}</div>
    ${paginacionWorkerHTML('inicio', inicioPage, totalPaginas)}`;
};
