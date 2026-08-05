ADMIN.ajuste = function () { return ajusteView(); };

function publicarIncidenciaAdmin(areaKey, idx) {
  publicarIncidencia(areaKey, idx);
  go('incidencias', buildIncidenciasArg('publicar', publicarPage));
  toast('Incidencia publicada. Ahora es visible para el equipo de esa área.');
}
