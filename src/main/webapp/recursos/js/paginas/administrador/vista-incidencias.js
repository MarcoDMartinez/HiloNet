/* Vista Incidencias (admin) — registro interno de incidencias por área, con filtro por estado y paginación. */
let incidenciasPage = 0;
let incidenciasFiltro = 'todos';
const INCIDENCIAS_ADMIN_PAGE_SIZE = 5;
const INCIDENCIAS_ADMIN_FILTROS = [
  { key: 'todos', label: 'Todos' },
  { key: 'pend', label: 'Abierta' },
  { key: 'proc', label: 'En atención' },
  { key: 'comp', label: 'Resuelta' },
];

function rowIncidenciaHTML(x) {
  const r = x.r;
  return `
      <tr><td class="id">${r[0]}</td><td class="name">${r[1]}</td><td>${r[2]}</td>
      <td class="${r[3] === 'Sin asignar' ? 'muted' : ''}">${r[3]}</td>
      <td><span class="badge ${r[5]}">${r[6]}</span></td>
      <td><span class="badge ${x.estadoCls}">${r[4]}</span></td>
      <td class="flex gap-10">
        <button class="btn btn-primary btn-sm" data-toast="Cargando trazabilidad de la incidencia...">Ver detalle</button>
        <button class="btn btn-ghost btn-sm" data-toast="Estatus cambiado a: Resuelto">Resolver</button>
      </td></tr>`;
}

function adminIncidencias(arg) {
  const rows = [
    ['INC-001', 'Máquina overlock atascada', 'Costura', 'Marco D.', 'Abierta', 'alta', 'Alta'],
    ['INC-002', 'Tela denim fuera de stock', 'Corte', 'Lander B.', 'En atención', 'pend', 'Media'],
    ['INC-003', 'Error en patrón P-0019', 'Diseño', 'Sin asignar', 'Abierta', 'alta', 'Alta'],
    ['INC-004', 'Retraso entrega hilos', 'Costura', 'Merari N.', 'Resuelta', 'comp', 'Baja'],
    ['INC-005', 'Iluminación área de corte', 'Corte', 'Lander B.', 'Resuelta', 'comp', 'Baja']
  ];

  const rowsEstado = rows.map((r) => ({ r, estadoCls: r[4] === 'Resuelta' ? 'comp' : r[4] === 'En atención' ? 'proc' : 'pend' }));
  const rowsFiltradas = incidenciasFiltro === 'todos'
    ? rowsEstado
    : rowsEstado.filter((x) => x.estadoCls === incidenciasFiltro);

  const totalPaginas = Math.max(1, Math.ceil(rowsFiltradas.length / INCIDENCIAS_ADMIN_PAGE_SIZE));
  incidenciasPage = (arg !== undefined && arg !== null) ? (parseInt(arg, 10) || 0) : 0;
  incidenciasPage = Math.min(Math.max(incidenciasPage, 0), totalPaginas - 1);
  const inicio = incidenciasPage * INCIDENCIAS_ADMIN_PAGE_SIZE;
  const rowsPagina = rowsFiltradas.slice(inicio, inicio + INCIDENCIAS_ADMIN_PAGE_SIZE);

  // Contar incidencias sin publicar
  const filas = Object.entries(INCIDENCIAS).flatMap(([areaKey, lista]) =>
    lista.map((it, idx) => ({ areaKey, idx, publicada: isIncidenciaPublicada(areaKey, idx) }))
  );
  const sinPublicar = filas.filter(f => !f.publicada).length;

  return `
  <div class="flex between mb">
    <div><h1>Incidencias</h1>
    <p class="page-sub-zero">Registro y gestión de incidencias por área de trabajo.</p></div>
    <div class="flex gap-10">
      <button class="btn btn-primary" data-go="crearIncidencia">+ Nueva incidencia</button>
    </div>
  </div>
  <div class="stats">
    <div class="stat"><div class="n">8</div><div class="l">Total</div></div>
    <div class="stat"><div class="n" style="color:var(--rojo-error)">3</div><div class="l">Abiertas</div></div>
    <div class="stat"><div class="n" style="color:var(--azul-corte)">2</div><div class="l">En atención</div></div>
    <div class="stat"><div class="n" style="color:var(--verde-exito)">3</div><div class="l">Resueltas</div></div>
  </div>
  ${filtroPillsHTML('filtrar-incidencias', INCIDENCIAS_ADMIN_FILTROS, incidenciasFiltro)}
  <table class="table">
    <thead><tr><th>ID</th><th>Descripción</th><th>Área</th><th>Responsable</th><th>Prioridad</th><th>Estado</th><th>Acciones</th></tr></thead>
    <tbody>${rowsPagina.length ? rowsPagina.map(x => rowIncidenciaHTML(x)).join('') : `<tr><td colspan="7" class="muted">No hay incidencias con este filtro.</td></tr>`}</tbody>
  </table>
  ${paginacionHTML('incidencias', incidenciasPage, totalPaginas)}
  ${adminPublicarIncidenciasResumen(sinPublicar)}`;
}

