package mx.edu.utez.proyectotextil.services;

import mx.edu.utez.proyectotextil.dao.TareaDao;
import mx.edu.utez.proyectotextil.models.Tarea;
import java.util.List;

public class TareaService {
    private static final TareaDao tareaDao = new TareaDao();

    public static List<Tarea> obtenerTodas() {
        return tareaDao.getAll();
    }

    public static List<Tarea> obtenerPorArea(String area) {
        return tareaDao.getByArea(area);
    }

    public static Tarea crearTarea(String titulo, String descripcion, String area, String pedido, String asignadoA) {
        Tarea tarea = new Tarea();
        tarea.setTitulo(titulo);
        tarea.setDescripcion(descripcion);
        tarea.setArea(area);
        tarea.setPedido(pedido);
        tarea.setAsignadoA(asignadoA);
        tarea.setEstado("Pendiente");
        return tareaDao.create(tarea);
    }
}
