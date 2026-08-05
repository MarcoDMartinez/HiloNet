package mx.edu.utez.proyectotextil.services;

import mx.edu.utez.proyectotextil.dao.DisenoDao;
import mx.edu.utez.proyectotextil.models.Diseno;
import java.util.List;

public class DisenoService {
    private final DisenoDao dao = new DisenoDao();

    public List<Diseno> listar() { return dao.getAll(); }

    public Diseno crear(Diseno diseno) { return dao.create(diseno); }
}
