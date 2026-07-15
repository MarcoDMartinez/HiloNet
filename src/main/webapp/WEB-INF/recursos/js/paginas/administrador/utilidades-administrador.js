/* Helpers admin — plantillas reutilizables de paginación y píldoras de filtro para las tablas del admin. */
function paginacionHTML(view, page, totalPaginas) {
  return `
    <div class="flex between mt">
      <button class="btn btn-ghost btn-sm" data-go="${view}" data-arg="${page - 1}" ${page === 0 ? 'disabled' : ''}>← Anterior</button>
      <span class="small sec">Página ${page + 1} de ${totalPaginas}</span>
      <button class="btn btn-ghost btn-sm" data-go="${view}" data-arg="${page + 1}" ${page >= totalPaginas - 1 ? 'disabled' : ''}>Siguiente →</button>
    </div>`;
}

function filtroPillsHTML(action, filtros, filtroActivo) {
  return `
    <div class="flex between mb">
      <div class="pill-tabs-zero">
        ${filtros.map((f) => `<span class="pill ${filtroActivo === f.key ? 'active' : ''}" data-action="${action}" data-filtro="${f.key}">${f.label}</span>`).join('')}
      </div>
    </div>`;
}
