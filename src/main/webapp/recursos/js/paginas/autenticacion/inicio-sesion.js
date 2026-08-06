/* Login — valida credenciales contra la base de datos y maneja el flujo de recuperación de contraseña. */

// Obtiene dinámicamente el context path del proyecto (ej: "/ProyectoTextil")
const CONTEXT_PATH_LOGIN = typeof CONTEXT_PATH !== 'undefined'
    ? CONTEXT_PATH
    : (() => {
      const idx = window.location.pathname.indexOf('/', 1);
      return idx !== -1 ? window.location.pathname.substring(0, idx) : '';
    })();

async function validarCredenciales(usuario, password) {
  const user = (usuario || '').trim();
  const pass = (password || '').trim();

  if (!user || !pass) {
    return { ok: false, message: 'Usuario y contraseña requeridos.' };
  }

  try {
    const response = await fetch(`${CONTEXT_PATH_LOGIN}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user, password: pass })
    });
    const data = await response.json();

    // === DEPURACIÓN: MUESTRA EN CONSOLA LA RESPUESTA REAL DE JAVA/ORACLE ===
    console.log("RESPUESTA REAL DE JAVA:", data);

    if (!response.ok || !data.success) {
      return { ok: false, message: data.message || 'Credenciales inválidas.' };
    }

    const usuarioData = data.usuario || {};

    // Extrae el ID de rol (numérico) y el nombre de rol (texto) traídos desde Oracle
    const idRol = Number(usuarioData.idRol || usuarioData.id_rol || usuarioData.ID_ROL || 0);
    const rolTexto = String(usuarioData.rol || usuarioData.rolNombre || usuarioData.ROL_NOMBRE || '').trim().toUpperCase();

    // Es Admin si idRol es 1 o si la cadena es ADMIN / ADMINISTRADOR
    const esAdmin = idRol === 1 || rolTexto === 'ADMIN' || rolTexto === 'ADMINISTRADOR';

    if (esAdmin) {
      return { ok: true, who: 'admin' };
    }

    // Manejo seguro de catálogo de áreas para trabajadores
    const catalogoAreas = typeof AREAS_CAT !== 'undefined' && Array.isArray(AREAS_CAT) ? AREAS_CAT : [];
    const area = catalogoAreas.find((item) => item.nom === usuarioData.area || item.areaKey === usuarioData.area) || null;

    return {
      ok: true,
      who: usuarioData.id ? String(usuarioData.id) : user,
      area: area ? {
        ...area,
        areaKey: area.areaKey || (typeof normalizarTextoParaClave === 'function' ? normalizarTextoParaClave(area.nom) : area.nom)
      } : null
    };
  } catch (error) {
    console.error('Error en validarCredenciales:', error);
    return { ok: false, message: 'No se pudo conectar con el servidor.' };
  }
}

async function iniciarSesionDesdeFormulario() {
  const userEl = document.querySelector('#loginUser');
  const passEl = document.querySelector('#loginPassword');

  const usuario = userEl ? userEl.value : '';
  const password = passEl ? passEl.value : '';

  const resultado = await validarCredenciales(usuario, password);

  if (!resultado.ok) {
    if (typeof toast === 'function') {
      toast(resultado.message, 'error');
    } else {
      alert(resultado.message);
    }
    return;
  }

  if (typeof entrar === 'function') {
    entrar(resultado.who, resultado.area);
  }
}

document.addEventListener('click', (e) => {
  if (e.target.closest('#btnTogglePassword')) {
    e.preventDefault();
    const input = document.getElementById('loginPassword');
    const button = document.getElementById('btnTogglePassword');
    if (input && button) {
      const showing = input.type === 'text';
      input.type = showing ? 'password' : 'text';
      button.innerHTML = showing
          ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6S2.5 12 2.5 12Z"></path><circle cx="12" cy="12" r="3"></circle></svg>`
          : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3l18 18"></path><path d="M10.6 10.6A3 3 0 0 0 13.4 13.4"></path><path d="M9 5.2A10.9 10.9 0 0 1 12 5c6 0 9.5 6 9.5 6a16.5 16.5 0 0 1-3.2 4.1"></path><path d="M6.6 7.9A16.8 16.8 0 0 0 2.5 12s3.5-6 9.5 6a10.5 10.5 0 0 0 3.1-.5"></path></svg>`;
      button.setAttribute('aria-label', showing ? 'Mostrar contraseña' : 'Ocultar contraseña');
    }
  }
});

window.validarCredenciales = validarCredenciales;
window.iniciarSesionDesdeFormulario = iniciarSesionDesdeFormulario;