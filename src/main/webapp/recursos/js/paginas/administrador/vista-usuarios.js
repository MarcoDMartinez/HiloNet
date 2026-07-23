/* Vista Usuarios (admin) — gestión de cuentas, perfil de empleado y alta/edición de trabajador. */
let usuariosPage = 0;
let usuariosFiltro = 'todos';
const USUARIOS_PAGE_SIZE = 5;
const USUARIOS_FILTROS = [
  { key: 'todos', label: 'Todos' },
  { key: 'Administrador', label: 'Administrador' },
  { key: 'Empleado', label: 'Empleado' },
];

function rowUsuarioHTML(u) {
  return `
        <tr>
          <td class="id">${u.id}</td><td class="name">${u.nom}</td><td class="sec">${u.user}</td>
          <td class="sec">${u.area}</td>
          <td><span class="badge ${u.rol === 'Administrador' ? 'pend' : 'proc'}">${u.rol}</span></td>
          <td><span class="badge activa">Activo</span></td>
          <td class="flex gap-10">
            <button class="btn btn-primary btn-sm" data-toast="Contraseña temporal enviada a correo institucional">Restablecer contraseña</button>
            <button class="btn btn-ghost btn-sm" data-go="crearTrabajador">Editar</button>
          </td>
        </tr>`;
}

ADMIN.usuarios = function (arg) {
  const usuariosFiltrados = usuariosFiltro === 'todos'
    ? USUARIOS
    : USUARIOS.filter((u) => u.rol === usuariosFiltro);

  const totalPaginas = Math.max(1, Math.ceil(usuariosFiltrados.length / USUARIOS_PAGE_SIZE));
  usuariosPage = (arg !== undefined && arg !== null) ? (parseInt(arg, 10) || 0) : 0;
  usuariosPage = Math.min(Math.max(usuariosPage, 0), totalPaginas - 1);
  const inicio = usuariosPage * USUARIOS_PAGE_SIZE;
  const usuariosPagina = usuariosFiltrados.slice(inicio, inicio + USUARIOS_PAGE_SIZE);

  return `
    <div class="flex between mb">
      <div><h1>Gestión de usuarios</h1>
      <p class="page-sub-zero">Administra cuentas y restablece contraseñas.</p></div>
      <button class="btn btn-primary" data-go="crearTrabajador">+ Nuevo usuario</button>
    </div>
    ${filtroPillsHTML('filtrar-usuarios', USUARIOS_FILTROS, usuariosFiltro)}
    <table class="table">
      <thead><tr><th>ID</th><th>Nombre</th><th>Usuario</th><th>Área</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr></thead>
      <tbody>${usuariosPagina.length ? usuariosPagina.map(u => rowUsuarioHTML(u)).join('') : `<tr><td colspan="7" class="muted">No hay usuarios con este filtro.</td></tr>`}</tbody>
    </table>
    ${paginacionHTML('usuarios', usuariosPage, totalPaginas)}
    <div class="card mt" style="background:var(--blanco-calido); border-color:var(--borde-fuerte)">
      <p class="small sec">Al restablecer una contraseña se genera una clave temporal. El empleado deberá cambiarla en su primer inicio de sesión.</p>
    </div>`;
};

ADMIN.perfilEmpleado = function (id) {
  const u = USUARIOS.find((user) => user.id === id) || USUARIOS[0];
  const areaClass = u.area ? `area-${u.area.toLowerCase().replace(/[^a-z0-9]+/g, '')}` : '';
  return `
    <div class="crumb">Áreas › Detalle › <b>Perfil del empleado</b></div>
    <button class="btn btn-ghost btn-sm mb" data-go="usuarios">← Volver</button>
    <div class="card">
      <div class="flex between">
        <div class="flex gap-10">
          <div class="avatar-large avatar-corte"></div>
          <div>
            <h1>${u.nom}</h1>
            <div class="flex mt"><span class="badge activa">Activo</span><span class="badge ${areaClass}">Área: ${u.area}</span></div>
            <p class="sec mt">${u.puesto || 'Puesto no asignado'} · ${u.area} · ${id}</p>
          </div>
        </div>
        <div class="flex gap-10">
          <button class="btn btn-primary" data-go="editarAreaEmpleado" data-arg="${id}">Editar área</button>
          <button class="btn btn-ghost" data-go="editarTrabajador" data-arg="${id}">Editar perfil</button>
          <button class="btn btn-ghost" data-toast="Solicitud de reseteo enviada">Restablecer clave</button>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="card"><h3>Información personal</h3>
        <p class="small sec mt">Correo</p><b>lander@correo.com</b>
        <p class="small sec mt">Teléfono</p><b>777 123 4567</b>
        <p class="small sec mt">Usuario</p><b>lander</b>
      </div>
      <div class="card"><h3>Actividad reciente</h3>
        ${[['Cortar tela 20 piezas', 'P-0021', 'proc', 'En proceso'], ['Corte denim 15 faldas', 'P-0019', 'comp', 'Completada'], ['Tendido sudaderas', 'P-0021', 'pend', 'Pendiente']].map(([t, p, c, e]) => `
          <div class="list-row corte mt">
            <div class="grow"><div class="title">${t}</div><div class="meta">${p}</div></div>
            <span class="badge ${c}">${e}</span>
          </div>`).join('')}
      </div>
    </div>`;
};

