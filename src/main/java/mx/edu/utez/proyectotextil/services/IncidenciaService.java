package mx.edu.utez.proyectotextil.services;

import mx.edu.utez.proyectotextil.models.Incidencia;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class IncidenciaService {
    private static final Map<String, Incidencia> incidenciasCache = new HashMap<>();

    static {
        // Datos iniciales - será reemplazado con BD
        incidenciasCache.put("INC-001", new Incidencia("INC-001", "Máquina overlock atascada", "", "Costura", "Alta", "Abierta"));
        incidenciasCache.put("INC-002", new Incidencia("INC-002", "Tela denim fuera de stock", "", "Corte", "Media", "Abierta"));
        incidenciasCache.put("INC-003", new Incidencia("INC-003", "Error en patrón P-0019", "", "Diseño", "Alta", "Abierta"));
    }

    /**
     * Obtiene todas las incidencias
     */
    public static List<Incidencia> obtenerTodas() {
        return new ArrayList<>(incidenciasCache.values());
    }

    /**
     * Obtiene una incidencia por ID
     */
    public static Incidencia obtenerPorId(String id) {
        return incidenciasCache.get(id);
    }

    /**
     * Obtiene incidencias por área
     */
    public static List<Incidencia> obtenerPorArea(String area) {
        List<Incidencia> resultado = new ArrayList<>();
        incidenciasCache.values().stream()
                .filter(i -> i.getArea().equals(area))
                .forEach(resultado::add);
        return resultado;
    }

    /**
     * Obtiene incidencias por prioridad
     */
    public static List<Incidencia> obtenerPorPrioridad(String prioridad) {
        List<Incidencia> resultado = new ArrayList<>();
        incidenciasCache.values().stream()
                .filter(i -> i.getPrioridad().equals(prioridad))
                .forEach(resultado::add);
        return resultado;
    }

    /**
     * Obtiene incidencias abiertas
     */
    public static List<Incidencia> obtenerAbiertas() {
        List<Incidencia> resultado = new ArrayList<>();
        incidenciasCache.values().stream()
                .filter(i -> i.getEstado().equals("Abierta"))
                .forEach(resultado::add);
        return resultado;
    }

    /**
     * Crea una nueva incidencia
     */
    public static Incidencia crearIncidencia(String titulo, String descripcion, String area, String prioridad) {
        String id = "INC-" + String.format("%03d", incidenciasCache.size() + 1);
        Incidencia incidencia = new Incidencia(id, titulo, descripcion, area, prioridad, "Abierta");
        incidenciasCache.put(id, incidencia);
        return incidencia;
    }

    /**
     * Actualiza el estado de una incidencia
     */
    public static boolean actualizarEstado(String id, String nuevoEstado) {
        if (!incidenciasCache.containsKey(id)) {
            return false;
        }
        if (!esEstadoValido(nuevoEstado)) {
            return false;
        }
        Incidencia incidencia = incidenciasCache.get(id);
        incidencia.setEstado(nuevoEstado);
        incidencia.setActualizado(LocalDateTime.now());
        return true;
    }

    /**
     * Valida si un estado es válido
     */
    private static boolean esEstadoValido(String estado) {
        return estado != null && (
                estado.equals("Abierta") ||
                estado.equals("En progreso") ||
                estado.equals("Resuelta")
        );
    }

    /**
     * Obtiene estadísticas de incidencias
     */
    public static Map<String, Object> obtenerEstadisticas() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", incidenciasCache.size());
        stats.put("abiertas", incidenciasCache.values().stream()
                .filter(i -> i.getEstado().equals("Abierta"))
                .count());
        stats.put("alta_prioridad", incidenciasCache.values().stream()
                .filter(i -> i.getPrioridad().equals("Alta"))
                .count());
        stats.put("resueltas", incidenciasCache.values().stream()
                .filter(i -> i.getEstado().equals("Resuelta"))
                .count());
        return stats;
    }
}
