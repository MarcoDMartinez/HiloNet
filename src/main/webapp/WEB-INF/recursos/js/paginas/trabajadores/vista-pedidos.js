/* Vista Pedidos (trabajador) — pedidos activos y el avance/evidencia del área del trabajador en cada uno. */
WORKER.pedidos = function () {
  const a = getAreaInfo(session.area);
  return `
    <h1>Pedidos</h1>
    <p class="page-sub">Pedidos activos y las actividades que te corresponden.</p>
    <div class="stats">
      <div class="stat"><div class="n" style="color:${a.color}">3</div><div class="l">Pedidos activos</div></div>
      <div class="stat"><div class="n" style="color:#a08b78">2</div><div class="l">Actividades pendientes</div></div>
      <div class="stat"><div class="n" style="color:var(--verde-exito)">1</div><div class="l">Completadas hoy</div></div>
    </div>
    <div id="trayList">
      ${PEDIDOS.map(p => `
        <div class="card">
          <div class="flex between">
            <div>
              <b>${p.id} — ${p.cli}</b>
              <p class="sec">${p.desc}</p>
            </div>
            <span class="badge ${p.estCls}">${p.est}</span>
          </div>
          <button class="btn btn-primary btn-sm mt" data-go="detallePedido" data-arg="${p.id}">Ver detalle</button>
        </div>
      `).join('')}
    </div>`;
};

WORKER.detallePedido = function (id) {
  const p = PEDIDOS.find(x => x.id === id) || PEDIDOS[0];
  const a = getAreaInfo(session.area);
  const involucrado = p.areas.includes(a.label);
  const avance = getAvancePedido(p.id, a.areaKey);
  const evidencias = getEvidencias(p.id, a.areaKey);
  const actividadesArea = getAreaTasks(a.areaKey).filter((t) => t[1] === p.id);
  const estadoActividad = avance >= 100 ? 'comp' : avance > 0 ? 'proc' : 'pend';
  const estadoLabel = avance >= 100 ? 'Completada' : avance > 0 ? 'En proceso' : 'Pendiente';

  return `
    <div class="crumb">Pedidos › <b>${p.id} — ${p.cli}</b></div>
    <div class="flex between mb">
      <div class="flex">
        <button class="btn btn-ghost btn-sm" data-go="pedidos">← Volver</button>
        <h1 class="ml-4">Pedido ${p.id}</h1>
        <span class="badge ${p.estCls}">${p.est}</span>
      </div>
    </div>
    <div class="row mb">
      <div class="card">
        <h3>Datos del pedido</h3>
        <p class="small sec mt">Cliente</p><b>${p.cli}</b>
        <p class="small sec mt">Descripción</p><b>${p.desc}</b>
        <p class="small sec mt">Fecha entrega</p><b>${p.fecha}</b>
      </div>
      <div class="card">
        <h3>Evidencia del trabajo — ${a.label}</h3>
        <p class="page-sub-zero mt">Sube una foto de evidencia para avanzar tu progreso en esta área.</p>
        <div class="flex mt gap-10" style="flex-wrap:wrap">
          ${evidencias.map((ev) => `<div class="evidencia-box">${ev}</div>`).join('')}
          ${involucrado && avance < 100 ? `<div class="evidencia-upload" data-action="subir-evidencia" data-pid="${p.id}" data-area="${a.areaKey}">+ Subir</div>` : ''}
        </div>
      </div>
    </div>
    ${involucrado ? `
    <h2 class="mb">Tu avance en ${a.label}</h2>
    <div class="row mb">
      <div class="card-zero">
        <div class="flex between"><b class="badge area-${a.cls}">${a.label}</b><b>${avance}%</b></div>
        <div class="progress mt"><span style="width:${avance}%; background:${a.color}"></span></div>
      </div>
    </div>
    <h2 class="mb">Actividades de mi área en este pedido</h2>
    <table class="table">
      <thead><tr><th>Actividad</th><th>Estado</th></tr></thead>
      <tbody>
        ${actividadesArea.length ? actividadesArea.map((t) => `
        <tr><td class="name">${t[0]}</td><td><span class="badge ${estadoActividad}">${estadoLabel}</span></td></tr>`).join('') : `
        <tr><td colspan="2" class="muted">Sin actividades registradas para tu área en este pedido.</td></tr>`}
      </tbody>
    </table>` : `
    <div class="card"><p class="sec">Este pedido no tiene actividades asignadas a tu área.</p></div>`}`;
};

function subirEvidenciaPedido(pedidoId, areaKey) {
  agregarEvidencia(pedidoId, areaKey);
  const actual = getAvancePedido(pedidoId, areaKey);
  setAvancePedido(pedidoId, areaKey, actual + 20);
  go('detallePedido', pedidoId);
  toast('Evidencia subida correctamente. Tu avance en el área se actualizó.');
}
