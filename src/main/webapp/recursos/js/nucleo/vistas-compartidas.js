/* Vistas compartidas — pantallas de Soporte y Ajustes, iguales para administrador y trabajador. */
function soporteView() {
  return `
  <h1>Soporte</h1>
  <p class="page-sub">Centro de ayuda y contacto técnico del sistema.</p>
  <div class="row">
    <div class="card"><h3>Contacto técnico</h3>
      <p class="small sec mt">Proveedor</p><b>HiloNet Software</b>
      <p class="small sec mt">Correo</p><b>soporte@hilonet.mx</b>
      <p class="small sec mt">Teléfono</p><b>777 987 6543 · Lun a Vie 9–18h</b>
    </div>
    <div class="card"><h3>Preguntas frecuentes</h3>
      ${['¿Cómo restablezco la contraseña de un empleado?', '¿Cómo creo una nueva área?', '¿Cómo asigno una tarea?', '¿Cómo edito la prioridad de un pedido?'].map(q => `
        <div class="list-row"><div class="grow"><div class="title" style="font-weight:500">${q}</div></div><span>›</span></div>`).join('')}
    </div>
  </div>
  <button class="btn btn-primary btn-lg" data-toast="Ticket de soporte generado con folio #HLN-2026">Abrir ticket de soporte</button>`;
}

function ajusteView() {
  return `
  <h1>Ajustes</h1>
  <p class="page-sub">Configuración de la cuenta y del sistema.</p>
  <div class="row">
    <div class="card"><h3>Perfil</h3>
      <p class="small sec mt">Nombre</p><b>${session.rol==='admin'?'Administrador General':AREAS_INFO[session.area].worker}</b>
      <p class="small sec mt">Rol</p><b>${session.rol==='admin'?'Administrador':'Trabajador'}</b>
      <p class="small sec mt">Correo</p><b>${session.rol==='admin'?'admin':'trabajador'}@textile.mx</b>
    </div>
    <div class="card"><h3>Seguridad</h3>
      <p class="sec">Cambia tu contraseña cuando lo necesites.</p>
      <button class="btn btn-primary mt" data-toast="Asistente de cambio de contraseña enviado al correo electrónico">Cambiar contraseña</button>
      <p class="small sec mt">Notificaciones</p>
      <label class="field-checkbox-label"><input type="checkbox" checked class="input-check-auto"> Avisarme de nuevos pedidos e incidencias</label>
    </div>
  </div>`;
}