function adminPublicarIncidencias(arg) {
  const filas = Object.entries(INCIDENCIAS).flatMap(([areaKey, lista]) =>
    lista.map((it, idx) => ({ areaKey, idx, id: it[0], desc: it[1], prioridad: it[2] }))
  );

  const totalPaginas = Math.max(1, Math.ceil(filas.length / INCIDENCIAS_ADMIN_PAGE_SIZE));
  const page = (arg !== undefined && arg !== null) ? (parseInt(arg, 10) || 0) : 0;
  const currentPage = Math.min(Math.max(page, 0), totalPaginas - 1);
  const inicio = currentPage * INCIDENCIAS_ADMIN_PAGE_SIZE;
  const filasPagina = filas.slice(inicio, inicio + INCIDENCIAS_ADMIN_PAGE_SIZE);

  return `
  <div class="flex between mb">
    <div><h1>Publicar incidencias</h1>
    <p class="page-sub-zero">Lista de incidencias recibidas desde el personal. Publícalas para que el área correspondiente las reciba.</p></div>
    <button class="btn btn-ghost" data-go="incidencias">← Volver a incidencia</button>
  </div>
  <table class="table">
    <thead><tr><th>ID</th><th>Descripción</th><th>Área</th><th>Prioridad</th><th>Estado</th><th>Acciones</th></tr></thead>
    <tbody>${filasPagina.map((f) => {
      const publicada = isIncidenciaPublicada(f.areaKey, f.idx);
      const areaInfo = getAreaInfo(f.areaKey);
      return `
        <tr>
          <td class="id">${f.id}</td>
          <td class="name">${f.desc}</td>
          <td><span class="badge area-${areaInfo.cls}">${areaInfo.label}</span></td>
          <td>${f.prioridad}</td>
          <td><span class="badge ${publicada ? 'activa' : 'pend'}">${publicada ? 'Publicada' : 'Sin publicar'}</span></td>
          <td>${publicada
            ? `<span class="small muted">Visible para ${areaInfo.label}</span>`
            : `<button class="btn btn-primary btn-sm" data-action="publicar-incidencia" data-area="${f.areaKey}" data-idx="${f.idx}">Publicar a ${areaInfo.label}</button>`}
          </td>
        </tr>`;
    }).join('')}</tbody>
  </table>
  ${paginacionHTML('publicarIncidencias', currentPage, totalPaginas)}`;
}

function adminPublicarIncidenciasResumen(sinPublicar) {
  if (sinPublicar === 0) return '';

  const filas = Object.entries(INCIDENCIAS).flatMap(([areaKey, lista]) =>
    lista.map((it, idx) => ({ areaKey, idx, id: it[0], desc: it[1], prioridad: it[2] }))
  );
  const noPublicadas = filas.filter(f => !isIncidenciaPublicada(f.areaKey, f.idx)).slice(0, 3);

  return `
  <div class="card mb" style="border-left: 4px solid var(--rojo-error); background: rgba(255, 70, 70, 0.08);">
    <div class="flex between align-center">
      <div style="flex: 1;">
        <div style="font-weight: 600; color: var(--rojo-error); margin-bottom: 8px;">⚠️ ${sinPublicar} incidencia${sinPublicar !== 1 ? 's' : ''} por publicar</div>
        <div style="font-size: 13px; color: #666; margin-bottom: 8px;">
          ${noPublicadas.map(f => `<div>• ${f.desc}</div>`).join('')}
          ${sinPublicar > 3 ? `<div>• Y ${sinPublicar - 3} más...</div>` : ''}
        </div>
      </div>
      <button class="btn btn-secondary" data-go="publicarIncidencias">Publicar incidencias</button>
    </div>
  </div>`;
}

ADMIN.incidencias = function (arg) { return adminIncidencias(arg); };
ADMIN.publicarIncidencias = function (arg) { return adminPublicarIncidencias(arg); };

ADMIN.crearIncidencia = function () {
  return `
  <h1>Registrar nueva incidencia</h1>
  <p class="page-sub">Reporta un problema crítico de un área de producción.</p>
  <button class="btn btn-ghost btn-sm mb" data-go="incidencias">← Volver</button>
  <div class="card" style="max-width:1000px">
    <div class="card-head">Datos de la incidencia</div>
    <div class="field"><label>Título de la incidencia *</label><input placeholder="Ej. Máquina overlock atascada"></div>
    <div class="field-row">
      <div class="field"><label>Área afectada *</label><select><option>Corte</option><option>Costura</option><option>Diseño</option></select></div>
      <div class="field"><label>Prioridad *</label><select><option>Alta</option><option>Media</option><option>Baja</option></select></div>
      <div class="field"><label>Pedido relacionado</label><select><option>Ninguno</option><option>P-0021</option><option>P-0023</option></select></div>
    </div>
    <div class="field"><label>Descripción del problema *</label><textarea placeholder="Describe el acontecimiento..."></textarea></div>
    <div class="flex gap-10">
      <button class="btn btn-ghost btn-lg btn-block" data-go="incidencias">Cancelar</button>
      <button class="btn btn-primary btn-lg btn-block" data-toast="Incidencia enviada al panel del supervisor" data-back="incidencias">Registrar incidencia</button>
    </div>
  </div>`;
};

function filtrarIncidenciasAdmin(filtro) {
  incidenciasFiltro = filtro;
  go('incidencias', 0);
}
