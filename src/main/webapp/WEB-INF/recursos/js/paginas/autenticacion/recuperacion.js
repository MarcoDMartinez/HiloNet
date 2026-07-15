/* Lógica de recuperación — reutilizable para vista standalone y modal */
(function(){
  function maskEmail(email){
    if(!email || email.indexOf('@') === -1) return email || '--';
    const [local, domain] = email.split('@');
    if(local.length <= 2) return local[0] + '*****@' + domain;
    return local[0] + '*****' + local[local.length-1] + '@' + domain;
  }

  function showSuccess(root, email){
    const formView = root.querySelector('#recoverForm');
    const successView = root.querySelector('#recoverSuccess');
    const sentEmailEl = root.querySelector('#sentEmail');
    if(formView && successView){ formView.classList.add('hidden'); successView.classList.remove('hidden'); }
    if(sentEmailEl) sentEmailEl.textContent = 'Correo enviado a: ' + maskEmail(email);
  }

  function wireRecovery(root=document){
    if(!root) root = document;
    const btnSend = root.querySelector('#btnSendRecovery');
    const btnBack = root.querySelector('#btnBackToLogin');
    const formView = root.querySelector('#recoverForm');
    const successView = root.querySelector('#recoverSuccess');

    if(btnSend){
      btnSend.addEventListener('click', function(){
        const emailInput = root.querySelector('#recoverEmail');
        const userInput = root.querySelector('#recoverUsername');
        const email = emailInput ? emailInput.value.trim() : '';
        const user = userInput ? userInput.value.trim() : '';
        if(!user){ alert('Ingresa tu nombre de usuario.'); return; }
        if(!email){ alert('Ingresa tu correo registrado.'); return; }
        showSuccess(root, email);
      });
    }

    if(btnBack){
      btnBack.addEventListener('click', function(e){
        if(root !== document){ // si está dentro de modal, cerrar overlay
          const overlay = document.getElementById('overlay');
          if(overlay){ overlay.classList.add('hidden'); overlay.classList.remove('open'); overlay.style.display = ''; }
        }
      });
    }
  }

  // Inicializar si estamos en la página standalone
  if(document.getElementById('recoverCard')){
    document.addEventListener('DOMContentLoaded', function(){ wireRecovery(document); });
  }

  window.wireRecovery = wireRecovery;
})();
