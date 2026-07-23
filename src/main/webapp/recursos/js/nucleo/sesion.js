/* Sesión — entrar/salir de la app: arma la sesión, muestra el shell y navega a la vista inicial según el rol. */
function entrar(who, areaData = null) {
  $('#login').classList.add('hidden');
  $('#app').classList.remove('hidden');
  if (who === 'admin') {
    session = { rol: 'admin', area: null };
    $('#tbName').textContent = 'Administrador';
    $('#tbRole').textContent = 'Admin';
    renderSidebar();
    go('pedidos');
  } else {
    const area = areaData || getAreaForUser(who) || AREAS_CAT.find((item) => item.areaKey === who);
    const info = getAreaInfo(area || who);
    session = { rol: 'worker', area: info.areaKey || who };
    $('#tbName').textContent = info.worker;
    $('#tbRole').textContent = 'Trabajador · ' + info.label;
    renderSidebar();
    go('inicio');
  }
}

function salir() {
  $('#app').classList.add('hidden');
  $('#login').classList.remove('hidden');
  $('#loginUser').value = '';
  $('#loginPassword').value = '';
}
