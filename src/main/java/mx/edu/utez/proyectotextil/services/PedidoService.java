package mx.edu.utez.proyectotextil.services;

import mx.edu.utez.proyectotextil.models.Pedido;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class PedidoService {
    private static final Map<String, Pedido> pedidosCache = new HashMap<>();

    static {
        // Datos iniciales - será reemplazado con BD
        pedidosCache.put("P-0023", new Pedido("P-0023", "Confecciones Morelos", "20 camisetas polo bordadas", "Diseño, Costura", LocalDateTime.of(2026, 6, 15, 0, 0), "En producción"));
        pedidosCache.put("P-0021", new Pedido("P-0021", "Uniformes UAEM", "50 sudaderas con capucha", "Corte, Costura", LocalDateTime.of(2026, 6, 18, 0, 0), "Pendiente"));
        pedidosCache.put("P-0019", new Pedido("P-0019", "Boutique Lúa", "15 faldas midi denim", "Diseño, Corte", LocalDateTime.of(2026, 6, 13, 0, 0), "En producción"));
        pedidosCache.put("P-0015", new Pedido("P-0015", "Esc. Primaria Zapata", "100 playeras escolares", "Diseño, Corte, Costura", LocalDateTime.of(2026, 6, 5, 0, 0), "Entregado"));
    }

    /**
     * Obtiene todos los pedidos
     */
    public static List<Pedido> obtenerTodos() {
        return new ArrayList<>(pedidosCache.values());
    }

    /**
     * Obtiene un pedido por ID
     */
    public static Pedido obtenerPorId(String id) {
        return pedidosCache.get(id);
    }

    /**
     * Obtiene pedidos por estado
     */
    public static List<Pedido> obtenerPorEstado(String estado) {
        List<Pedido> resultado = new ArrayList<>();
        pedidosCache.values().stream()
                .filter(p -> p.getEstado().equalsIgnoreCase(estado))
                .forEach(resultado::add);
        return resultado;
    }

    /**
     * Obtiene pedidos de una área específica
     */
    public static List<Pedido> obtenerPorArea(String area) {
        List<Pedido> resultado = new ArrayList<>();
        pedidosCache.values().stream()
                .filter(p -> p.getAreas().contains(area))
                .forEach(resultado::add);
        return resultado;
    }

    /**
     * Crea un nuevo pedido
     */
    public static Pedido crearPedido(String cliente, String descripcion, String areas) {
        String id = "P-" + String.format("%04d", pedidosCache.size() + 1);
        Pedido pedido = new Pedido(id, cliente, descripcion, areas, LocalDateTime.now(), "Pendiente");
        pedidosCache.put(id, pedido);
        return pedido;
    }

    /**
     * Actualiza el estado de un pedido
     */
    public static boolean actualizarEstado(String id, String nuevoEstado) {
        if (!pedidosCache.containsKey(id)) {
            return false;
        }
        Pedido pedido = pedidosCache.get(id);
        if (!esEstadoValido(nuevoEstado)) {
            return false;
        }
        pedido.setEstado(nuevoEstado);
        pedido.setActualizado(LocalDateTime.now());
        return true;
    }

    /**
     * Valida si un estado es válido
     */
    private static boolean esEstadoValido(String estado) {
        return estado != null && (
                estado.equals("Pendiente") ||
                estado.equals("En producción") ||
                estado.equals("Entregado")
        );
    }

    /**
     * Obtiene estadísticas de pedidos
     */
    public static Map<String, Object> obtenerEstadisticas() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", pedidosCache.size());
        stats.put("pendientes", pedidosCache.values().stream()
                .filter(p -> p.getEstado().equals("Pendiente"))
                .count());
        stats.put("en_produccion", pedidosCache.values().stream()
                .filter(p -> p.getEstado().equals("En producción"))
                .count());
        stats.put("entregados", pedidosCache.values().stream()
                .filter(p -> p.getEstado().equals("Entregado"))
                .count());
        return stats;
    }
}
