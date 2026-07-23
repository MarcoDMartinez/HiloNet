/* Núcleo trabajador — objeto WORKER, plantilla de paginación y las vistas Soporte/Ajustes del trabajador. */
const WORKER_PAGE_SIZE = 4;

function paginacionWorkerHTML(view, page, totalPaginas) {
  return `
    <div class="flex between mt">
      <button class="btn btn-ghost btn-sm" data-go="${view}" data-arg="${page - 1}" ${page === 0 ? 'disabled' : ''}>← Anterior</button>
      <span class="small sec">Página ${page + 1} de ${totalPaginas}</span>
      <button class="btn btn-ghost btn-sm" data-go="${view}" data-arg="${page + 1}" ${page >= totalPaginas - 1 ? 'disabled' : ''}>Siguiente →</button>
    </div>`;
}

const WORKER = {
  soporte() { return soporteView(); },
  ajuste() { return ajusteView(); }
};
