<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HiloNet — Gestión de taller textil</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/WEB-INF/recursos/css/base/variables.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/WEB-INF/recursos/css/base/reinicio-estilos.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/WEB-INF/recursos/css/base/tipografia.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/WEB-INF/recursos/css/estructura/estructura-general.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/WEB-INF/recursos/css/estructura/barra-lateral.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/WEB-INF/recursos/css/estructura/barra-superior.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/WEB-INF/recursos/css/componentes/botones.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/WEB-INF/recursos/css/componentes/formularios.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/WEB-INF/recursos/css/componentes/tablas.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/WEB-INF/recursos/css/componentes/etiquetas-estado.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/WEB-INF/recursos/css/componentes/tarjetas.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/WEB-INF/recursos/css/componentes/pildoras-filtro.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/WEB-INF/recursos/css/componentes/modales.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/WEB-INF/recursos/css/componentes/listas.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/WEB-INF/recursos/css/componentes/progreso.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/WEB-INF/recursos/css/componentes/migas-pan.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/WEB-INF/recursos/css/componentes/evidencias.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/WEB-INF/recursos/css/componentes/avatares.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/WEB-INF/recursos/css/componentes/animaciones.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/WEB-INF/recursos/css/paginas/inicio-sesion.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/WEB-INF/recursos/css/paginas/formulario-pedido.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/WEB-INF/recursos/css/paginas/recuperacion-contrasena.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/WEB-INF/recursos/css/diseno-adaptable.css">
</head>
<body>
<!-- ============ LOGIN ============ -->
<div id="login" class="login-wrap">
    <!-- Tarjeta Principal de Login -->
    <div class="login-card" id="cardLoginMain">
        <div class="logo">🧵</div>
        <h1>HiloNet</h1>
        <p class="tagline">Sistema de gestión del taller textil</p>

        <div class="field">
            <label for="loginUser">Matrícula o Usuario</label>
            <input type="text" placeholder="Tu matrícula o usuario" id="loginUser">
        </div>

        <div class="field">
            <label for="loginPassword">Contraseña</label>
            <div class="password-field">
                <input type="password" placeholder="••••••••" id="loginPassword">
                <button type="button" class="password-toggle" id="btnTogglePassword" aria-label="Mostrar contraseña">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6S2.5 12 2.5 12Z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                </button>
            </div>
        </div>

        <div class="forgot-password-container">
            <a href="#" class="link-forgot" id="btnRecoverInside">¿Olvidaste tu contraseña?</a>
        </div>

        <button id="btnEnterDefault" class="btn btn-primary btn-lg btn-block" type="button">Entrar</button>

        <p class="contact-admin-text">
            ¿No tienes cuenta? Contacta a tu administrador
        </p>
    </div>

    <!-- NUEVA: Tarjeta Dinámica de Recuperación de Contraseña -->
    <div class="login-card hidden" id="cardRecover">
        <div class="logo">🔒</div>
        <h1 id="recoverTitle">Recuperar Acceso</h1>
        <p class="tagline" id="recoverSubtitle">Ingresa tus datos para restablecer tu cuenta.</p>

        <div id="recoverFormContext">
            <button class="btn btn-ghost btn-block" id="btnBackToLogin" type="button">← Regresar al login</button>
        </div>
    </div>
</div>



<!-- ============ APP (admin + trabajador) ============ -->
<div id="app" class="app hidden">
    <aside class="sidebar" id="sidebar"></aside>
    <div class="main">
        <div class="topbar">
            <div class="who">
                <b id="tbName">Administrador</b>
                <span id="tbRole">Admin</span>
            </div>
            <div class="avatar"></div>
        </div>
        <div class="content" id="content"></div>
    </div>
</div>

<!-- Overlay para modales -->
<div class="overlay" id="overlay">
    <div class="modal" id="modal"></div>
</div>

<script src="${pageContext.request.contextPath}/WEB-INF/recursos/js/nucleo/utilidades-dom.js"></script>
<script src="${pageContext.request.contextPath}/WEB-INF/recursos/js/nucleo/datos-iniciales.js"></script>
<script src="${pageContext.request.contextPath}/WEB-INF/recursos/js/nucleo/persistencia.js"></script>
<script src="${pageContext.request.contextPath}/WEB-INF/recursos/js/nucleo/gestion-areas.js"></script>
<script src="${pageContext.request.contextPath}/WEB-INF/recursos/js/nucleo/progreso-pedidos.js"></script>
<script src="${pageContext.request.contextPath}/WEB-INF/recursos/js/nucleo/gestion-incidencias.js"></script>
<script src="${pageContext.request.contextPath}/WEB-INF/recursos/js/nucleo/perfil-trabajadores.js"></script>
<script src="${pageContext.request.contextPath}/WEB-INF/recursos/js/nucleo/interfaz.js"></script>
<script src="${pageContext.request.contextPath}/WEB-INF/recursos/js/nucleo/enrutador.js"></script>
<script src="${pageContext.request.contextPath}/WEB-INF/recursos/js/nucleo/sesion.js"></script>
<script src="${pageContext.request.contextPath}/WEB-INF/recursos/js/nucleo/vistas-compartidas.js"></script>
<script src="${pageContext.request.contextPath}/WEB-INF/recursos/js/nucleo/eventos-globales.js"></script>
<script src="${pageContext.request.contextPath}/WEB-INF/recursos/js/paginas/autenticacion/inicio-sesion.js"></script>
<script src="${pageContext.request.contextPath}/WEB-INF/recursos/js/paginas/administrador/nucleo-administrador.js"></script>
<script src="${pageContext.request.contextPath}/WEB-INF/recursos/js/paginas/administrador/utilidades-administrador.js"></script>
<script src="${pageContext.request.contextPath}/WEB-INF/recursos/js/paginas/administrador/vista-pedidos.js"></script>
<script src="${pageContext.request.contextPath}/WEB-INF/recursos/js/paginas/administrador/vista-areas.js"></script>
<script src="${pageContext.request.contextPath}/WEB-INF/recursos/js/paginas/administrador/vista-usuarios.js"></script>
<script src="${pageContext.request.contextPath}/WEB-INF/recursos/js/paginas/administrador/vista-incidencias.js"></script>
<script src="${pageContext.request.contextPath}/WEB-INF/recursos/js/paginas/administrador/vista-soporte.js"></script>
<script src="${pageContext.request.contextPath}/WEB-INF/recursos/js/paginas/trabajadores/nucleo-trabajadores.js"></script>
<script src="${pageContext.request.contextPath}/WEB-INF/recursos/js/paginas/trabajadores/vista-inicio.js"></script>
<script src="${pageContext.request.contextPath}/WEB-INF/recursos/js/paginas/trabajadores/vista-incidencias.js"></script>
<script src="${pageContext.request.contextPath}/WEB-INF/recursos/js/paginas/trabajadores/vista-pedidos.js"></script>
<script src="${pageContext.request.contextPath}/WEB-INF/recursos/js/paginas/autenticacion/recuperacion.js"></script>
<script src="${pageContext.request.contextPath}/WEB-INF/recursos/js/nucleo/modal-recuperacion.js"></script>