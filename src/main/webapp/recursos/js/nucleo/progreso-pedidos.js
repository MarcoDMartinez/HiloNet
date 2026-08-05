/* Pedidos — avance y evidencias por área de un pedido, y generación del siguiente folio de pedido. */
function getAvancePedido(pedidoId, areaKey) {
  const guardado = AVANCE_PEDIDOS[pedidoId]?.[areaKey];
  return guardado !== undefined ? guardado : (AVANCE_DEFAULT[areaKey] ?? 0);
}

function setAvancePedido(pedidoId, areaKey, valor) {
  if (!AVANCE_PEDIDOS[pedidoId]) AVANCE_PEDIDOS[pedidoId] = {};
  AVANCE_PEDIDOS[pedidoId][areaKey] = Math.max(0, Math.min(100, valor));
}

function getEvidencias(pedidoId, areaKey) {
  return EVIDENCIAS_PEDIDOS[pedidoId]?.[areaKey] || [];
}

function agregarEvidencia(pedidoId, areaKey, imagenDataUrl) {
  if (!EVIDENCIAS_PEDIDOS[pedidoId]) EVIDENCIAS_PEDIDOS[pedidoId] = {};
  if (!EVIDENCIAS_PEDIDOS[pedidoId][areaKey]) EVIDENCIAS_PEDIDOS[pedidoId][areaKey] = [];
  EVIDENCIAS_PEDIDOS[pedidoId][areaKey].push(imagenDataUrl);
}

function getNextPedidoId() {
  const max = PEDIDOS.reduce((maxId, pedido) => {
    const num = Number((pedido.id || '').replace(/[^0-9]/g, '')) || 0;
    return Math.max(maxId, num);
  }, 0);
  return `P-${String(max + 2).padStart(4, '0')}`;
}
