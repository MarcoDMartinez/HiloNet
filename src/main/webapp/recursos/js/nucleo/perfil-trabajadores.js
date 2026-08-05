/* Trabajadores — guardado de cambios de área asignada y del perfil de un empleado. */
function guardarAreaTrabajador(id) {
  const areaSelect = $('#editWorkerArea');
  if (!areaSelect) return;
  const nuevaArea = areaSelect.value;
  const trabajador = USUARIOS.find((user) => user.id === id);
  if (!trabajador) return;

  trabajador.area = nuevaArea;
  guardarEstadoPersistido();
  toast('Área del trabajador actualizada.');
  go('perfilEmpleado', id);
}

function guardarTrabajador(id) {
  const nameInput = $('#editWorkerName');
  const userInput = $('#editWorkerUser');
  const areaSelect = $('#editWorkerAreaFull');
  const puestoInput = $('#editWorkerPuesto');

  if (!nameInput || !userInput || !areaSelect) return;
  const trabajador = USUARIOS.find((user) => user.id === id);
  if (!trabajador) return;

  if (!nameInput.value.trim() || !userInput.value.trim()) {
    toast('Completa los campos obligatorios: nombre y nombre de usuario.', 'error');
    return;
  }

  trabajador.nom = nameInput.value.trim();
  trabajador.user = userInput.value.trim();
  trabajador.area = areaSelect.value;
  trabajador.puesto = puestoInput ? puestoInput.value.trim() : trabajador.puesto;

  guardarEstadoPersistido();
  toast('Perfil del trabajador actualizado correctamente.');
  go('perfilEmpleado', id);
}
