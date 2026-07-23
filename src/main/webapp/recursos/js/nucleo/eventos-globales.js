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

  // Acción Editar Pedido
  const btnEditPedido = e.target.closest('[data-action="edit-pedido"]');
  if (btnEditPedido) {
    const pid = btnEditPedido.getAttribute('data-pid');
    editarPedido(pid);
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

  const btnAddDesglose = e.target.closest('[data-action="add-desglose"]');
  if (btnAddDesglose) {
    agregarDesglosePedido();
    return;
  }

  const btnRemoveDesglose = e.target.closest('[data-action="remove-desglose"]');
  if (btnRemoveDesglose) {
    btnRemoveDesglose.closest('.pedido-desglose-row')?.remove();
    return;
  }

  if (e.target.closest('#btnCreatePedido')) {
    crearNuevoPedidoDesdeFormulario();
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
    subirEvidenciaPedido(btnSubirEvidencia.getAttribute('data-pid'), btnSubirEvidencia.getAttribute('data-area'));
    return;
  }

  const btnPublicarIncidencia = e.target.closest('[data-action="publicar-incidencia"]');
  if (btnPublicarIncidencia) {
    publicarIncidenciaAdmin(btnPublicarIncidencia.getAttribute('data-area'), Number(btnPublicarIncidencia.getAttribute('data-idx')));
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

  // Alertas rápidas ficticias (Toasts del prototipo)
  const toastBtn = e.target.closest('[data-toast]');
  if (toastBtn) {
    toast(toastBtn.getAttribute('data-toast'));
    if (toastBtn.getAttribute('data-back')) {
      go(toastBtn.getAttribute('data-back'), toastBtn.getAttribute('data-back-arg'));
    }
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
