<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recuperar acceso — HiloNet</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${pageContext.request.contextPath}/WEB-INF/recursos/css/base/variables.css">
  <link rel="stylesheet" href="${pageContext.request.contextPath}/WEB-INF/recursos/css/base/reinicio-estilos.css">
  <link rel="stylesheet" href="${pageContext.request.contextPath}/WEB-INF/recursos/css/base/tipografia.css">
  <link rel="stylesheet" href="${pageContext.request.contextPath}/WEB-INF/recursos/css/componentes/botones.css">
  <link rel="stylesheet" href="${pageContext.request.contextPath}/WEB-INF/recursos/css/componentes/formularios.css">
  <link rel="stylesheet" href="${pageContext.request.contextPath}/WEB-INF/recursos/css/paginas/inicio-sesion.css">
  <link rel="stylesheet" href="${pageContext.request.contextPath}/WEB-INF/recursos/css/paginas/recuperacion-contrasena.css">
</head>
<body>
  <div class="recover-wrap">
    <div class="recover-card" id="recoverCard">
      <!-- Vista: formulario de recuperación -->
      <section id="recoverForm" class="recover-section">
        <div class="logo">🔒</div>
        <h1>Recuperar contraseña</h1>
        <p class="hint">Ingresa tu nombre de usuario y correo registrado para recibir un enlace de verificación.</p>

        <div class="field">
          <label for="recoverUsername">Nombre de usuario *</label>
          <input type="text" id="recoverUsername" placeholder="Tu nombre de usuario">
        </div>

        <div class="field">
          <label for="recoverEmail">Correo electrónico registrado *</label>
          <input type="email" id="recoverEmail" placeholder="correo@ejemplo.com">
        </div>

        <div class="helper-note">
          <p>El administrador registró tu correo al crear tu cuenta.</p>
          <p class="muted">Si no lo conoces, contacta al administrador directamente.</p>
        </div>

        <button id="btnSendRecovery" class="btn btn-primary btn-lg btn-block" type="button">Enviar correo de verificación</button>

        <hr class="separator">

        <a href="${pageContext.request.contextPath}/" id="btnBackToLogin" class="btn btn-ghost btn-lg btn-block">Volver al inicio de sesión</a>
      </section>

      <!-- Vista: éxito - correo enviado -->
      <section id="recoverSuccess" class="recover-section hidden">
        <div class="success-badge">✓</div>
        <h2>Correo enviado</h2>

        <div class="message-box">
          <strong id="sentEmail">Correo enviado a: --</strong>
          <div class="muted">El enlace expira en 30 minutos.</div>
        </div>

        <a href="${pageContext.request.contextPath}/" class="btn btn-primary btn-lg btn-block">Volver al inicio de sesión</a>

        <p class="muted small">¿No recibiste el correo? Espera 2 minutos y vuelve a intentarlo, o contacta a tu administrador.</p>
      </section>
    </div>
  </div>

  <script src="${pageContext.request.contextPath}/WEB-INF/recursos/js/paginas/autenticacion/recuperacion.js"></script>
</body>
</html>
