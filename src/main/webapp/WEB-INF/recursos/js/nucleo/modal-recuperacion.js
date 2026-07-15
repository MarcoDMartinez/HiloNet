/* Modal de recuperación — carga la vista de `paginas/recuperar-contrasena.html` dentro del modal
   Usa `wireRecovery(root)` definido en `recursos/js/paginas/autenticacion/recuperacion.js` */
(function(){
  const overlay = document.getElementById('overlay');
  const modal = document.getElementById('modal');

  function closeModal(){
    if(overlay){ overlay.classList.add('hidden'); overlay.classList.remove('open'); overlay.style.display = ''; }
    if(modal) modal.innerHTML = '';
  }

  function openModalWithRecovery(){
    fetch('paginas/recuperar-contrasena.html')
      .then(r => r.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const card = doc.querySelector('.recover-card') || doc.getElementById('recoverCard');
        if(!card) return;
        modal.innerHTML = card.innerHTML;
        // show overlay centered
        if(overlay){ overlay.classList.remove('hidden'); overlay.classList.add('open'); overlay.style.display = 'flex'; }

        // wire events inside modal using reusable script
        if(window.wireRecovery) window.wireRecovery(modal);
        if(modal.querySelector('#btnBackToLogin')) modal.querySelector('#btnBackToLogin').addEventListener('click', function(e){ e.preventDefault(); closeModal(); });

        // cerrar al hacer click fuera del modal
        if(overlay){ overlay.addEventListener('click', function(ev){ if(ev.target === overlay) closeModal(); }); }
      })
      .catch(() => { alert('No se pudo cargar la vista de recuperación.'); });
  }

  document.addEventListener('click', function(e){
    if(e.target.closest && e.target.closest('#btnRecoverInside')){
      e.preventDefault();
      openModalWithRecovery();
    }
  });
})();
