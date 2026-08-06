/* Router — sidebar dinámico según el rol/área de sesión, y el enrutador que decide qué vista se pinta en #content. */

// Función para verificar si el usuario actual es Administrador (tolera distintas variantes)
function esAdmin() {
  if (!session) return false;
  const rol = String(session.rol || '').trim().toLowerCase();
  const idRol = Number(session.idRol || session.id_rol);

  return rol === 'admin' || rol === 'administrador' || idRol === 1 || idRol === 21;
}

/* ---------- SIDEBAR DÍNAMICO ---------- */
function renderSidebar() {
  const sb = $('#sidebar');
  if (esAdmin()) {
    const items = [['pedidos', 'Pedidos'], ['incidencias', 'Incidencias'], ['areas', 'Áreas'], ['usuarios', 'Usuarios']];
    const areasMenu = (typeof AREAS_CAT !== 'undefined' ? AREAS_CAT : []).map((area) => `
      <button class="nav-item nav-item-area" data-go="detalleArea" data-arg="${area.id}">
        <span class="area-dot" style="background:${area.color || '#999'}"></span>
        <span>${area.nom}</span>
      </button>
    `).join('');

    sb.innerHTML = `
      <div class="brand">HILONET</div>
      <div class="menu-title">Menú</div>
      <div class="nav-label">Navegación</div>
      <nav>${items.map(([k, l]) => `<button class="nav-item" data-view="${k}" data-go="${k}">${l}</button>`).join('')}</nav>
      <div class="divider"></div>
      <div class="nav-label">Áreas creadas</div>
      <nav>${areasMenu}</nav>
      <div class="divider"></div>
      <div class="foot">
        <button class="nav-item" data-view="ajuste" data-go="ajuste">Ajuste</button>
        <button class="nav-item" id="btnSalir">Cerrar sesión</button>
      </div>`;
  } else {
    const a = getAreaInfo(session.area);
    const items = [['inicio', 'Inicio'], ['incidencias', 'Incidencias'], ['pedidos', 'Pedidos']];
    sb.innerHTML = `
      <div class="brand">HILONET</div>
      <div class="menu-title">Menú</div>
      <div class="nav-label">Área: ${a ? a.label : ''}</div>
      <nav>${items.map(([k, l]) => `<button class="nav-item ${a && a.cls ? `area-${a.cls}` : ''}" data-view="${k}" data-go="${k}">${l}</button>`).join('')}</nav>
      <div class="divider"></div>
      <div class="foot">
        <button class="nav-item ${a && a.cls ? `area-${a.cls}` : ''}" data-view="ajuste" data-go="ajuste">Ajuste</button>
        <button class="nav-item ${a && a.cls ? `area-${a.cls}` : ''}" id="btnSalir">Cerrar sesión</button>
      </div>`;
  }
}

function setActive(view) {
  $$('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.view === view));
}

/* ---------- ENRUTADOR DE CONTROL DE VISTAS ---------- */
function go(view, arg) {
  setActive(view);
  const c = $('#content');
  const fn = (esAdmin() ? ADMIN : WORKER)[view];
  c.innerHTML = fn ? fn(arg) : `<h1>${view}</h1>`;
  if (c.firstElementChild) c.firstElementChild.classList.add('view');
  window.scrollTo(0, 0);
}