ADMIN.crearTrabajador = function () {
  const areaOptions = AREAS_CAT.map((area) => `
          <option value="${area.nom}">${area.nom}</option>`).join('');

  return `
    <h1>Crear nuevo trabajador</h1>
    <p class="page-sub">Registra un empleado y asígnalo a un área.</p>
    <button class="btn btn-ghost btn-sm mb" data-go="usuarios">← Volver</button>
    <div class="card" style="max-width:840px">
      <div class="card-head">Datos personales</div>
      <div class="field-row">
        <div class="field"><label>Nombre(s) *</label><input placeholder="Lander"></div>
        <div class="field"><label>Apellidos *</label><input placeholder="Bautista Ríos"></div>
      </div>
      <div class="field-row">
        <div class="field"><label>Correo electrónico *</label><input placeholder="lander@correo.com"></div>
        <div class="field"><label>Teléfono</label><input placeholder="777 123 4567"></div>
      </div>
    </div>
    <div class="card" style="max-width:840px">
      <div class="card-head blue">Asignación y acceso</div>
      <div class="field-row">
        <div class="field"><label>Área asignada *</label><select>${areaOptions}</select></div>
        <div class="field"><label>Puesto *</label><input placeholder="Cortador principal"></div>
      </div>
      <div class="field-row">
        <div class="field"><label>Nombre de usuario *</label><input placeholder="lander"></div>
        <div class="field"><label>Contraseña temporal *</label>
          <div class="flex gap-10">
            <input id="tempPass" value="Tx7-Kp29-Hilo" readonly style="flex:1">
            <button class="btn btn-ghost" data-toast="Nueva clave aleatoria generada de forma segura">Generar</button>
          </div>
        </div>
      </div>
      <label class="field-checkbox-label"><input type="checkbox" checked class="input-check-auto"> Obligar cambio de contraseña en el primer inicio de sesión</label>
      <div class="flex mt gap-10">
        <button class="btn btn-ghost btn-lg btn-block" data-go="usuarios">Cancelar</button>
        <button class="btn btn-primary btn-lg btn-block" data-toast="Trabajador registrado exitosamente" data-back="usuarios">Crear trabajador</button>
      </div>
    </div>`;
};

ADMIN.editarAreaEmpleado = function (id) {
  const u = USUARIOS.find((user) => user.id === id) || USUARIOS[0];
  const areaOptions = AREAS_CAT.map((area) => `
          <option value="${area.nom}"${area.nom === u.area ? ' selected' : ''}>${area.nom}</option>`).join('');
  return `
    <h1>Editar área del trabajador</h1>
    <p class="page-sub">Modifica únicamente el área asignada al empleado.</p>
    <button class="btn btn-ghost btn-sm mb" data-go="perfilEmpleado" data-arg="${id}">← Volver</button>
    <div class="card" style="max-width:700px">
      <div class="card-head blue">${u.nom}</div>
      <div class="field-row">
        <div class="field" style="flex:1"><label>Área asignada *</label><select id="editWorkerArea">${areaOptions}</select></div>
      </div>
      <div class="flex gap-10">
        <button class="btn btn-ghost btn-lg btn-block" data-go="perfilEmpleado" data-arg="${id}">Cancelar</button>
        <button class="btn btn-primary btn-lg btn-block" data-action="guardar-area-trabajador" data-arg="${id}">Guardar</button>
      </div>
    </div>`;
};

ADMIN.editarTrabajador = function (id) {
  const u = USUARIOS.find((user) => user.id === id) || USUARIOS[0];
  const areaOptions = AREAS_CAT.map((area) => `
          <option value="${area.nom}"${area.nom === u.area ? ' selected' : ''}>${area.nom}</option>`).join('');
  return `
    <h1>Editar trabajador</h1>
    <p class="page-sub">Modifica cualquier dato adicional del trabajador.</p>
    <button class="btn btn-ghost btn-sm mb" data-go="perfilEmpleado" data-arg="${id}">← Volver</button>
    <div class="card" style="max-width:840px">
      <div class="card-head">Datos personales</div>
      <div class="field-row">
        <div class="field"><label>Nombre(s) *</label><input id="editWorkerName" value="${u.nom}"></div>
        <div class="field"><label>Nombre de usuario *</label><input id="editWorkerUser" value="${u.user}"></div>
      </div>
      <div class="field-row">
        <div class="field"><label>Área asignada *</label><select id="editWorkerAreaFull">${areaOptions}</select></div>
        <div class="field"><label>Puesto</label><input id="editWorkerPuesto" value="${u.puesto || ''}" placeholder="Cortador principal"></div>
      </div>
      <div class="flex mt gap-10">
        <button class="btn btn-ghost btn-lg btn-block" data-go="perfilEmpleado" data-arg="${id}">Cancelar</button>
        <button class="btn btn-primary btn-lg btn-block" data-action="guardar-trabajador" data-arg="${id}">Guardar cambios</button>
      </div>
    </div>`;
};

function filtrarUsuariosAdmin(filtro) {
  usuariosFiltro = filtro;
  go('usuarios', 0);
}
