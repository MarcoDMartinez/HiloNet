/* Vista Incidencias (admin) — registro interno y publicación de incidencias por área, todo en una sola vista con pestañas. */
let incidenciasTab = 'registro';
let incidenciasPage = 0;
let incidenciasFiltro = 'todos';
let publicarPage = 0;
let publicarFiltroArea = 'todos';
let publicarFiltroEstado = 'todos';
const INCIDENCIAS_ADMIN_PAGE_SIZE = 5;
const INCIDENCIAS_ADMIN_FILTROS = [
  { key: 'todos', label: 'Todos' },
  { key: 'pend', label: 'Abierta' },
  { key: 'proc', label: 'En atención' },
  { key: 'comp', label: 'Resuelta' },
];
const PUBLICAR_FILTROS_ESTADO = [
  { key: 'todos', label: 'Todas' },
  { key: 'pendientes', label: 'Sin publicar' },
  { key: 'publicadas', label: 'Publicadas' },
];

const INCIDENCIAS_ADMIN_DATA = [
  {
    id: 'INC-001',
    descripcion: 'Falta de tela para completar el pedido P-0021',
    area: 'Corte',
    responsable: 'Marco D.',
    estado: 'Abierta',
    prioridad: 'Alta',
    prioridadCls: 'alta',
    estadoCls: 'pend',
    fecha: '14/07/2026',
    pedido: 'P-0021',
    categoria: 'Material',
    detalles: 'El pedido llegó a corte sin suficiente material para terminar la pieza principal y no puede seguir el proceso.',
    acciones: ['Confirmar el stock faltante con almacén', 'Solicitar reposición urgente', 'Reprogramar el turno de corte para priorizar esta orden'],
    seguimiento: ['08:15 · Reportada por el supervisor de corte.', '09:00 · Se solicitó apoyo al almacén.']
  },
  {
    id: 'INC-002',
    descripcion: 'Retraso en área de costura para entrega programada',
    area: 'Costura',
    responsable: 'Lander B.',
    estado: 'En atención',
    prioridad: 'Media',
    prioridadCls: 'pend',
    estadoCls: 'proc',
    fecha: '13/07/2026',
    pedido: 'P-0018',
    categoria: 'Producción',
    resumen: 'La costura no ha terminado la orden a tiempo y la transferencia al siguiente proceso está comprometida.',
    detalles: 'Retrasa la entrega del pedido P-0018 y pone en riesgo la programación del siguiente turno.',
    acciones: ['Reasignar personal a la línea crítica', 'Priorizar el pedido en la agenda de producción', 'Coordinar con calidad una revisión rápida'],
    seguimiento: ['10:20 · Detectado por planeación.', '11:05 · Se activó una revisión de prioridad.']
  },
  {
    id: 'INC-003',
    descripcion: 'Falta de botones para el pedido P-0019',
    area: 'Diseño',
    responsable: 'Sin asignar',
    estado: 'Abierta',
    prioridad: 'Alta',
    prioridadCls: 'alta',
    estadoCls: 'pend',
    fecha: '12/07/2026',
    pedido: 'P-0019',
    categoria: 'Insumo',
    resumen: 'No se cuenta con los botones requeridos para cerrar la muestra final del pedido.',
    detalles: 'Impide avanzar en la validación del pedido y retrasa la aprobación para producción.',
    acciones: ['Verificar el proveedor del insumo', 'Solicitar entrega de emergencia', 'Actualizar la fecha de liberación del pedido'],
    seguimiento: ['14:40 · Reportada desde calidad.', '15:10 · Pendiente de asignación.']
  },
  {
    id: 'INC-004',
    descripcion: 'Atraso en entrega de hilos para costura',
    area: 'Costura',
    responsable: 'Merari N.',
    estado: 'Resuelta',
    prioridad: 'Baja',
    prioridadCls: 'comp',
    estadoCls: 'comp',
    fecha: '11/07/2026',
    pedido: 'P-0023',
    categoria: 'Logística',
    resumen: 'La entrega de hilos de refuerzo llegó con retraso, pero ya se resolvió con el proveedor.',
    detalles: 'El turno se recuperó y el pedido pudo avanzar sin perder la fecha comprometida.',
    acciones: ['Confirmar stock disponible', 'Registrar el ajuste de entrega', 'Monitorear la próxima orden'],
    seguimiento: ['09:30 · Se recibió la reposición.', '10:00 · Se cerró la incidencia.']
  },
  {
    id: 'INC-005',
    descripcion: 'Demora en área de corte por falta de supervisión',
    area: 'Corte',
    responsable: 'Lander B.',
    estado: 'Resuelta',
    prioridad: 'Baja',
    prioridadCls: 'comp',
    estadoCls: 'comp',
    fecha: '10/07/2026',
    pedido: 'Sin pedido',
    categoria: 'Operación',
    resumen: 'La línea de corte presentó una demora por falta de coordinación en la carga del turno.',
    detalles: 'Se restableció la continuidad del proceso y no se reportaron afectaciones mayores.',
    acciones: ['Confirmar el paso de turno', 'Definir responsable de asignación', 'Revisar el plan diario de corte'],
    seguimiento: ['07:00 · Reportada por planeación.', '07:40 · Se normalizó la operación.']
  }
];

