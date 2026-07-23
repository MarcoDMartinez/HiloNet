<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Trabajadores — HiloNet</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${pageContext.request.contextPath}/recursos/css/base/variables.css">
  <link rel="stylesheet" href="${pageContext.request.contextPath}/recursos/css/base/reinicio-estilos.css">
  <link rel="stylesheet" href="${pageContext.request.contextPath}/recursos/css/base/tipografia.css">
  <link rel="stylesheet" href="${pageContext.request.contextPath}/recursos/css/estructura/estructura-general.css">
  <link rel="stylesheet" href="${pageContext.request.contextPath}/recursos/css/estructura/barra-lateral.css">
  <link rel="stylesheet" href="${pageContext.request.contextPath}/recursos/css/estructura/barra-superior.css">
  <link rel="stylesheet" href="${pageContext.request.contextPath}/recursos/css/componentes/botones.css">
  <link rel="stylesheet" href="${pageContext.request.contextPath}/recursos/css/componentes/formularios.css">
  <link rel="stylesheet" href="${pageContext.request.contextPath}/recursos/css/componentes/tablas.css">
  <link rel="stylesheet" href="${pageContext.request.contextPath}/recursos/css/componentes/etiquetas-estado.css">
  <link rel="stylesheet" href="${pageContext.request.contextPath}/recursos/css/componentes/tarjetas.css">
  <link rel="stylesheet" href="${pageContext.request.contextPath}/recursos/css/componentes/pildoras-filtro.css">
  <link rel="stylesheet" href="${pageContext.request.contextPath}/recursos/css/componentes/modales.css">
  <link rel="stylesheet" href="${pageContext.request.contextPath}/recursos/css/componentes/listas.css">
  <link rel="stylesheet" href="${pageContext.request.contextPath}/recursos/css/componentes/progreso.css">
  <link rel="stylesheet" href="${pageContext.request.contextPath}/recursos/css/componentes/migas-pan.css">
  <link rel="stylesheet" href="${pageContext.request.contextPath}/recursos/css/componentes/evidencias.css">
  <link rel="stylesheet" href="${pageContext.request.contextPath}/recursos/css/componentes/avatares.css">
  <link rel="stylesheet" href="${pageContext.request.contextPath}/recursos/css/componentes/animaciones.css">
  <link rel="stylesheet" href="${pageContext.request.contextPath}/recursos/css/paginas/inicio-sesion.css">
  <link rel="stylesheet" href="${pageContext.request.contextPath}/recursos/css/paginas/formulario-pedido.css">
  <link rel="stylesheet" href="${pageContext.request.contextPath}/recursos/css/diseno-adaptable.css">
</head>
<body>
  <div class="app">
    <aside class="sidebar" id="sidebar"></aside>
    <div class="main">
      <div class="topbar">
        <div class="who">
          <b id="tbName">Trabajador</b>
          <span id="tbRole">Área</span>
        </div>
        <div class="avatar"></div>
      </div>
      <div class="content" id="content"></div>
    </div>
  </div>

  <div class="overlay" id="overlay">
    <div class="modal" id="modal"></div>
  </div>

  <script src="${pageContext.request.contextPath}/recursos/js/nucleo/utilidades-dom.js"></script>
  <script src="${pageContext.request.contextPath}/recursos/js/nucleo/datos-iniciales.js"></script>
  <script src="${pageContext.request.contextPath}/recursos/js/nucleo/persistencia.js"></script>
  <script src="${pageContext.request.contextPath}/recursos/js/nucleo/gestion-areas.js"></script>
  <script src="${pageContext.request.contextPath}/recursos/js/nucleo/progreso-pedidos.js"></script>
  <script src="${pageContext.request.contextPath}/recursos/js/nucleo/gestion-incidencias.js"></script>
  <script src="${pageContext.request.contextPath}/recursos/js/nucleo/perfil-trabajadores.js"></script>
  <script src="${pageContext.request.contextPath}/recursos/js/nucleo/interfaz.js"></script>
  <script src="${pageContext.request.contextPath}/recursos/js/nucleo/enrutador.js"></script>
  <script src="${pageContext.request.contextPath}/recursos/js/nucleo/sesion.js"></script>
  <script src="${pageContext.request.contextPath}/recursos/js/nucleo/vistas-compartidas.js"></script>
  <script src="${pageContext.request.contextPath}/recursos/js/nucleo/eventos-globales.js"></script>
  <script src="${pageContext.request.contextPath}/recursos/js/paginas/trabajadores/nucleo-trabajadores.js"></script>
  <script src="${pageContext.request.contextPath}/recursos/js/paginas/trabajadores/vista-inicio.js"></script>
  <script src="${pageContext.request.contextPath}/recursos/js/paginas/trabajadores/vista-incidencias.js"></script>
  <script src="${pageContext.request.contextPath}/recursos/js/paginas/trabajadores/vista-pedidos.js"></script>
</body>
</html>
