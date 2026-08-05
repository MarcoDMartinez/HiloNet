/* Vista Áreas (admin) — catálogo de áreas con filtro/paginación, alta, edición y detalle con empleados asignados. */
let areasPage = 0;
let areasFiltro = 'todos';
const AREAS_PAGE_SIZE = 5;
const AREAS_FILTROS = [
  { key: 'todos', label: 'Todos' },
  { key: 'activa', label: 'Activa' },
  { key: 'inactiva', label: 'Inactiva' },
];

function rowAreaHTML(a) {
  const puedeEliminar = !['A-01', 'A-02', 'A-03'].includes(a.id);
  return `
        <tr>
          <td class="id">${a.id}</td><td class="name">${a.nom}</td>
          <td class="${a.resp === 'Sin asignar' ? 'muted' : ''}">${a.resp}</td>
          <td class="sec">${a.emp} empleados</td>
          <td><span class="badge ${a.act ? 'activa' : 'inactiva'}">${a.act ? 'Activa' : 'Inactiva'}</span></td>
          <td class="flex gap-10">
            <button class="btn btn-primary btn-sm" data-go="detalleArea" data-arg="${a.id}">Ver detalle</button>
            ${puedeEliminar ? `<button class="btn btn-danger btn-sm" data-action="delete-area" data-area-id="${a.id}">Eliminar</button>` : ''}
            <button class="btn btn-ghost btn-sm" data-action="toggle-area" data-area-id="${a.id}" data-volver="areas">${a.act ? 'Desactivar' : 'Activar'}</button>
          </td>
        </tr>`;
}

ADMIN.areas = function (arg) {
  const areasFiltradas = areasFiltro === 'todos'
    ? AREAS_CAT
    : AREAS_CAT.filter((a) => (areasFiltro === 'activa' ? a.act : !a.act));

  const totalPaginas = Math.max(1, Math.ceil(areasFiltradas.length / AREAS_PAGE_SIZE));
  areasPage = (arg !== undefined && arg !== null) ? (parseInt(arg, 10) || 0) : 0;
  areasPage = Math.min(Math.max(areasPage, 0), totalPaginas - 1);
  const inicio = areasPage * AREAS_PAGE_SIZE;
  const areasPagina = areasFiltradas.slice(inicio, inicio + AREAS_PAGE_SIZE);

  return `
    <div class="flex between mb">
      <div><h1>Áreas de la empresa</h1>
      <p class="page-sub-zero">Catálogo de áreas de producción. Módulo independiente.</p></div>
      <button class="btn btn-primary" data-go="crearArea">+ Crear nueva área</button>
    </div>
    <div class="stats">
      <div class="stat"><div class="n" style="color:var(--verde-exito)">5</div><div class="l">Áreas activas</div></div>
      <div class="stat"><div class="n" style="color:var(--texto-tenue)">1</div><div class="l">Áreas inactivas</div></div>
      <div class="stat"><div class="n" style="color:var(--marron)">24</div><div class="l">Empleados totales</div></div>
    </div>
    ${filtroPillsHTML('filtrar-areas', AREAS_FILTROS, areasFiltro)}
    <table class="table">
      <thead><tr><th>ID</th><th>Nombre del área</th><th>Responsable</th><th>Empleados</th><th>Estado</th><th>Acciones</th></tr></thead>
      <tbody>${areasPagina.length ? areasPagina.map(a => rowAreaHTML(a)).join('') : `<tr><td colspan="6" class="muted">No hay áreas con este filtro.</td></tr>`}</tbody>
    </table>
    ${paginacionHTML('areas', areasPage, totalPaginas)}`;
};

