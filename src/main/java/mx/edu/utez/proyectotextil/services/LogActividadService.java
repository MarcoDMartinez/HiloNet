package mx.edu.utez.proyectotextil.services;

import mx.edu.utez.proyectotextil.dao.LogActividadDao;
import mx.edu.utez.proyectotextil.models.LogActividad;
import java.util.List;

public class LogActividadService {
    private final LogActividadDao dao = new LogActividadDao();

    public List<LogActividad> listar() { return dao.getAll(); }

    public LogActividad crear(LogActividad log) { return dao.create(log); }
}
