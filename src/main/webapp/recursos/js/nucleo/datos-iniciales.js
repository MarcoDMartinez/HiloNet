/* Datos iniciales — se cargan desde la base de datos y ya no dependen de valores mock. */

// Obtiene dinámicamente el context path del proyecto (ej: "/ProyectoTextil")
const CONTEXT_PATH = (() => {
  const firstSlashIndex = window.location.pathname.indexOf('/', 1);
  return firstSlashIndex !== -1 ? window.location.pathname.substring(0, firstSlashIndex) : '';
})();

function normalizarTextoParaClave(value = '') {
  return String(value).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '');
}

function cargarJsonSincrono(url) {
  try {
    const request = new XMLHttpRequest();
    request.open('GET', url, false);
    request.send(null);
    if (request.status >= 200 && request.status < 300) {
      return JSON.parse(request.responseText);
    }
  } catch (error) {
    console.warn('No se pudo cargar', url, error);
  }
  return null;
}

function parsearFecha(valor) {
  if (!valor) return '';
  try {
    const fecha = new Date(valor);
    if (!Number.isNaN(fecha.getTime())) {
      return fecha.toISOString().split('T')[0];
    }
  } catch (error) {}
  return String(valor);
}

function mapearAreaDesdeApi(areaApi) {
  const id = areaApi.idArea ?? areaApi.id ?? areaApi.ID_AREA ?? '';
  const nombre = areaApi.areaNombre ?? areaApi.nombre ?? areaApi.AREA_NOMBRE ?? 'Sin nombre';
  const clave = normalizarTextoParaClave(nombre) || `area${id || 'nueva'}`;
  const color = areaApi.color || 'var(--marron)';
  return {
    id: id ? String(id) : `A-${Math.max(1, AREAS_CAT.length + 1).toString().padStart(2, '0')}`,
    nom: nombre,
    resp: areaApi.responsable || areaApi.responsableNombre || 'Sin asignar',
    emp: Number(areaApi.empleados || areaApi.empleadoCount || 5) || 5,
    act: areaApi.activa !== false,
    cls: clave,
    areaKey: clave,
    workerUser: areaApi.workerUser || '',
    color,
    turno: areaApi.turno || '',
    descripcion: areaApi.descripcion || '',
    areaNombre: nombre
  };
}

function mapearUsuarioDesdeApi(usuarioApi) {
  const nombreCompleto = [usuarioApi.nombre, usuarioApi.apellidoP, usuarioApi.apellidoM].filter(Boolean).join(' ').trim();
  const areaNombre = usuarioApi.areaNombre || usuarioApi.area || usuarioApi.AREA_NOMBRE || '';

  // Detección flexible de rol (por ID o por nombre)
  const rolTexto = String(usuarioApi.rolNombre || usuarioApi.rol || usuarioApi.ROL_NOMBRE || '').toUpperCase();
  const idRol = Number(usuarioApi.idRol || usuarioApi.id_rol || usuarioApi.ID_ROL);

  const esAdmin = rolTexto === 'ADMIN' || rolTexto === 'ADMINISTRADOR' || idRol === 1 || idRol === 21;
  const rol = esAdmin ? 'Administrador' : 'Trabajador';

  return {
    id: usuarioApi.idUsuarios ? String(usuarioApi.idUsuarios) : (usuarioApi.id || ''),
    nom: nombreCompleto || usuarioApi.numeroTelefono || 'Sin nombre',
    user: usuarioApi.numeroTelefono || usuarioApi.usuario || usuarioApi.username || '',
    area: areaNombre,
    rol,
    idRol: idRol || (esAdmin ? 1 : 2),
    act: usuarioApi.status !== 'INACTIVO' && usuarioApi.status !== 'SUSPENDIDO'
  };
}

function mapearPedidoDesdeApi(pedidoApi) {
  return {
    id: pedidoApi.id || pedidoApi.ID_PEDIDO || '',
    cli: pedidoApi.cliente || pedidoApi.CLIENTE || '',
    desc: pedidoApi.descripcion || pedidoApi.DESCRIPCION || '',
    areas: pedidoApi.areas || pedidoApi.AREAS || '',
    fecha: parsearFecha(pedidoApi.fecha || pedidoApi.FECHA),
    est: pedidoApi.estado || pedidoApi.ESTADO || 'Pendiente',
    estCls: (pedidoApi.estado || pedidoApi.ESTADO || 'Pendiente').toLowerCase().replace(/[^a-z]+/g, '')
  };
}

