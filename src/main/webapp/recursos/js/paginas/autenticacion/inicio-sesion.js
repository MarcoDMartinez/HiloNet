/* Login — valida credenciales, procesa el envío del formulario y maneja el flujo de recuperación de contraseña. */
function validarCredenciales(usuario, password) {
  const user = (usuario || '').trim().toLowerCase();
  const pass = (password || '').trim();

  if (user === 'ad' || user === 'admin') {
    if (pass !== (CONTRASENAS['admin'] || '123')) {
      return { ok: false, message: 'La contraseña es incorrecta.' };
    }
    return { ok: true, who: 'admin' };
  }

  const area = typeof window.getAreaForUser === 'function' ? window.getAreaForUser(user) : null;
  if (area && /^tr\d+$/.test(user)) {
    if (pass !== (CONTRASENAS[area.areaKey] || '123')) {
      return { ok: false, message: 'La contraseña es incorrecta.' };
    }
    return { ok: true, who: area.areaKey, area };
  }

  return { ok: false, message: 'Usuario no válido. Usa ad, tr1, tr2, tr3 o los siguientes usuarios creados.' };
}

function iniciarSesionDesdeFormulario() {
  const usuario = $('#loginUser').value;
  const password = $('#loginPassword').value;
  const resultado = validarCredenciales(usuario, password);

  if (!resultado.ok) {
    toast(resultado.message, 'error');
    return;
  }

  entrar(resultado.who, resultado.area);
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
        : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3l18 18"></path><path d="M10.6 10.6A3 3 0 0 0 13.4 13.4"></path><path d="M9 5.2A10.9 10.9 0 0 1 12 5c6 0 9.5 6 9.5 6a16.5 16.5 0 0 1-3.2 4.1"></path><path d="M6.6 7.9A16.8 16.8 0 0 0 2.5 12s3.5 6 9.5 6a10.5 10.5 0 0 0 3.1-.5"></path></svg>`;
      button.setAttribute('aria-label', showing ? 'Mostrar contraseña' : 'Ocultar contraseña');
    }
  }
});

window.validarCredenciales = validarCredenciales;
window.iniciarSesionDesdeFormulario = iniciarSesionDesdeFormulario;