function getIncidenciaAdminById(id) {
  return INCIDENCIAS_ADMIN_DATA.find((inc) => inc.id === id) || INCIDENCIAS_ADMIN_DATA[0];
}

function rowIncidenciaHTML(x) {
  return `
      <tr>
        <td class="id">${x.id}</td>
        <td class="name">${x.descripcion}</td>
        <td>${x.area}</td>
        <td class="${x.responsable === 'Sin asignar' ? 'muted' : ''}">${x.responsable}</td>
        <td><span class="badge ${x.prioridadCls}">${x.prioridad}</span></td>
        <td><span class="badge ${x.estadoCls}">${x.estado}</span></td>
        <td class="flex gap-10">
          <button class="btn btn-primary btn-sm" data-go="detalleIncidencia" data-arg="${x.id}">Ver detalle</button>
        </td>
      </tr>`;
}

function buildIncidenciasArg(tab, page) {
  return `${tab}:${page}`;
}

function parseIncidenciasArg(arg) {
  if (arg === undefined || arg === null) return null;
  const [tab, pageStr] = String(arg).split(':');
  return { tab: tab === 'publicar' ? 'publicar' : 'registro', page: parseInt(pageStr, 10) || 0 };
}

function paginacionIncidenciasHTML(tab, page, totalPaginas) {
  return `
    <div class="flex between mt">
      <button class="btn btn-ghost btn-sm" data-go="incidencias" data-arg="${buildIncidenciasArg(tab, page - 1)}" ${page === 0 ? 'disabled' : ''}>← Anterior</button>
      <span class="small sec">Página ${page + 1} de ${totalPaginas}</span>
      <button class="btn btn-ghost btn-sm" data-go="incidencias" data-arg="${buildIncidenciasArg(tab, page + 1)}" ${page >= totalPaginas - 1 ? 'disabled' : ''}>Siguiente →</button>
    </div>`;
}

function adminIncidencias(arg) {
  const parsed = parseIncidenciasArg(arg);
  if (parsed) {
    incidenciasTab = parsed.tab;
    if (incidenciasTab === 'registro') incidenciasPage = parsed.page;
    else publicarPage = parsed.page;
  }

  return `
  <div class="flex between mb">
    <div><h1>Incidencias</h1>
    <p class="page-sub-zero">Registro y gestión de incidencias por área de trabajo.</p></div>
    <button class="btn btn-primary" data-go="crearIncidencia">+ Nueva incidencia</button>
  </div>
  ${incidenciasTab === 'registro' ? renderRegistroIncidencias() : renderPublicarIncidencias()}`;
}

function tabsIncidenciasHTML() {
  const sinPublicar = countIncidenciasSinPublicar();
  return `
  <div class="pill-tabs-zero" style="padding-bottom:14px; margin-bottom:20px; border-bottom:1px solid var(--borde);">
    <span class="pill ${incidenciasTab === 'registro' ? 'active' : ''}" data-action="cambiar-tab-incidencias" data-tab="registro">Registro interno</span>
    <span class="pill ${incidenciasTab === 'publicar' ? 'active' : ''}" data-action="cambiar-tab-incidencias" data-tab="publicar">Publicar incidencias${sinPublicar ? ` (${sinPublicar})` : ''}</span>
  </div>`;
}

function cambiarTabIncidencias(tab) {
  incidenciasTab = tab === 'publicar' ? 'publicar' : 'registro';
  const page = incidenciasTab === 'registro' ? incidenciasPage : publicarPage;
  go('incidencias', buildIncidenciasArg(incidenciasTab, page));
}

