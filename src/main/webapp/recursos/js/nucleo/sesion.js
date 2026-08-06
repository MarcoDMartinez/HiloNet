/* Sesión — entrar/salir de la app: procesa autenticación vía API, arma la sesión, muestra el shell y navega a la vista inicial según el rol. */

// Detecta automáticamente el CONTEXT_PATH si no ha sido definido globalmente
const CONTEXT_PATH_SESION = typeof CONTEXT_PATH !== 'undefined'
    ? CONTEXT_PATH
    : (() => {
      const idx = window.location.pathname.indexOf('/', 1);
      return idx !== -1 ? window.location.pathname.substring(0, idx) : '';
    })();

/**
 * Captura los datos del formulario de login y los envía a la API Java (/api/auth/login)
 */
function iniciarSesionDesdeFormulario() {
  const userEl = $('#loginUser');
  const passEl = $('#loginPassword');
  const username = userEl ? userEl.value.trim() : '';
  const password = passEl ? passEl.value.trim() : '';

  if (!username || !password) {
    if (typeof toast === 'function') {
      toast('Por favor, ingresa tu número de teléfono y contraseña.', 'error');
    }
    return;
  }

  fetch(`${CONTEXT_PATH_SESION}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: username, password: password })
  })
      .then((response) => response.json().then((data) => ({ status: response.status, body: data })))
      .then(({ status, body }) => {
        if (body.success && body.usuario) {
          entrar(body.usuario);
        } else {
          const msg = body.message || 'Usuario o contraseña incorrectos.';
          if (typeof toast === 'function') {
            toast(msg, 'error');
          }
        }
      })
      .catch((error) => {
        console.error('Error durante la autenticación:', error);
        if (typeof toast === 'function') {
          toast('No se pudo conectar con el servidor. Revisa tu conexión.', 'error');
        }
      });
}

/**
 * Inicia la interfaz de usuario. Acepta tanto el objeto 'usuario' de la API como cadenas legacy ('admin').
 */
function entrar(who, areaData = null) {
  $('#login').classList.add('hidden');
  $('#app').classList.remove('hidden');

  // Caso 1: Se recibe el objeto de usuario directamente desde el backend Java
  if (typeof who === 'object' && who !== null) {
    const usuario = who;
    const esAdmin = usuario.rol === 'ADMIN' || usuario.rol === 'Administrador';

    if (esAdmin) {
      session = { rol: 'admin', area: null, usuario: usuario };
      $('#tbName').textContent = usuario.nombre || 'Administrador';
      $('#tbRole').textContent = 'Admin';
      renderSidebar();
      go('pedidos');
    } else {
      const areaNombre = usuario.area || 'General';
      session = { rol: 'worker', area: areaNombre, usuario: usuario };
      $('#tbName').textContent = usuario.nombre || 'Trabajador';
      $('#tbRole').textContent = 'Trabajador · ' + areaNombre;
      renderSidebar();
      go('inicio');
    }
    return;
  }

  // Caso 2: Compatibilidad con llamada manual/legacy por string ('admin' o clave de área)
  if (who === 'admin') {
    session = { rol: 'admin', area: null };
    $('#tbName').textContent = 'Administrador';
    $('#tbRole').textContent = 'Admin';
    renderSidebar();
    go('pedidos');
  } else {
    const area = areaData || (typeof getAreaForUser === 'function' ? getAreaForUser(who) : null) || (Array.isArray(AREAS_CAT) ? AREAS_CAT.find((item) => item.areaKey === who) : null);
    const info = typeof getAreaInfo === 'function' ? getAreaInfo(area || who) : { worker: who, label: who, areaKey: who };
    session = { rol: 'worker', area: info.areaKey || who };
    $('#tbName').textContent = info.worker || who;
    $('#tbRole').textContent = 'Trabajador · ' + (info.label || 'General');
    renderSidebar();
    go('inicio');
  }
}

/**
 * Cierra la sesión en el cliente e invalida la sesión HTTP en el backend Java (/api/auth/logout)
 */
function salir() {
  fetch(`${CONTEXT_PATH_SESION}/api/auth/logout`, { method: 'POST' }).catch(() => {});

  $('#app').classList.add('hidden');
  $('#login').classList.remove('hidden');
  if ($('#loginUser')) $('#loginUser').value = '';
  if ($('#loginPassword')) $('#loginPassword').value = '';
}