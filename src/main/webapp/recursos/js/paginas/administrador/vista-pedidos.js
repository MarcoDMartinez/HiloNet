/* Vista Pedidos (admin) — listado paginado y filtrable, alta de pedido, y detalle/edición de un pedido existente. */
let pedidoEnEdicion = null;
let pedidosPage = 0;
let pedidosFiltro = 'todos';
const PEDIDOS_PAGE_SIZE = 5;
const PEDIDOS_FILTROS = [
  { key: 'todos', label: 'Todos' },
  { key: 'proc', label: 'En producción' },
  { key: 'pend', label: 'Pendiente' },
  { key: 'comp', label: 'Entregado' },
];

ADMIN.pedidos = function (arg) {
  pedidosPage = (arg !== undefined && arg !== null) ? (parseInt(arg, 10) || 0) : 0;

  const pedidosFiltrados = pedidosFiltro === 'todos'
    ? PEDIDOS
    : PEDIDOS.filter((p) => p.estCls === pedidosFiltro);

  const totalPaginas = Math.max(1, Math.ceil(pedidosFiltrados.length / PEDIDOS_PAGE_SIZE));
  pedidosPage = Math.min(Math.max(pedidosPage, 0), totalPaginas - 1);
  const inicio = pedidosPage * PEDIDOS_PAGE_SIZE;
  const pedidosPagina = pedidosFiltrados.slice(inicio, inicio + PEDIDOS_PAGE_SIZE);

  return `
    <div class="flex between mb">
      <div><h1>Pedidos</h1>
      <p class="page-sub-zero">Haz clic en un pedido para abrir su detalle completo.</p></div>
      <button class="btn btn-primary" data-go="crearPedido">+ Nuevo Pedido</button>
    </div>
    <div class="stats">
      <div class="stat"><div class="n">12</div><div class="l">Total</div></div>
      <div class="stat"><div class="n">5</div><div class="l">En producción</div></div>
      <div class="stat"><div class="n">3</div><div class="l">Pendientes</div></div>
      <div class="stat"><div class="n">4</div><div class="l">Entregados</div></div>
    </div>
    ${filtroPillsHTML('filtrar-pedidos', PEDIDOS_FILTROS, pedidosFiltro)}
    <table class="table">
      <thead><tr><th>ID</th><th>Cliente</th><th>Descripción</th><th>Áreas</th><th>Entrega</th><th>Estado</th><th>Acciones</th></tr></thead>
      <tbody>${pedidosPagina.length ? pedidosPagina.map(p => `
        <tr>
          <td class="id">${p.id}</td><td class="name">${p.cli}</td>
          <td class="sec">${p.desc}</td><td>${p.areas}</td><td>${p.fecha}</td>
          <td><span class="badge ${p.estCls}">${p.est}</span></td>
          <td><button class="btn btn-primary btn-sm" data-go="detallePedido" data-arg="${p.id}">Ver detalle</button></td>
        </tr>`).join('') : `<tr><td colspan="7" class="muted">No hay pedidos con este filtro.</td></tr>`}</tbody>
    </table>
    ${paginacionHTML('pedidos', pedidosPage, totalPaginas)}`;
};

