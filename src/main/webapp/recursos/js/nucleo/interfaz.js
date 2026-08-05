/* Interfaz — modal de notificación (toast) del sistema. */
function toast(msg, tipo = 'exito') {
  const esError = tipo === 'error';
  const overlay = $('#overlay');
  const modal = $('#modal');
  modal.innerHTML = `
    <button class="close" id="closeModal">×</button>
    <div class="toast-body ${esError ? 'toast-error' : 'toast-exito'}">
      <div class="toast-icon">${esError ? '✕' : '✓'}</div>
      <div>
        <h2>${esError ? 'Falta información' : 'Notificación del sistema'}</h2>
        <p class="sec mt">${msg}</p>
      </div>
    </div>
    <button class="btn ${esError ? 'btn-danger' : 'btn-primary'} mt" id="btnAcceptModal" style="float:right">Aceptar</button>
  `;
  overlay.classList.add('open');
  overlay.style.display = '';

  const closeFn = () => {
    overlay.classList.remove('open');
    overlay.style.display = '';
  };
  $('#closeModal').onclick = closeFn;
  $('#btnAcceptModal').onclick = closeFn;
}

/* Confirmación estilizada (reemplaza confirm() nativo) — muestra el mensaje y ejecuta onConfirmar solo si el usuario acepta. */
function confirmarAccion(mensaje, onConfirmar, textoBoton = 'Eliminar') {
  const overlay = $('#overlay');
  const modal = $('#modal');
  modal.innerHTML = `
    <button class="close" id="closeModal">×</button>
    <div class="toast-body toast-error">
      <div class="toast-icon">!</div>
      <div>
        <h2>Confirmar acción</h2>
        <p class="sec mt">${mensaje}</p>
      </div>
    </div>
    <div class="flex gap-10 mt" style="justify-content:flex-end;">
      <button class="btn btn-ghost" id="btnCancelarModal">Cancelar</button>
      <button class="btn btn-danger" id="btnConfirmarModal">${textoBoton}</button>
    </div>
  `;
  overlay.classList.add('open');
  overlay.style.display = '';

  const cerrar = () => {
    overlay.classList.remove('open');
    overlay.style.display = '';
  };
  $('#closeModal').onclick = cerrar;
  $('#btnCancelarModal').onclick = cerrar;
  $('#btnConfirmarModal').onclick = () => {
    cerrar();
    onConfirmar();
  };
}

/* Genera una contraseña temporal aleatoria con el formato Xxxx-Xxx-999. */
function generarPasswordAleatoria() {
  const letras = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  const numeros = '23456789';
  const bloque = (longitud, alfabeto) => Array.from({ length: longitud }, () => alfabeto[Math.floor(Math.random() * alfabeto.length)]).join('');
  return `${bloque(4, letras)}-${bloque(3, letras)}-${bloque(3, numeros)}`;
}

/* Abre el selector de archivos del sistema y agrega la imagen elegida como evidencia junto al botón "+ Subir". */
function abrirSelectorEvidencia(uploadEl) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.style.display = 'none';

  input.addEventListener('change', () => {
    const file = input.files && input.files[0];
    input.remove();
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const box = document.createElement('div');
      box.className = uploadEl.classList.contains('img-square') ? 'evidencia-box img-square' : 'evidencia-box';
      box.innerHTML = `<img src="${reader.result}" alt="Evidencia subida" style="width:100%; height:100%; object-fit:cover; border-radius:inherit;">`;
      uploadEl.parentElement.insertBefore(box, uploadEl);
      toast('Evidencia subida correctamente.');
    };
    reader.readAsDataURL(file);
  });

  document.body.appendChild(input);
  input.click();
}

/* Valida que los campos requeridos (por id) tengan contenido; si falta alguno, muestra la alerta de error y regresa false. */
function validarCamposRequeridos(ids, mensajeError) {
  const faltante = ids.some((id) => !$(`#${id}`)?.value?.toString().trim());
  if (faltante) {
    toast(mensajeError, 'error');
    return false;
  }
  return true;
}