function construirTareasDesdeApi(tareasApi) {
  const resultado = {};
  (tareasApi || []).forEach((tarea) => {
    const key = normalizarTextoParaClave(tarea.area || tarea.AREA || 'sin-area') || 'sinarea';
    if (!resultado[key]) resultado[key] = [];
    resultado[key].push([tarea.titulo || tarea.TITULO || 'Tarea sin título', tarea.pedido || tarea.PEDIDO || 'P-0000']);
  });
  return resultado;
}

function construirIncidenciasDesdeApi(incidenciasApi, areasCatalogo) {
  const resultado = {};
  (incidenciasApi || []).forEach((incidencia) => {
    const areaNombre = incidencia.area || incidencia.AREA || 'General';
    const key = normalizarTextoParaClave(areaNombre) || 'general';
    if (!resultado[key]) resultado[key] = [];
    resultado[key].push([incidencia.id || incidencia.ID_INCIDENCIA || '', incidencia.titulo || incidencia.TITULO || '', incidencia.prioridad || incidencia.PRIORIDAD || 'Media']);
  });
  areasCatalogo.forEach((area) => {
    if (!resultado[area.areaKey]) resultado[area.areaKey] = [];
  });
  return resultado;
}

function cargarDatosIniciales() {
  const areasRespuesta = cargarJsonSincrono(`${CONTEXT_PATH}/api/areas`);
  const areasApi = (areasRespuesta && Array.isArray(areasRespuesta.data)) ? areasRespuesta.data : [];
  const areasCatalogo = areasApi.map(mapearAreaDesdeApi);
  AREAS_CAT.splice(0, AREAS_CAT.length, ...areasCatalogo);

  const areasInfo = {};
  AREAS_CAT.forEach((area) => {
    areasInfo[area.areaKey] = {
      label: area.nom,
      cls: area.cls,
      color: area.color,
      worker: area.resp,
      areaKey: area.areaKey
    };
  });
  Object.keys(AREAS_INFO).forEach((key) => delete AREAS_INFO[key]);
  Object.assign(AREAS_INFO, areasInfo);

  const usuariosRespuesta = cargarJsonSincrono(`${CONTEXT_PATH}/api/usuarios`);
  const usuariosApi = (usuariosRespuesta && Array.isArray(usuariosRespuesta.data)) ? usuariosRespuesta.data : [];
  USUARIOS.splice(0, USUARIOS.length, ...usuariosApi.map(mapearUsuarioDesdeApi));

  const pedidosRespuesta = cargarJsonSincrono(`${CONTEXT_PATH}/api/pedidos`);
  const pedidosApi = (pedidosRespuesta && Array.isArray(pedidosRespuesta.data)) ? pedidosRespuesta.data : [];
  PEDIDOS.splice(0, PEDIDOS.length, ...pedidosApi.map(mapearPedidoDesdeApi));

  const incidenciasRespuesta = cargarJsonSincrono(`${CONTEXT_PATH}/api/incidencias`);
  const incidenciasApi = (incidenciasRespuesta && Array.isArray(incidenciasRespuesta.data)) ? incidenciasRespuesta.data : [];
  Object.keys(INCIDENCIAS).forEach((key) => delete INCIDENCIAS[key]);
  Object.assign(INCIDENCIAS, construirIncidenciasDesdeApi(incidenciasApi, AREAS_CAT));

  const tareasRespuesta = cargarJsonSincrono(`${CONTEXT_PATH}/api/tareas`);
  const tareasApi = (tareasRespuesta && Array.isArray(tareasRespuesta.data)) ? tareasRespuesta.data : [];
  Object.keys(TAREAS).forEach((key) => delete TAREAS[key]);
  Object.assign(TAREAS, construirTareasDesdeApi(tareasApi));

  window.DATOS_DESDE_BD_CARGADOS = true;
}

const AREAS_INFO = {};
const CONTRASENAS = {};
const PEDIDOS = [];
const AVANCE_PEDIDOS = {};
const AVANCE_DEFAULT = {};
const EVIDENCIAS_PEDIDOS = {};
const AREAS_CAT = [];
const USUARIOS = [];
const TAREAS = {};
const INCIDENCIAS = {};

// Aseguramos que la sesión sea accesible de forma global en todos los scripts
window.session = { rol: 'admin', area: null };
var session = window.session;

cargarDatosIniciales();