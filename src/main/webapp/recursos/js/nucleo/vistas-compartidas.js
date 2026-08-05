/* Vistas compartidas — pantalla de Ajustes, igual para administrador y trabajador. */
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
      <div class="field"><label>Contraseña actual</label><input type="password" id="claveActual" placeholder="••••••••"></div>
      <div class="field"><label>Nueva contraseña</label><input type="password" id="claveNueva" placeholder="••••••••"></div>
      <div class="field"><label>Confirmar nueva contraseña</label><input type="password" id="claveConfirmar" placeholder="••••••••"></div>
      <button type="button" class="btn btn-primary mt" id="btnCambiarClave">Cambiar contraseña</button>
      <p class="small sec mt">Notificaciones</p>
      <label class="field-checkbox-label"><input type="checkbox" checked class="input-check-auto"> Avisarme de nuevos pedidos e incidencias</label>
    </div>
  </div>`;
}

function cambiarContrasenaSesion() {
  const actual = $('#claveActual')?.value.trim();
  const nueva = $('#claveNueva')?.value.trim();
  const confirmar = $('#claveConfirmar')?.value.trim();
  const clave = session.rol === 'admin' ? 'admin' : session.area;
  const claveVigente = CONTRASENAS[clave] || '123';

  if (!actual || !nueva || !confirmar) {
    toast('Completa los campos obligatorios: contraseña actual, nueva contraseña y confirmación.', 'error');
    return;
  }
  if (actual !== claveVigente) {
    toast('La contraseña actual no es correcta.', 'error');
    return;
  }
  if (nueva !== confirmar) {
    toast('La nueva contraseña y su confirmación no coinciden.', 'error');
    return;
  }

  CONTRASENAS[clave] = nueva;
  go('ajuste');
  toast('Tu contraseña se actualizó correctamente.');
}