ADMIN.crearPedido = function () {
  const areaBlock = (key, label, actividades) => `
        <div class="area-activity-block">
          <div class="area-activity-head ${key}">${label}</div>
          <div class="area-activity-list" id="actList-${key}">
            ${actividades.map(a => `
            <label class="activity-item ${key}">
              <input type="checkbox">
              <span class="act-text">${a}</span>
            </label>`).join('')}
          </div>
          <button type="button" class="btn btn-ghost area-activity-add" data-action="add-activity" data-area="${key}">+ Agregar actividad</button>
        </div>`;

  const desgloseRow = (sexo, pzs, talla) => `
        <div class="pedido-desglose-row">
          <span>${sexo}</span><span class="sec">${pzs} pzs</span><span class="sec">Talla ${talla}</span>
          <span class="remove-row" data-action="remove-desglose" title="Quitar">✕</span>
        </div>`;

  return `
    <h1>Nuevo Pedido</h1>
    <p class="page-sub">Llena los datos del pedido, agrega actividades por área y sube imágenes del diseño</p>
    <div class="card" style="max-width:1180px">
      <div class="card-head">Información del pedido</div>
      <div class="row" style="align-items:flex-start;">
        <div style="flex:1.3; min-width:340px;">
          <div class="field"><label>Nombre del cliente *</label><input id="pedidoCliente" placeholder="Ej. Confecciones Morelos"></div>
          <div class="field"><label>Descripción del pedido *</label><input id="pedidoDesc" placeholder="Ej. 20 camisetas polo con bordado"></div>
          <div class="field-row">
            <div class="field"><label>Área principal</label>
              <select id="pedidoAreaPrincipal"><option>Diseño</option><option>Corte</option><option>Costura</option></select>
            </div>
            <div class="field"><label>Prioridad</label>
              <select id="pedidoPrioridad"><option>Alta</option><option>Media</option><option>Baja</option></select>
            </div>
          </div>
          <div class="field-row">
            <div class="field"><label>Fecha de entrega *</label><input type="date" id="pedidoFecha"></div>
            <div class="field"><label>Cantidad total</label><input id="pedidoCantidad" placeholder="Ej. 50 piezas"></div>
          </div>
          <div class="field-row">
            <div class="field"><label class="hidden">Sexo</label>
              <select id="pedidoSexo"><option value="" disabled selected>Sexo</option><option>Ropa mujer</option><option>Ropa hombre</option><option>Unisex</option></select>
            </div>
            <div class="field"><label class="hidden">Pzs</label><input id="pedidoPzs" placeholder="Pzs" type="number" min="1"></div>
            <div class="field"><label class="hidden">Talla</label>
              <select id="pedidoTalla"><option value="" disabled selected>Talla</option><option>S</option><option>M</option><option>L</option><option>XL</option><option>Unitalla</option></select>
            </div>
          </div>
          <div class="field"><label>Imágenes del diseño</label>
            <div class="flex gap-10">
              <div class="evidencia-box img-square">Imagen 1</div>
              <div class="evidencia-box img-square">Imagen 2</div>
              <div class="evidencia-upload img-square">+ Subir</div>
            </div>
          </div>
          <div class="pedido-desglose" id="pedidoDesglose">
            ${desgloseRow('Ropa mujer', 10, 'M')}
            ${desgloseRow('Ropa hombre', 10, 'L')}
            ${desgloseRow('Unisex', 5, 'Unitalla')}
          </div>
          <button type="button" class="btn btn-ghost btn-sm mt" data-action="add-desglose">+ Agregar a la lista</button>
        </div>
        <div style="flex:1; min-width:300px;">
          ${areaBlock('diseno', 'Diseño', ['Trazar patrón', 'Ficha técnica'])}
          ${areaBlock('corte', 'Corte', ['Corte tela', 'Tendido'])}
          ${areaBlock('costura', 'Costura', ['Confección', 'Bordado'])}
        </div>
      </div>
    </div>
    <div class="flex gap-10 mt" style="max-width:1180px">
      <button class="btn btn-ghost btn-lg btn-block" data-go="pedidos">Cancelar</button>
      <button type="button" class="btn btn-primary btn-lg btn-block" id="btnCreatePedido">Crear pedido</button>
    </div>`;
};

