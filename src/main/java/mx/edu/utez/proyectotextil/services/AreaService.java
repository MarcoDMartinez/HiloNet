package mx.edu.utez.proyectotextil.services;

import mx.edu.utez.proyectotextil.dao.AreaDao;
import mx.edu.utez.proyectotextil.models.Area;
import java.util.List;

public class AreaService {
    private static final AreaDao areaDao = new AreaDao();

    /**
     * Obtiene todas las áreas activas
     */
    public static List<Area> obtenerAreasActivas() {
        List<Area> areasDB = areaDao.getAllAreas();
        for (Area area : areasDB) {
            area.setActiva(true);
            area.setEmpleados(5);
            area.setColor("#4a6fa5");
        }
        return areasDB;
    }

    /**
     * Obtiene un área por ID
     */
    public static Area obtenerAreaPorId(String id) {
        try {
            return areaDao.getAreaById(Integer.parseInt(id));
        } catch (NumberFormatException e) {
            return null;
        }
    }

    /**
     * Obtiene un área por nombre
     */
    public static Area obtenerAreaPorNombre(String nombre) {
        if (nombre == null || nombre.trim().isEmpty()) {
            return null;
        }
        return areaDao.getAreaByName(nombre.trim());
    }

    /**
     * Crea una nueva área
     */
    public static Area crearArea(String nombre, String responsable, int empleados, String color) {
        Area area = new Area();
        area.setNombre(nombre);
        area.setResponsable(responsable);
        area.setEmpleados(empleados);
        area.setActiva(true);
        area.setColor(color);

        Area creada = areaDao.createArea(area);
        if (creada != null) {
            creada.setResponsable(responsable);
            creada.setEmpleados(empleados);
            creada.setActiva(true);
            creada.setColor(color);
        }
        return creada;
    }

    /**
     * Actualiza un área
     */
    public static boolean actualizarArea(String id, Area areaActualizada) {
        try {
            return areaDao.updateArea(Integer.parseInt(id), areaActualizada);
        } catch (NumberFormatException e) {
            return false;
        }
    }

    /**
     * Desactiva un área
     */
    public static boolean desactivarArea(String id) {
        try {
            return areaDao.deleteArea(Integer.parseInt(id));
        } catch (NumberFormatException e) {
            return false;
        }
    }

    /**
     * Obtiene la cuenta total de empleados en todas las áreas
     */
    public static int obtenerTotalEmpleados() {
        int total = 0;
        for (Area area : areaDao.getAllAreas()) {
            total += area.getEmpleados();
        }
        return total;
    }
}
