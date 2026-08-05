package mx.edu.utez.proyectotextil.services;

import mx.edu.utez.proyectotextil.dao.IncidenciaDao;
import mx.edu.utez.proyectotextil.models.Incidencia;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class IncidenciaService {
    private static final IncidenciaDao incidenciaDao = new IncidenciaDao();

    public static List<Incidencia> obtenerTodas() {
        return incidenciaDao.getAll();
    }

    public static Incidencia obtenerPorId(String id) {
        return incidenciaDao.getById(id);
    }

    public static List<Incidencia> obtenerPorArea(String area) {
        return incidenciaDao.getByArea(area);
    }

    public static List<Incidencia> obtenerPorPrioridad(String prioridad) {
        return incidenciaDao.getByPrioridad(prioridad);
    }

    public static List<Incidencia> obtenerAbiertas() {
        List<Incidencia> todas = incidenciaDao.getAll();
        List<Incidencia> resultado = new ArrayList<>();
        for (Incidencia incidencia : todas) {
            if ("Abierta".equals(incidencia.getEstado())) {
                resultado.add(incidencia);
            }
        }
        return resultado;
    }

    public static Incidencia crearIncidencia(String titulo, String descripcion, String area, String prioridad) {
        Incidencia incidencia = new Incidencia();
        incidencia.setTitulo(titulo);
        incidencia.setDescripcion(descripcion);
        incidencia.setArea(area);
        incidencia.setPrioridad(prioridad);
        incidencia.setEstado("Abierta");
        return incidenciaDao.create(incidencia);
    }

    public static boolean actualizarEstado(String id, String nuevoEstado) {
        if (!esEstadoValido(nuevoEstado)) {
            return false;
        }
        return incidenciaDao.updateEstado(id, nuevoEstado);
    }

    private static boolean esEstadoValido(String estado) {
        return estado != null && (
                estado.equals("Abierta") ||
                estado.equals("En progreso") ||
                estado.equals("Resuelta")
        );
    }

    public static Map<String, Object> obtenerEstadisticas() {
        List<Incidencia> incidencias = incidenciaDao.getAll();
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", incidencias.size());
        stats.put("abiertas", incidencias.stream().filter(i -> i.getEstado().equals("Abierta")).count());
        stats.put("alta_prioridad", incidencias.stream().filter(i -> i.getPrioridad().equals("Alta")).count());
        stats.put("resueltas", incidencias.stream().filter(i -> i.getEstado().equals("Resuelta")).count());
        return stats;
    }
}