ADMIN.detalleArea = function (id) {
  const a = AREAS_CAT.find(x => x.id === id) || AREAS_CAT[1];
  const empleadosArea = USUARIOS.filter((u) => u.area === a.nom);
  const areaColor = a.color || '#999';
  return `
    <div class="crumb">Áreas › <b>${a.id} · ${a.nom}</b></div>
    <button class="btn btn-ghost btn-sm mb" data-go="areas">← Volver</button>
    <div class="card" style="border-left:6px solid ${areaColor};">
      <div class="flex between">
        <div>
          <div class="flex"><span class="area-dot-lg" style="background:${areaColor}"></span><h1>${a.nom}</h1>
          <span class="badge proc">${a.id}</span><span class="badge ${a.act ? 'activa' : 'inactiva'}">${a.act ? 'Activa' : 'Inactiva'}</span></div>
          <p class="sec mt">Responsable: ${a.resp} · ${empleadosArea.length} empleados asignados · Turno ${(a.turno || 'Matutino').toLowerCase()}</p>
        </div>
        <div class="flex gap-10">
          <button class="btn btn-ghost" data-go="editarArea" data-arg="${a.id}">Editar área</button>
          <button class="btn btn-danger" data-action="toggle-area" data-area-id="${a.id}" data-volver="detalleArea">${a.act ? 'Desactivar' : 'Activar'}</button>
        </div>
      </div>
    </div>
    <div class="flex between mb">
      <h2>Empleados asignados</h2>
      <button type="button" class="btn btn-blue" data-action="vincular-empleado" data-area-id="${a.id}">+ Vincular empleado</button>
    </div>
    <table class="table">
      <thead><tr><th>ID</th><th>Nombre</th><th>Usuario</th><th>Puesto</th><th>Acciones</th></tr></thead>
      <tbody>${empleadosArea.length ? empleadosArea.map(e => `
        <tr>
          <td class="id">${e.id}</td><td class="name">${e.nom}</td><td class="sec">${e.user}</td><td class="sec">${e.puesto || '—'}</td>
          <td class="flex gap-10">
            <button class="btn btn-ghost btn-sm" data-go="perfilEmpleado" data-arg="${e.id}">Ver perfil</button>
            <button class="btn btn-danger btn-sm" data-action="quitar-empleado-area" data-arg="${e.id}" data-area-id="${a.id}">Quitar</button>
          </td>
        </tr>`).join('') : `<tr><td colspan="5" class="muted">No hay empleados asignados a esta área.</td></tr>`}</tbody>
    </table>`;
};

function abrirVincularEmpleado(areaId) {
  const area = AREAS_CAT.find((x) => x.id === areaId);
  if (!area) return;
  const candidatos = USUARIOS.filter((u) => u.rol !== 'Administrador' && u.area !== area.nom);

  const overlay = $('#overlay');
  const modal = $('#modal');
  modal.innerHTML = `
    <button class="close" id="closeModal">×</button>
    <h2>Vincular empleado a ${area.nom}</h2>
    <p class="sec mt">Selecciona un empleado para asignarlo a esta área.</p>
    <div class="mt">
      ${candidatos.length ? candidatos.map((u) => `
        <div class="list-row mt">
          <div class="grow"><div class="title">${u.nom}</div><div class="meta">${u.user} · Actualmente en ${u.area}</div></div>
          <button type="button" class="btn btn-primary btn-sm" data-action="confirmar-vincular-empleado" data-arg="${u.id}" data-area-id="${area.id}">Vincular</button>
        </div>`).join('') : `<p class="muted mt">No hay empleados disponibles para vincular.</p>`}
    </div>`;
  overlay.classList.add('open');
  $('#closeModal').onclick = () => overlay.classList.remove('open');
}

function confirmarVincularEmpleado(userId, areaId) {
  const u = USUARIOS.find((x) => x.id === userId);
  const area = AREAS_CAT.find((x) => x.id === areaId);
  if (!u || !area) return;

  u.area = area.nom;
  guardarEstadoPersistido();
  $('#overlay').classList.remove('open');
  go('detalleArea', areaId);
  toast(`${u.nom} fue vinculado al área ${area.nom}.`);
}

function quitarEmpleadoDeArea(userId, areaId) {
  const u = USUARIOS.find((x) => x.id === userId);
  if (!u) return;

  const areaAnterior = u.area;
  u.area = 'Sin asignar';
  guardarEstadoPersistido();
  go('detalleArea', areaId);
  toast(`${u.nom} fue desvinculado del área ${areaAnterior}.`);
}

