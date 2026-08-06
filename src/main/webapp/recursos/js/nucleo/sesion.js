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
  const valorInput = userEl ? userEl.value.trim() : '';
  const password = passEl ? passEl.value.trim() : '';

  if (!valorInput || !password) {
    if (typeof toast === 'function') {
      toast('Por favor, ingresa tu usuario o matrícula y contraseña.', 'error');
    }
    return;
  }

  // Se envían múltiples llaves compatibles para evitar error 400 Bad Request en el backend
  const payload = {
    username: valorInput,
    numeroTelefono: valorInput,
    matricula: valorInput,
    password: password
  };

  fetch(`${CONTEXT_PATH_SESION}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
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
  const loginEl = $('#login');
  const appEl = $('#app');

  if (loginEl) loginEl.classList.add('hidden');
  if (appEl) appEl.classList.remove('hidden');

  // Caso 1: Se recibe el objeto de usuario directamente desde el backend Java
  if (typeof who === 'object' && who !== null) {
    const usuario = who;

    // Normalización ultra flexible de Rol (soporta IDs de Oracle y variaciones de texto)
    const idRol = Number(usuario.idRol || usuario.id_rol || usuario.idRolUsuario || usuario.ID_ROL || 0);
    const rolStr = String(usuario.rol || usuario.rolNombre || usuario.rol_nombre || usuario.nombreRol || '').trim().toLowerCase();

    const esAdmin = rolStr === 'admin' ||
        rolStr === 'administrador' ||
        rolStr.includes('admin') ||
        idRol === 1 ||
        idRol === 21;

    if (esAdmin) {
      window.session = { rol: 'admin', idRol: idRol || 1, area: null, usuario: usuario };
      if (typeof session !== 'undefined') session = window.session;

      if ($('#tbName')) $('#tbName').textContent = usuario.nombre || usuario.nombreUsuario || 'Administrador';
      if ($('#tbRole')) $('#tbRole').textContent = 'Admin';

      if (typeof renderSidebar === 'function') renderSidebar();
      if (typeof go === 'function') go('pedidos');
    } else {
      const areaNombre = usuario.area || usuario.areaNombre || usuario.area_nombre || 'General';
      window.session = { rol: 'worker', idRol: idRol, area: areaNombre, usuario: usuario };
      if (typeof session !== 'undefined') session = window.session;

      if ($('#tbName')) $('#tbName').textContent = usuario.nombre || 'Trabajador';
      if ($('#tbRole')) $('#tbRole').textContent = 'Trabajador · ' + areaNombre;

      if (typeof renderSidebar === 'function') renderSidebar();
      if (typeof go === 'function') go('inicio');
    }
    return;
  }

  // Caso 2: Compatibilidad con llamada manual/legacy por string ('admin' o clave de área)
  if (who === 'admin') {
    window.session = { rol: 'admin', idRol: 1, area: null };
    if (typeof session !== 'undefined') session = window.session;

    if ($('#tbName')) $('#tbName').textContent = 'Administrador';
    if ($('#tbRole')) $('#tbRole').textContent = 'Admin';

    if (typeof renderSidebar === 'function') renderSidebar();
    if (typeof go === 'function') go('pedidos');
  } else {
    const area = areaData || (typeof getAreaForUser === 'function' ? getAreaForUser(who) : null) || (Array.isArray(AREAS_CAT) ? AREAS_CAT.find((item) => item.areaKey === who) : null);
    const info = typeof getAreaInfo === 'function' ? getAreaInfo(area || who) : { worker: who, label: who, areaKey: who };

    window.session = { rol: 'worker', area: info.areaKey || who };
    if (typeof session !== 'undefined') session = window.session;

    if ($('#tbName')) $('#tbName').textContent = info.worker || who;
    if ($('#tbRole')) $('#tbRole').textContent = 'Trabajador · ' + (info.label || 'General');

    if (typeof renderSidebar === 'function') renderSidebar();
    if (typeof go === 'function') go('inicio');
  }
}

/**
 * Cierra la sesión en el cliente e invalida la sesión HTTP en el backend Java (/api/auth/logout)
 */
function salir() {
  fetch(`${CONTEXT_PATH_SESION}/api/auth/logout`, { method: 'POST' }).catch(() => {});

  const appEl = $('#app');
  const loginEl = $('#login');

  if (appEl) appEl.classList.add('hidden');
  if (loginEl) loginEl.classList.remove('hidden');

  if ($('#loginUser')) $('#loginUser').value = '';
  if ($('#loginPassword')) $('#loginPassword').value = '';

  window.session = { rol: null, area: null };
}