function renderRegistroIncidencias() {
  const rows = INCIDENCIAS_ADMIN_DATA.map((inc) => ({ ...inc }));
  const rowsFiltradas = incidenciasFiltro === 'todos'
    ? rows
    : rows.filter((x) => x.estadoCls === incidenciasFiltro);

  const totalPaginas = Math.max(1, Math.ceil(rowsFiltradas.length / INCIDENCIAS_ADMIN_PAGE_SIZE));
  incidenciasPage = Math.min(Math.max(incidenciasPage, 0), totalPaginas - 1);
  const inicio = incidenciasPage * INCIDENCIAS_ADMIN_PAGE_SIZE;
  const rowsPagina = rowsFiltradas.slice(inicio, inicio + INCIDENCIAS_ADMIN_PAGE_SIZE);
  const abiertas = rows.filter((x) => x.estadoCls === 'pend').length;
  const enAtencion = rows.filter((x) => x.estadoCls === 'proc').length;
  const resueltas = rows.filter((x) => x.estadoCls === 'comp').length;

  return `
  <div class="stats">
    <div class="stat"><div class="n">${rows.length}</div><div class="l">Total</div></div>
    <div class="stat"><div class="n" style="color:var(--rojo-error)">${abiertas}</div><div class="l">Abiertas</div></div>
    <div class="stat"><div class="n" style="color:var(--azul-corte)">${enAtencion}</div><div class="l">En atención</div></div>
    <div class="stat"><div class="n" style="color:var(--verde-exito)">${resueltas}</div><div class="l">Resueltas</div></div>
  </div>
  ${tabsIncidenciasHTML()}
  ${filtroPillsHTML('filtrar-incidencias', INCIDENCIAS_ADMIN_FILTROS, incidenciasFiltro)}
  <table class="table">
    <thead><tr><th>ID</th><th>Descripción</th><th>Área</th><th>Responsable</th><th>Prioridad</th><th>Estado</th><th>Acciones</th></tr></thead>
    <tbody>${rowsPagina.length ? rowsPagina.map(x => rowIncidenciaHTML(x)).join('') : `<tr><td colspan="7" class="muted">No hay incidencias con este filtro.</td></tr>`}</tbody>
  </table>
  ${paginacionIncidenciasHTML('registro', incidenciasPage, totalPaginas)}`;
}

function adminDetalleIncidencia(id) {
  const inc = getIncidenciaAdminById(id);
  return `
  <div class="crumb">Incidencias › <b>${inc.id}</b></div>
  <button class="btn btn-ghost btn-sm mb" data-go="incidencias">← Volver</button>
  <div class="card" style="max-width:1100px">
    <div class="flex between" style="align-items:flex-start; gap:16px; flex-wrap:wrap;">
      <div>
        <h1 style="margin:0 0 6px; font-family:inherit;">${inc.descripcion}</h1>
        <p class="page-sub-zero" style="margin:0;">${inc.resumen}</p>
      </div>
      <div class="flex gap-10" style="flex-wrap:wrap;">
        <span class="badge ${inc.estadoCls}">${inc.estado}</span>
        <span class="badge ${inc.prioridadCls}">${inc.prioridad}</span>
      </div>
    </div>
    <div class="stats" style="margin-top:18px;">
      <div class="stat"><div class="n">${inc.id}</div><div class="l">Código</div></div>
      <div class="stat"><div class="n">${inc.area}</div><div class="l">Área</div></div>
      <div class="stat"><div class="n">${inc.fecha}</div><div class="l">Fecha</div></div>
      <div class="stat"><div class="n">${inc.pedido}</div><div class="l">Pedido</div></div>
    </div>
    <div class="card-head" style="font-family:inherit;">Detalle operativo</div>
    <div class="field-row">
      <div class="field"><label>Responsable</label><input value="${inc.responsable}" disabled></div>
      <div class="field"><label>Categoría</label><input value="${inc.categoria}" disabled></div>
    </div>
    <div class="field"><label>Detalles</label><textarea disabled>${inc.detalles}</textarea></div>
    <div class="field"><label>Acciones recomendadas</label>
      <ul style="margin:8px 0 0 18px; padding:0; color:var(--texto-sec); font-size:13px; line-height:1.6;">${inc.acciones.map((accion) => `<li>${accion}</li>`).join('')}</ul>
    </div>
    <div class="field"><label>Seguimiento</label>
      <ul style="margin:8px 0 0 18px; padding:0; color:var(--texto-sec); font-size:13px; line-height:1.6;">${inc.seguimiento.map((item) => `<li>${item}</li>`).join('')}</ul>
    </div>
    <div class="field"><label>Estado</label>
      <select id="incEstado">${['Abierta', 'En atención', 'Resuelta'].map((estado) => `<option${estado === inc.estado ? ' selected' : ''}>${estado}</option>`).join('')}</select>
    </div>
    <div class="field"><label>Nueva nota de seguimiento</label><textarea id="incNuevaNota" placeholder="Describe la actualización..."></textarea></div>
    <div class="flex gap-10">
      <button class="btn btn-ghost btn-lg btn-block" data-go="incidencias">Cancelar</button>
      <button type="button" class="btn btn-primary btn-lg btn-block" data-action="guardar-seguimiento-incidencia" data-arg="${id}">Guardar seguimiento</button>
    </div>
  </div>`;
}

