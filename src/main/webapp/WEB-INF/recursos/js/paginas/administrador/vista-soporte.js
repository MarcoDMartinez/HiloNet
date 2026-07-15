/* Vista Soporte (admin) — preguntas frecuentes y ayuda para el manejo del sistema. */
ADMIN.soporte = function () {
  return `
    <h1>Soporte</h1>
    <p class="page-sub">Respuestas rápidas para ayudarte a usar HiloNet de forma eficiente.</p>
    <div class="card mb" style="max-width:720px">
      <h3>Preguntas frecuentes</h3>
      <div class="faq-item">
        <h4>¿Cómo registro una nueva incidencia?</h4>
        <p>Ve a <strong>Incidencias</strong> y usa el botón <strong>+ Nueva incidencia</strong>. Describe el problema y asigna el área correspondiente.</p>
      </div>
      <div class="faq-item">
        <h4>¿Cómo publico una incidencia para que la vea el área?</h4>
        <p>Desde <strong>Incidencias</strong>, haz clic en <strong>Publicar incidencias</strong> y usa los botones de publicación en la tabla.</p>
      </div>
      <div class="faq-item">
        <h4>¿Dónde veo el estado de una incidencia?</h4>
        <p>En la tabla de <strong>Incidencias</strong> encontrarás el estado actual: abierta, en atención o resuelta.</p>
      </div>
      <div class="faq-item">
        <h4>¿Cómo contacto al soporte técnico?</h4>
        <p>Envía un correo a <strong>soporte@hilonet.mx</strong> o crea un ticket desde la sección <strong>Soporte</strong>.</p>
      </div>
      <div class="faq-item">
        <h4>¿Qué hago si la incidencia ya está resuelta?</h4>
        <p>Marca la incidencia como resuelta o usa el botón <strong>Resolver</strong> en la tabla de incidencias.</p>
      </div>
    </div>
  `;
};

ADMIN.ajuste = function () { return ajusteView(); };

function publicarIncidenciaAdmin(areaKey, idx) {
  publicarIncidencia(areaKey, idx);
  go('publicarIncidencias');
  toast('Incidencia publicada. Ahora es visible para el equipo de esa área.');
}
