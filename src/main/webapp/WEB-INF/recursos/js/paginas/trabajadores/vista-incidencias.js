/* Vista Incidencias (trabajador) — incidencias publicadas por el admin para el área del trabajador. */
let incidenciasWorkerPage = 0;
let incEstados = {};

function getEstadoIncidencia(areaKey, idx) {
  if (!incEstados[areaKey]) incEstados[areaKey] = [];
  if (incEstados[areaKey][idx] === undefined) {
    incEstados[areaKey][idx] = 'pend';
  }
  return incEstados[areaKey][idx];
}

function setEstadoIncidencia(areaKey, idx, estado) {
  if (!incEstados[areaKey]) incEstados[areaKey] = [];
  incEstados[areaKey][idx] = estado;
}

function tomarIncidencia(areaKey, idx) {
  setEstadoIncidencia(areaKey, idx, 'proc');
  go('incidencias');
  toast('Has tomado la incidencia.');
}

function resolverIncidencia(areaKey, idx) {
  setEstadoIncidencia(areaKey, idx, 'comp');
  go('incidencias');
  toast('Incidencia marcada como resuelta.');
}

function dejarIncidencia(areaKey, idx) {
  setEstadoIncidencia(areaKey, idx, 'pend');
  go('incidencias');
  toast('Has dejado la incidencia. Ahora está disponible para el equipo.');
}

function incRow(it, i, a) {
  const estado = getEstadoIncidencia(a.areaKey, i);
  const estadoLabel = estado === 'proc' ? 'En atención' : estado === 'comp' ? 'Resuelta' : 'Abierta';
  const acciones = estado === 'proc'
    ? `<button class="btn btn-sm" style="background:${a.color}; color:#fff" data-action="resolver-incidencia" data-area="${a.areaKey}" data-idx="${i}">Marcar resuelta</button>
       <button class="btn btn-ghost btn-sm" data-action="dejar-incidencia" data-area="${a.areaKey}" data-idx="${i}">Dejar incidencia</button>`
    : estado === 'comp'
      ? ''
      : `<button class="btn btn-sm" style="background:${a.color}; color:#fff" data-action="tomar-incidencia" data-area="${a.areaKey}" data-idx="${i}">Tomar incidencia</button>`;

  return `
    <div class="list-row ${a.cls}" style="border-left-color:${a.color || 'var(--marron)'}">
      <div class="grow">
        <div class="title">${it[0]} — ${it[1]}</div>
        <div class="meta">Gravedad asignada: <b>${it[2]}</b></div>
      </div>
      <span class="badge ${estado}">${estadoLabel}</span>
      <div class="flex gap-10">${acciones}</div>
    </div>`;
}

WORKER.incidencias = function (arg) {
  const a = getAreaInfo(session.area);
  const publicadas = getIncidenciasPublicadasArea(a.areaKey);
  const totalPaginas = Math.max(1, Math.ceil(publicadas.length / WORKER_PAGE_SIZE));
  incidenciasWorkerPage = (arg !== undefined && arg !== null) ? (parseInt(arg, 10) || 0) : 0;
  incidenciasWorkerPage = Math.min(Math.max(incidenciasWorkerPage, 0), totalPaginas - 1);
  const inicioIdx = incidenciasWorkerPage * WORKER_PAGE_SIZE;
  const rows = publicadas.slice(inicioIdx, inicioIdx + WORKER_PAGE_SIZE).map(({ it, i }) => incRow(it, i, a)).join('');
  return `
    <h1>Incidencias</h1>
    <p class="page-sub">Incidencias publicadas por el administrador para el área de ${a.label}.</p>
    <div class="stats">
      <div class="stat"><div class="n" style="color:${a.color}">6</div><div class="l">Total</div></div>
      <div class="stat"><div class="n" style="color:#a08b78">4</div><div class="l">Disponibles</div></div>
      <div class="stat"><div class="n" style="color:var(--verde-exito)">1</div><div class="l">Resueltas hoy</div></div>
    </div>
    <h2 class="mb">Incidencias de mi área</h2>
    <div id="incList">${rows || '<p class="muted">Aún no hay incidencias publicadas para tu área.</p>'}</div>
    ${publicadas.length ? paginacionWorkerHTML('incidencias', incidenciasWorkerPage, totalPaginas) : ''}`;
};