function estadoIncidenciaBadgeCls(estado) {
  if (estado === 'Resuelta') return 'comp';
  if (estado === 'En atención') return 'proc';
  return 'pend';
}

function guardarSeguimientoIncidencia(id) {
  const inc = getIncidenciaAdminById(id);
  const estadoSelect = $('#incEstado');
  const notaInput = $('#incNuevaNota');
  if (!inc || !estadoSelect) return;

  inc.estado = estadoSelect.value;
  inc.estadoCls = estadoIncidenciaBadgeCls(inc.estado);

  const nota = notaInput ? notaInput.value.trim() : '';
  if (nota) {
    const hora = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    inc.seguimiento.push(`${hora} · ${nota}`);
  }

  go('incidencias');
  toast('Se actualizó la trazabilidad de la incidencia.');
}

function prioridadBadgeCls(prioridad) {
  if (prioridad === 'Alta') return 'alta';
  if (prioridad === 'Baja') return 'comp';
  return 'pend';
}

function getFilasPublicar() {
  return Object.entries(INCIDENCIAS).flatMap(([areaKey, lista]) =>
    lista.map((it, idx) => ({ areaKey, idx, id: it[0], desc: it[1], prioridad: it[2], publicada: isIncidenciaPublicada(areaKey, idx) }))
  );
}

function getFilasPublicarFiltradas() {
  let filas = getFilasPublicar();
  if (publicarFiltroArea !== 'todos') filas = filas.filter((f) => f.areaKey === publicarFiltroArea);
  if (publicarFiltroEstado === 'pendientes') filas = filas.filter((f) => !f.publicada);
  else if (publicarFiltroEstado === 'publicadas') filas = filas.filter((f) => f.publicada);
  return filas;
}

function renderPublicarIncidencias() {
  const areasFiltro = [{ key: 'todos', label: 'Todas las áreas' }, ...AREAS_CAT.map((a) => ({ key: a.areaKey, label: a.nom }))];
  const todas = getFilasPublicar();
  const totalGeneral = todas.length;
  const sinPublicarGeneral = todas.filter((f) => !f.publicada).length;
  const publicadasGeneral = totalGeneral - sinPublicarGeneral;

  const filas = getFilasPublicarFiltradas();
  const totalPaginas = Math.max(1, Math.ceil(filas.length / INCIDENCIAS_ADMIN_PAGE_SIZE));
  publicarPage = Math.min(Math.max(publicarPage, 0), totalPaginas - 1);
  const inicio = publicarPage * INCIDENCIAS_ADMIN_PAGE_SIZE;
  const filasPagina = filas.slice(inicio, inicio + INCIDENCIAS_ADMIN_PAGE_SIZE);

  return `
  <p class="page-sub-zero mb">Incidencias reportadas por el personal de cada área. Publícalas para que el equipo correspondiente las reciba.</p>
  <div class="stats">
    <div class="stat"><div class="n">${totalGeneral}</div><div class="l">Total registradas</div></div>
    <div class="stat"><div class="n" style="color:var(--rojo-error)">${sinPublicarGeneral}</div><div class="l">Sin publicar</div></div>
    <div class="stat"><div class="n" style="color:var(--verde-exito)">${publicadasGeneral}</div><div class="l">Publicadas</div></div>
  </div>
  ${tabsIncidenciasHTML()}
  ${filtroPillsHTML('filtrar-publicar-area', areasFiltro, publicarFiltroArea)}
  <table class="table">
    <thead><tr><th>ID</th><th>Descripción</th><th>Área</th><th>Prioridad</th><th>Estado</th><th>Acciones</th></tr></thead>
    <tbody>${filasPagina.length ? filasPagina.map((f) => {
      const areaInfo = getAreaInfo(f.areaKey);
      return `
        <tr>
          <td class="id">${f.id}</td>
          <td class="name">${f.desc}</td>
          <td><span class="badge area-${areaInfo.cls}">${areaInfo.label}</span></td>
          <td><span class="badge ${prioridadBadgeCls(f.prioridad)}">${f.prioridad}</span></td>
          <td><span class="badge ${f.publicada ? 'activa' : 'pend'}">${f.publicada ? 'Publicada' : 'Sin publicar'}</span></td>
          <td>${f.publicada
            ? `<span class="small muted">Visible para ${areaInfo.label}</span>`
            : `<button class="btn btn-primary btn-sm" data-action="publicar-incidencia" data-area="${f.areaKey}" data-idx="${f.idx}">Publicar a ${areaInfo.label}</button>`}
          </td>
        </tr>`;
    }).join('') : `<tr><td colspan="6" class="muted">No hay incidencias con este filtro.</td></tr>`}</tbody>
  </table>
  ${filtroPillsHTML('filtrar-publicar-estado', PUBLICAR_FILTROS_ESTADO, publicarFiltroEstado)}
  ${paginacionIncidenciasHTML('publicar', publicarPage, totalPaginas)}`;
}