ADMIN.crearArea = function () {
  return `
    <div class="flex between mb">
      <div>
        <h1>Crear nueva área</h1>
        <p class="page-sub">Da de alta un área de producción en el catálogo de la empresa.</p>
      </div>
      <button class="btn btn-ghost btn-sm" data-go="areas">← Volver</button>
    </div>
    <div class="row">
      <div class="card" style="flex:1; min-width:360px; max-width:760px;">
        <div class="card-head">Datos del área</div>
        <div class="field-row">
          <div class="field"><label>Nombre del área *</label><input id="areaName" placeholder="Ej. Bordado"></div>
          <div class="field" style="max-width:140px"><label>ID (auto)</label><input value="${getNextAreaNumber()}" disabled></div>
        </div>
        <div class="field"><label>Responsable del área</label>
          <select id="areaResponsable"><option>Sin asignar</option><option>Ana P.</option><option>Marco D.</option><option>Lander B.</option></select>
        </div>
        <div class="field-row">
          <div class="field" style="flex:1"><label>Turno</label><select id="areaTurno"><option>Matutino</option><option>Vespertino</option></select></div>
          <div class="field" style="flex:1"><label>Capacidad de empleados</label><input id="areaCapacidad" placeholder="Ej. 8"></div>
        </div>
        <div class="field"><label>Color de identificación</label>
          <div class="color-grid" id="areaColorGrid">
            <button type="button" class="color-swatch selected" data-color="#4a6fa5" style="background:#4a6fa5;"></button>
            <button type="button" class="color-swatch" data-color="#7a5c44" style="background:#7a5c44;"></button>
            <button type="button" class="color-swatch" data-color="#5a7a4a" style="background:#5a7a4a;"></button>
            <button type="button" class="color-swatch" data-color="#b77d4a" style="background:#b77d4a;"></button>
            <button type="button" class="color-swatch" data-color="#d46f5f" style="background:#d46f5f;"></button>
            <button type="button" class="color-swatch" data-color="#2d8f5c" style="background:#2d8f5c;"></button>
          </div>
          <input type="hidden" id="areaColor" value="#4a6fa5">
        </div>
        <div class="field"><label>Descripción (opcional)</label><textarea id="areaDescripcion" placeholder="Describe la función de esta área en el proceso de producción..."></textarea></div>
        <label class="field-checkbox-label"><input type="checkbox" id="areaActiva" checked> Área activa desde su creación</label>
        <div class="flex gap-10 mt">
          <button class="btn btn-ghost btn-lg btn-block" data-go="areas">Cancelar</button>
          <button class="btn btn-primary btn-lg btn-block" id="btnCreateArea" type="button">Crear área</button>
        </div>
      </div>
      <div class="card" style="flex:0.45; min-width:280px; max-width:320px; background:var(--blanco-calido); border:1px solid var(--borde-fuerte);">
        <div class="card-head" style="background: var(--marron);">¿Qué es un área?</div>
        <div class="content" style="padding: 20px 20px 16px;">
          <p class="page-sub-zero">Las áreas agrupan a los trabajadores según su función en la producción (Diseño, Corte, Costura...).</p>
          <p>Cada área tiene sus propias actividades, incidencias y empleados asignados.</p>
          <p>Después de crearla podrás vincular empleados desde la pantalla de detalle del área.</p>
        </div>
      </div>
    </div>`;
};

ADMIN.editarArea = function (id) {
  const a = AREAS_CAT.find((x) => x.id === id) || AREAS_CAT[0];
  return `
    <h1>Editar área</h1>
    <button class="btn btn-ghost btn-sm mb" data-go="detalleArea" data-arg="${a.id}">← Volver</button>
    <div class="card" style="max-width:700px">
      <div class="card-head blue">Editar datos del área — ${a.nom}</div>
      <div class="field-row">
        <div class="field"><label>Nombre del área *</label><input id="editAreaNombre" value="${a.nom}"></div>
        <div class="field" style="max-width:140px"><label>ID</label><input value="${a.id}" disabled></div>
      </div>
      <div class="field"><label>Responsable</label><input id="editAreaResponsable" value="${a.resp}"></div>
      <div class="field-row">
        <div class="field"><label>Turno</label><select id="editAreaTurno">${['Matutino', 'Vespertino'].map((t) => `<option${t === (a.turno || 'Matutino') ? ' selected' : ''}>${t}</option>`).join('')}</select></div>
        <div class="field"><label>Capacidad</label><input id="editAreaCapacidad" type="number" min="0" value="${a.emp}"></div>
      </div>
      <div class="flex gap-10">
        <button class="btn btn-ghost btn-lg btn-block" data-go="detalleArea" data-arg="${a.id}">Cancelar</button>
        <button type="button" class="btn btn-green btn-lg btn-block" data-action="guardar-edicion-area" data-arg="${a.id}">Guardar cambios</button>
      </div>
    </div>`;
};

function filtrarAreasAdmin(filtro) {
  areasFiltro = filtro;
  go('areas', 0);
}