ADMIN.detallePedido = function (id) {
  pedidoEnEdicion = null;
  const p = PEDIDOS.find(x => x.id === id) || PEDIDOS[0];
  return `
    <div class="crumb">Pedidos › <b>${p.id} — ${p.cli}</b></div>
    <div class="flex between mb">
      <div class="flex">
        <button class="btn btn-ghost btn-sm" data-go="pedidos">← Volver</button>
        <h1 class="ml-4">Pedido ${p.id}</h1>
        <span class="badge ${p.estCls}">${p.est}</span>
      </div>
      <button class="btn btn-primary" data-action="edit-pedido" data-pid="${p.id}">✎ Editar Pedido</button>
    </div>
    <div class="row mb">
      <div class="card" id="datosPedido">
        <h3>Datos del pedido</h3>
        <p class="small sec mt">Cliente</p><b id="cliVal">${p.cli}</b>
        <p class="small sec mt">Prioridad</p><b id="priVal" class="pri-high-text">${p.pri || 'Alta'}</b>
        <p class="small sec mt">Cantidad</p><b>20 piezas</b>
        <p class="small sec mt">Fecha entrega</p><b>${p.fecha}</b>
      </div>
      <div class="card">
        <h3>Evidencia del trabajo</h3>
        <div class="flex mt gap-10">
          <div class="evidencia-box">Foto 1</div>
          <div class="evidencia-box">Foto 2</div>
          <div class="evidencia-upload">+ Subir</div>
        </div>
      </div>
    </div>
    <h2 class="mb">Avance por áreas</h2>
    <div class="row mb">
      ${[['Diseño', 100, 'diseno'], ['Corte', 70, 'corte'], ['Costura', 30, 'costura']].map(([a, pct, cls]) => `
        <div class="card-zero">
          <div class="flex between"><b class="badge area-${cls}">${a}</b><b>${pct}%</b></div>
          <div class="progress mt"><span style="width:${pct}%; background:var(--${cls==='diseno'?'verde-diseno':cls==='corte'?'azul-corte':'marron-costura'})"></span></div>
        </div>`).join('')}
    </div>
    <h2 class="mb">Actividades del pedido</h2>
    <table class="table">
      <thead><tr><th>Área</th><th>Actividad</th><th>Responsable</th><th>Estado</th><th>Fecha</th></tr></thead>
      <tbody>
        <tr><td><span class="badge area-diseno">Diseño</span></td><td class="name">Trazar patrón polo</td><td>Marco D.</td><td><span class="badge comp">Completada</span></td><td>2026-06-11</td></tr>
        <tr><td><span class="badge area-corte">Corte</span></td><td class="name">Corte tela 20 piezas</td><td>Lander B.</td><td><span class="badge proc">En proceso</span></td><td>—</td></tr>
        <tr><td><span class="badge area-costura">Costura</span></td><td class="name">Confección 20 piezas</td><td>Merari N.</td><td><span class="badge pend">Pendiente</span></td><td>—</td></tr>
        <tr><td><span class="badge area-costura">Costura</span></td><td class="name">Bordado logo empresa</td><td class="muted">Sin asignar</td><td><span class="badge pend">Pendiente</span></td><td>—</td></tr>
      </tbody>
    </table>`;
};

function filtrarPedidos(filtro) {
  pedidosFiltro = filtro;
  go('pedidos', 0);
}

function editarPedido(id) {
  if (pedidoEnEdicion && pedidoEnEdicion !== id) {
    toast('Ya estás editando otro pedido. Guarda o cancela antes de editar otro.');
    return;
  }
  if (pedidoEnEdicion === id) {
    toast('Ya estás en modo edición de este pedido. Guarda o cancela para continuar.');
    return;
  }

  const cli = $('#cliVal'), pri = $('#priVal');
  if (!cli) return;
  const p = PEDIDOS.find((x) => x.id === id);
  if (!p) return;
  pedidoEnEdicion = id;
  const editBtn = document.querySelector('[data-action="edit-pedido"]');
  if (editBtn) {
    editBtn.disabled = true;
    editBtn.textContent = 'Editando...';
    editBtn.classList.add('btn-ghost');
  }
  const prioridadActual = p.pri || 'Alta';
  cli.outerHTML = `<input id="cliVal" value="${p.cli}" class="input-edit-inline">`;
  pri.outerHTML = `<select id="priVal" class="input-edit-inline">${['Alta', 'Media', 'Baja'].map((op) => `<option${op === prioridadActual ? ' selected' : ''}>${op}</option>`).join('')}</select>`;

  const card = $('#datosPedido');
  const bar = document.createElement('div');
  bar.className = 'flex mt gap-10';
  bar.innerHTML = `
    <button class="btn btn-ghost btn-sm btn-block" data-go="detallePedido" data-arg="${id}">Cancelar</button>
    <button type="button" class="btn btn-green btn-sm btn-block" data-action="guardar-edicion-pedido" data-pid="${id}">Guardar</button>`;
  card.appendChild(bar);
  toast('Modo edición activo: Puede actualizar los datos correspondientes.');
}