function filtrarPublicarArea(area) {
  publicarFiltroArea = area;
  go('incidencias', buildIncidenciasArg('publicar', 0));
}

function filtrarPublicarEstado(estado) {
  publicarFiltroEstado = estado;
  go('incidencias', buildIncidenciasArg('publicar', 0));
}

ADMIN.incidencias = function (arg) { return adminIncidencias(arg); };
ADMIN.detalleIncidencia = function (arg) { return adminDetalleIncidencia(arg); };

ADMIN.crearIncidencia = function () {
  return `
  <h1>Registrar nueva incidencia</h1>
  <p class="page-sub">Reporta un problema crítico de un área de producción.</p>
  <button class="btn btn-ghost btn-sm mb" data-go="incidencias">← Volver</button>
  <div class="card" style="max-width:1000px">
    <div class="card-head">Datos de la incidencia</div>
    <div class="field"><label>Título de la incidencia *</label><input id="incTitulo" placeholder="Ej. Máquina overlock atascada"></div>
    <div class="field-row">
      <div class="field"><label>Área afectada *</label><select id="incArea"><option>Corte</option><option>Costura</option><option>Diseño</option></select></div>
      <div class="field"><label>Prioridad *</label><select id="incPrioridad"><option>Alta</option><option>Media</option><option>Baja</option></select></div>
      <div class="field"><label>Pedido relacionado</label><select id="incPedido"><option>Ninguno</option><option>P-0021</option><option>P-0023</option></select></div>
    </div>
    <div class="field"><label>Descripción del problema *</label><textarea id="incDescripcion" placeholder="Describe el acontecimiento..."></textarea></div>
    <div class="flex gap-10">
      <button class="btn btn-ghost btn-lg btn-block" data-go="incidencias">Cancelar</button>
      <button type="button" class="btn btn-primary btn-lg btn-block" id="btnCreateIncidencia">Registrar incidencia</button>
    </div>
  </div>`;
};

function crearNuevaIncidenciaDesdeFormulario() {
  const ok = validarCamposRequeridos(
    ['incTitulo', 'incArea', 'incPrioridad', 'incDescripcion'],
    'Completa los campos obligatorios: título, área afectada, prioridad y descripción del problema.'
  );
  if (!ok) return;

  const prioridad = $('#incPrioridad').value;
  const nuevaIncidencia = {
    id: `INC-${String(INCIDENCIAS_ADMIN_DATA.length + 1).padStart(3, '0')}`,
    descripcion: $('#incTitulo').value.trim(),
    area: $('#incArea').value,
    responsable: 'Sin asignar',
    estado: 'Abierta',
    prioridad,
    prioridadCls: prioridadBadgeCls(prioridad),
    estadoCls: 'pend',
    fecha: new Date().toLocaleDateString('es-MX'),
    pedido: $('#incPedido').value,
    categoria: 'General',
    resumen: $('#incDescripcion').value.trim(),
    detalles: $('#incDescripcion').value.trim(),
    acciones: [],
    seguimiento: []
  };

  INCIDENCIAS_ADMIN_DATA.unshift(nuevaIncidencia);
  go('incidencias');
  toast(`Incidencia ${nuevaIncidencia.id} enviada al panel del supervisor.`);
}

function filtrarIncidenciasAdmin(filtro) {
  incidenciasFiltro = filtro;
  go('incidencias', buildIncidenciasArg('registro', 0));
}
