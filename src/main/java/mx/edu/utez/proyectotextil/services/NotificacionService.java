package mx.edu.utez.proyectotextil.services;

import mx.edu.utez.proyectotextil.dao.NotificacionDao;
import mx.edu.utez.proyectotextil.models.Notificacion;
import java.util.List;

public class NotificacionService {
    private final NotificacionDao dao = new NotificacionDao();

    public List<Notificacion> listar() { return dao.getAll(); }

    public Notificacion crear(Notificacion notificacion) { return dao.create(notificacion); }

    public boolean marcarLeida(int idNotificaciones) { return dao.markAsRead(idNotificaciones); }
}