function guardarEdicionPedido(id) {
  const cliInput = $('#cliVal'), priSelect = $('#priVal');
  if (!cliInput || !priSelect) return;

  if (!cliInput.value.trim()) {
    toast('Ingresa el nombre del cliente.', 'error');
    return;
  }

  const p = PEDIDOS.find((x) => x.id === id);
  if (p) {
    p.cli = cliInput.value.trim();
    p.pri = priSelect.value;
  }
  pedidoEnEdicion = null;
  go('detallePedido', id);
  toast('Pedido actualizado correctamente.');
}

function agregarActividadPedido(area) {
  const lista = $(`#actList-${area}`);
  if (!lista) return;
  const nombre = prompt('Nombre de la nueva actividad:');
  if (!nombre || !nombre.trim()) return;
  const item = document.createElement('label');
  item.className = `activity-item ${area}`;
  item.innerHTML = `<input type="checkbox"><span class="act-text">${nombre.trim()}</span>`;
  lista.appendChild(item);
}

function agregarDesglosePedido() {
  const sexo = $('#pedidoSexo'), pzs = $('#pedidoPzs'), talla = $('#pedidoTalla');
  const contenedor = $('#pedidoDesglose');
  if (!sexo || !pzs || !talla || !contenedor) return;
  if (!sexo.value || !pzs.value || !talla.value) {
    toast('Selecciona sexo, cantidad de piezas y talla para agregar a la lista.', 'error');
    return;
  }
  const row = document.createElement('div');
  row.className = 'pedido-desglose-row';
  row.innerHTML = `
    <span>${sexo.value}</span><span class="sec">${pzs.value} pzs</span><span class="sec">Talla ${talla.value}</span>
    <span class="remove-row" data-action="remove-desglose" title="Quitar">✕</span>`;
  contenedor.appendChild(row);
  sexo.value = '';
  pzs.value = '';
  talla.value = '';
}

function crearNuevoPedidoDesdeFormulario() {
  const cliente = $('#pedidoCliente')?.value.trim();
  const desc = $('#pedidoDesc')?.value.trim();
  const fecha = $('#pedidoFecha')?.value;

  if (!cliente || !desc || !fecha) {
    toast('Completa los campos obligatorios: nombre del cliente, descripción y fecha de entrega.', 'error');
    return;
  }

  const areaPrincipal = $('#pedidoAreaPrincipal')?.value || 'Diseño';
  const areasLabelMap = { diseno: 'Diseño', corte: 'Corte', costura: 'Costura' };
  const areasConActividad = Object.keys(areasLabelMap).filter((key) => $$(`#actList-${key} .activity-item`).length > 0);
  const areasTexto = areasConActividad.length ? areasConActividad.map((key) => areasLabelMap[key]).join(', ') : areaPrincipal;

  const nuevoPedido = {
    id: getNextPedidoId(),
    cli: cliente,
    desc,
    areas: areasTexto,
    fecha,
    est: 'Pendiente',
    estCls: 'pend'
  };

  PEDIDOS.unshift(nuevoPedido);
  go('pedidos');
  toast(`Pedido ${nuevoPedido.id} creado correctamente.`);
}
