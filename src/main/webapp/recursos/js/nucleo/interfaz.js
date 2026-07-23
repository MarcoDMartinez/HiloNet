/* Interfaz — modal de notificación (toast) del sistema. */
function toast(msg) {
  const overlay = $('#overlay');
  const modal = $('#modal');
  modal.innerHTML = `
    <button class="close" id="closeModal">×</button>
    <h2>Notificación del sistema</h2>
    <p class="sec mt">${msg}</p>
    <button class="btn btn-primary mt" id="btnAcceptModal" style="float:right">Aceptar</button>
  `;
  overlay.classList.add('open');

  const closeFn = () => overlay.classList.remove('open');
  $('#closeModal').onclick = closeFn;
  $('#btnAcceptModal').onclick = closeFn;
}
