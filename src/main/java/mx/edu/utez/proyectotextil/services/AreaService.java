package mx.edu.utez.proyectotextil.services;

import mx.edu.utez.proyectotextil.models.Area;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AreaService {
    private static final Map<String, Area> areasCache = new HashMap<>();

    static {
        // Datos iniciales - será reemplazado con BD
        areasCache.put("A-01", new Area("A-01", "Diseño", "Marco D.", 6, true, "#5a7a4a"));
        areasCache.put("A-02", new Area("A-02", "Corte", "Lander B.", 8, true, "#4a6fa5"));
        areasCache.put("A-03", new Area("A-03", "Costura", "Merari N.", 7, true, "#7a5c44"));
    }

    /**
     * Obtiene todas las áreas activas
     */
    public static List<Area> obtenerAreasActivas() {
        List<Area> areas = new ArrayList<>();
        areasCache.values().stream()
                .filter(Area::isActiva)
                .forEach(areas::add);
        return areas;
    }

    /**
     * Obtiene un área por ID
     */
    public static Area obtenerAreaPorId(String id) {
        return areasCache.get(id);
    }

    /**
     * Obtiene un área por nombre
     */
    public static Area obtenerAreaPorNombre(String nombre) {
        return areasCache.values().stream()
                .filter(a -> a.getNombre().equalsIgnoreCase(nombre))
                .findFirst()
                .orElse(null);
    }

    /**
     * Crea una nueva área
     */
    public static Area crearArea(String nombre, String responsable, int empleados, String color) {
        String id = "A-" + String.format("%02d", areasCache.size() + 1);
        Area area = new Area(id, nombre, responsable, empleados, true, color);
        areasCache.put(id, area);
        return area;
    }

    /**
     * Actualiza un área
     */
    public static boolean actualizarArea(String id, Area areaActualizada) {
        if (!areasCache.containsKey(id)) {
            return false;
        }
        Area area = areasCache.get(id);
        area.setNombre(areaActualizada.getNombre());
        area.setResponsable(areaActualizada.getResponsable());
        area.setEmpleados(areaActualizada.getEmpleados());
        area.setColor(areaActualizada.getColor());
        return true;
    }

    /**
     * Desactiva un área
     */
    public static boolean desactivarArea(String id) {
        if (!areasCache.containsKey(id)) {
            return false;
        }
        areasCache.get(id).setActiva(false);
        return true;
    }

    /**
     * Obtiene la cuenta total de empleados en todas las áreas
     */
    public static int obtenerTotalEmpleados() {
        return (int) areasCache.values().stream()
                .filter(Area::isActiva)
                .mapToInt(Area::getEmpleados)
                .sum();
    }
}
