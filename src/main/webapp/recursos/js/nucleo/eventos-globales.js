/* Eventos globales — delegación de clics (data-go/data-action) de toda la app y el atajo de Enter para iniciar sesión. */

/* ---------- EVENT LISTENERS CENTRALIZADOS (EVENT DELEGATION) ---------- */
document.addEventListener('click', (e) => {
  if (e.target.closest('#btnEnterDefault')) {
    iniciarSesionDesdeFormulario();
    return;
  }


  // Rutas dinámicas desde elementos con data-go
  const routeTarget = e.target.closest('[data-go]');
  if (routeTarget) {
    const view = routeTarget.getAttribute('data-go');
    const arg = routeTarget.getAttribute('data-arg') || null;
    go(view, arg);
    return;
  }

  // Acción del botón salir
  if (e.target.closest('#btnSalir')) {
    salir();
    return;
  }

  if (e.target.closest('#btnCreateArea')) {
    crearNuevaArea();
    return;
  }

  const colorSwatch = e.target.closest('.color-swatch');
  if (colorSwatch && colorSwatch.closest('#areaColorGrid')) {
    $$('.color-swatch', colorSwatch.closest('#areaColorGrid')).forEach((sw) => sw.classList.remove('selected'));
    colorSwatch.classList.add('selected');
    const colorInput = $('#areaColor');
    if (colorInput) colorInput.value = colorSwatch.getAttribute('data-color');
    return;
  }

  const deleteAreaButton = e.target.closest('[data-action="delete-area"]');
  if (deleteAreaButton) {
    eliminarArea(deleteAreaButton.getAttribute('data-area-id'));
    return;
  }

  const btnToggleArea = e.target.closest('[data-action="toggle-area"]');
  if (btnToggleArea) {
    toggleActivaArea(btnToggleArea.getAttribute('data-area-id'), btnToggleArea.getAttribute('data-volver'));
    return;
  }

  const btnVincularEmpleado = e.target.closest('[data-action="vincular-empleado"]');
  if (btnVincularEmpleado) {
    abrirVincularEmpleado(btnVincularEmpleado.getAttribute('data-area-id'));
    return;
  }

  const btnConfirmarVincular = e.target.closest('[data-action="confirmar-vincular-empleado"]');
  if (btnConfirmarVincular) {
    confirmarVincularEmpleado(btnConfirmarVincular.getAttribute('data-arg'), btnConfirmarVincular.getAttribute('data-area-id'));
    return;
  }

  const btnQuitarEmpleadoArea = e.target.closest('[data-action="quitar-empleado-area"]');
  if (btnQuitarEmpleadoArea) {
    quitarEmpleadoDeArea(btnQuitarEmpleadoArea.getAttribute('data-arg'), btnQuitarEmpleadoArea.getAttribute('data-area-id'));
    return;
  }

  const btnGuardarEdicionArea = e.target.closest('[data-action="guardar-edicion-area"]');
  if (btnGuardarEdicionArea) {
    guardarEdicionArea(btnGuardarEdicionArea.getAttribute('data-arg'));
    return;
  }

  // Acción Editar Pedido
  const btnEditPedido = e.target.closest('[data-action="edit-pedido"]');
  if (btnEditPedido) {
    const pid = btnEditPedido.getAttribute('data-pid');
    editarPedido(pid);
    return;
  }

  const btnGuardarEdicionPedido = e.target.closest('[data-action="guardar-edicion-pedido"]');
  if (btnGuardarEdicionPedido) {
    guardarEdicionPedido(btnGuardarEdicionPedido.getAttribute('data-pid'));
    return;
  }

  // Filtro de estado en Pedidos
  const btnFiltrarPedidos = e.target.closest('[data-action="filtrar-pedidos"]');
  if (btnFiltrarPedidos) {
    filtrarPedidos(btnFiltrarPedidos.getAttribute('data-filtro'));
    return;
  }

  // Filtro de estado en Incidencias (admin)
  const btnFiltrarIncidencias = e.target.closest('[data-action="filtrar-incidencias"]');
  if (btnFiltrarIncidencias) {
    filtrarIncidenciasAdmin(btnFiltrarIncidencias.getAttribute('data-filtro'));
    return;
  }

  // Cambio de pestaña dentro de Incidencias (admin): Registro interno / Publicar incidencias
  const btnTabIncidencias = e.target.closest('[data-action="cambiar-tab-incidencias"]');
  if (btnTabIncidencias) {
    cambiarTabIncidencias(btnTabIncidencias.getAttribute('data-tab'));
    return;
  }

  // Filtro de estado en Áreas
  const btnFiltrarAreas = e.target.closest('[data-action="filtrar-areas"]');
  if (btnFiltrarAreas) {
    filtrarAreasAdmin(btnFiltrarAreas.getAttribute('data-filtro'));
    return;
  }

  // Filtro de rol en Usuarios
  const btnFiltrarUsuarios = e.target.closest('[data-action="filtrar-usuarios"]');
  if (btnFiltrarUsuarios) {
    filtrarUsuariosAdmin(btnFiltrarUsuarios.getAttribute('data-filtro'));
    return;
  }

  const btnSaveWorkerArea = e.target.closest('[data-action="guardar-area-trabajador"]');
  if (btnSaveWorkerArea) {
    const wid = btnSaveWorkerArea.getAttribute('data-arg');
    guardarAreaTrabajador(wid);
    return;
  }

  const btnSaveWorker = e.target.closest('[data-action="guardar-trabajador"]');
  if (btnSaveWorker) {
    const wid = btnSaveWorker.getAttribute('data-arg');
    guardarTrabajador(wid);
    return;
  }

  const btnAddActivity = e.target.closest('[data-action="add-activity"]');
  if (btnAddActivity) {
    agregarActividadPedido(btnAddActivity.getAttribute('data-area'));
    return;
  }

  if (e.target.closest('#btnCreatePedido')) {
    crearNuevoPedidoDesdeFormulario();
    return;
  }

  if (e.target.closest('#btnCreateTrabajador')) {
    crearNuevoTrabajadorDesdeFormulario();
    return;
  }

  if (e.target.closest('#btnCambiarClave')) {
    cambiarContrasenaSesion();
    return;
  }

  if (e.target.closest('#btnGenerarClave')) {
    generarClaveEnFormulario();
    return;
  }

  const btnRestablecerClave = e.target.closest('[data-action="restablecer-clave"]');
  if (btnRestablecerClave) {
    restablecerClaveUsuario(btnRestablecerClave.getAttribute('data-arg'));
    return;
  }

  const btnToggleActivoUsuario = e.target.closest('[data-action="toggle-activo-usuario"]');
  if (btnToggleActivoUsuario) {
    toggleActivoUsuario(btnToggleActivoUsuario.getAttribute('data-arg'), btnToggleActivoUsuario.getAttribute('data-volver'));
    return;
  }

  const btnEliminarUsuario = e.target.closest('[data-action="eliminar-usuario"]');
  if (btnEliminarUsuario) {
    eliminarUsuario(btnEliminarUsuario.getAttribute('data-arg'));
    return;
  }

  if (e.target.closest('#btnCreateIncidencia')) {
    crearNuevaIncidenciaDesdeFormulario();
    return;
  }

  const btnGuardarSeguimiento = e.target.closest('[data-action="guardar-seguimiento-incidencia"]');
  if (btnGuardarSeguimiento) {
    guardarSeguimientoIncidencia(btnGuardarSeguimiento.getAttribute('data-arg'));
    return;
  }

  const btnTomarTarea = e.target.closest('[data-action="tomar-tarea"]');
  if (btnTomarTarea) {
    tomarTarea(btnTomarTarea.getAttribute('data-area'), Number(btnTomarTarea.getAttribute('data-idx')));
    return;
  }

  const btnCompletarTarea = e.target.closest('[data-action="completar-tarea"]');
  if (btnCompletarTarea) {
    completarTarea(btnCompletarTarea.getAttribute('data-area'), Number(btnCompletarTarea.getAttribute('data-idx')));
    return;
  }

  const btnDejarTarea = e.target.closest('[data-action="dejar-tarea"]');
  if (btnDejarTarea) {
    dejarTarea(btnDejarTarea.getAttribute('data-area'), Number(btnDejarTarea.getAttribute('data-idx')));
    return;
  }

  const btnSubirEvidencia = e.target.closest('[data-action="subir-evidencia"]');
  if (btnSubirEvidencia) {
    const pid = btnSubirEvidencia.getAttribute('data-pid');
    const area = btnSubirEvidencia.getAttribute('data-area');
    abrirSelectorEvidencia(btnSubirEvidencia, (dataUrl) => subirEvidenciaPedido(pid, area, dataUrl));
    return;
  }

  const btnSubirEvidenciaAdmin = e.target.closest('.evidencia-upload:not([data-action])');
  if (btnSubirEvidenciaAdmin) {
    abrirSelectorEvidencia(btnSubirEvidenciaAdmin);
    return;
  }

  const btnPublicarIncidencia = e.target.closest('[data-action="publicar-incidencia"]');
  if (btnPublicarIncidencia) {
    publicarIncidenciaAdmin(btnPublicarIncidencia.getAttribute('data-area'), Number(btnPublicarIncidencia.getAttribute('data-idx')));
    return;
  }

  // Filtro por área en Publicar incidencias (admin)
  const btnFiltrarPublicarArea = e.target.closest('[data-action="filtrar-publicar-area"]');
  if (btnFiltrarPublicarArea) {
    filtrarPublicarArea(btnFiltrarPublicarArea.getAttribute('data-filtro'));
    return;
  }

  // Filtro por estado de publicación en Publicar incidencias (admin)
  const btnFiltrarPublicarEstado = e.target.closest('[data-action="filtrar-publicar-estado"]');
  if (btnFiltrarPublicarEstado) {
    filtrarPublicarEstado(btnFiltrarPublicarEstado.getAttribute('data-filtro'));
    return;
  }

  const btnTomarIncidencia = e.target.closest('[data-action="tomar-incidencia"]');
  if (btnTomarIncidencia) {
    tomarIncidencia(btnTomarIncidencia.getAttribute('data-area'), Number(btnTomarIncidencia.getAttribute('data-idx')));
    return;
  }

  const btnResolverIncidencia = e.target.closest('[data-action="resolver-incidencia"]');
  if (btnResolverIncidencia) {
    resolverIncidencia(btnResolverIncidencia.getAttribute('data-area'), Number(btnResolverIncidencia.getAttribute('data-idx')));
    return;
  }

  const btnDejarIncidencia = e.target.closest('[data-action="dejar-incidencia"]');
  if (btnDejarIncidencia) {
    dejarIncidencia(btnDejarIncidencia.getAttribute('data-area'), Number(btnDejarIncidencia.getAttribute('data-idx')));
    return;
  }

});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !$('#login').classList.contains('hidden')) {
    const activeElement = document.activeElement;
    if (activeElement && ['INPUT', 'TEXTAREA'].includes(activeElement.tagName)) {
      e.preventDefault();
      iniciarSesionDesdeFormulario();
    }
  }
});
