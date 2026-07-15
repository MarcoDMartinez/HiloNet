/* Datos de ejemplo — áreas, pedidos, usuarios, tareas e incidencias iniciales de HiloNet, y el estado de sesión. */
const AREAS_INFO = {
  corte:   { label: 'Corte',   cls: 'corte',   color: 'var(--azul-corte)',    worker: 'Lander B.' },
  costura: { label: 'Costura', cls: 'costura', color: 'var(--marron-costura)', worker: 'Merari N.' },
  diseno:  { label: 'Diseño',  cls: 'diseno',  color: 'var(--verde-diseno)',  worker: 'Marco D.' },
};

const PEDIDOS = [
  { id: 'P-0023', cli: 'Confecciones Morelos', desc: '20 camisetas polo bordadas', areas: 'Diseño, Costura', fecha: '2026-06-15', est: 'En producción', estCls: 'proc' },
  { id: 'P-0021', cli: 'Uniformes UAEM', desc: '50 sudaderas con capucha', areas: 'Corte, Costura', fecha: '2026-06-18', est: 'Pendiente', estCls: 'pend' },
  { id: 'P-0019', cli: 'Boutique Lúa', desc: '15 faldas midi denim', areas: 'Diseño, Corte', fecha: '2026-06-13', est: 'En producción', estCls: 'proc' },
  { id: 'P-0015', cli: 'Esc. Primaria Zapata', desc: '100 playeras escolares', areas: 'Diseño, Corte, Costura', fecha: '2026-06-05', est: 'Entregado', estCls: 'comp' },
];

const AVANCE_PEDIDOS = {};
const AVANCE_DEFAULT = { diseno: 100, corte: 70, costura: 30 };
const EVIDENCIAS_PEDIDOS = {};

const AREAS_CAT = [
  { id: 'A-01', nom: 'Diseño', resp: 'Marco D.', emp: 6, act: true, cls: 'diseno', areaKey: 'diseno', workerUser: 'tr3', color: 'var(--verde-diseno)' },
  { id: 'A-02', nom: 'Corte', resp: 'Lander B.', emp: 8, act: true, cls: 'corte', areaKey: 'corte', workerUser: 'tr1', color: 'var(--azul-corte)' },
  { id: 'A-03', nom: 'Costura', resp: 'Merari N.', emp: 7, act: true, cls: 'costura', areaKey: 'costura', workerUser: 'tr2', color: 'var(--marron-costura)' },
];

const USUARIOS = [
  { id: 'E-014', nom: 'Lander Bautista', user: 'lander', area: 'Corte', rol: 'Empleado', act: true },
  { id: 'E-009', nom: 'Merari Núñez', user: 'merari', area: 'Costura', rol: 'Empleado', act: true },
  { id: 'E-003', nom: 'Marco Díaz', user: 'marcod', area: 'Diseño', rol: 'Empleado', act: true },
  { id: 'E-021', nom: 'Rosa Jiménez', user: 'rosaj', area: 'Corte', rol: 'Empleado', act: true },
  { id: 'A-001', nom: 'Admin General', user: 'admin', area: '—', rol: 'Administrador', act: true },
];

const TAREAS = {
  corte: [
    ['Cortar tela 20 piezas faldas', 'P-0021'], ['Corte denim 15 faldas', 'P-0019'],
    ['Tendido de tela sudaderas', 'P-0021'], ['Corte forros camisetas', 'P-0023'],
    ['Corte cuellos polo', 'P-0023'], ['Corte puños sudadera', 'P-0021']
  ],
  costura: [
    ['Confección 20 piezas polo', 'P-0023'], ['Bordado logo empresa', 'P-0023'],
    ['Dobladillo faldas midi', 'P-0019'], ['Confección sudaderas', 'P-0021'],
    ['Pespunte cuellos', 'P-0023'], ['Costura de mangas', 'P-0021']
  ],
  diseno: [
    ['Trazar patrón polo', 'P-0023'], ['Ficha técnica bordado', 'P-0023'],
    ['Patrón falda midi', 'P-0019'], ['Ajuste de tallas', 'P-0019'],
    ['Ficha técnica sudadera', 'P-0021'], ['Boceto estampado', 'P-0023']
  ],
};

const INCIDENCIAS = {
  corte: [
    ['INC-002', 'Tela denim fuera de stock', 'Media'], ['INC-005', 'Iluminación área de corte', 'Baja'],
    ['INC-008', 'Cortadora requiere mantenimiento', 'Alta'], ['INC-011', 'Falta mesa de corte auxiliar', 'Media'],
    ['INC-014', 'Tijeras desafiladas lote 3', 'Baja'], ['INC-017', 'Retraso en insumos', 'Alta']
  ],
  costura: [
    ['INC-001', 'Máquina overlock atascada', 'Alta'], ['INC-004', 'Retraso entrega hilos', 'Media'],
    ['INC-007', 'Aguja rota lote sudaderas', 'Baja'], ['INC-010', 'Tensión hilo irregular', 'Media'],
    ['INC-013', 'Falta hilo color vino', 'Alta'], ['INC-016', 'Pedal máquina falla', 'Media']
  ],
  diseno: [
    ['INC-003', 'Error en patrón P-0019', 'Alta'], ['INC-006', 'Archivo de diseño corrupto', 'Media'],
    ['INC-009', 'Plotter sin tinta', 'Baja'], ['INC-012', 'Medidas incorrectas ficha', 'Alta'],
    ['INC-015', 'Falta muestra de color', 'Media'], ['INC-018', 'Software de trazo lento', 'Baja']
  ],
};

let session = { rol: 'admin', area: null };
