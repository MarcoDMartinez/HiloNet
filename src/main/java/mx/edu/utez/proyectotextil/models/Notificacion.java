package mx.edu.utez.proyectotextil.models;

import java.time.LocalDateTime;

public class Notificacion {
    private int idNotificaciones;
    private String mensaje;
    private LocalDateTime fechaNotificacion;
    private boolean leido;
    private int idUsuarios;

    public int getIdNotificaciones() { return idNotificaciones; }
    public void setIdNotificaciones(int idNotificaciones) { this.idNotificaciones = idNotificaciones; }

    public String getMensaje() { return mensaje; }
    public void setMensaje(String mensaje) { this.mensaje = mensaje; }

    public LocalDateTime getFechaNotificacion() { return fechaNotificacion; }
    public void setFechaNotificacion(LocalDateTime fechaNotificacion) { this.fechaNotificacion = fechaNotificacion; }

    public boolean isLeido() { return leido; }
    public void setLeido(boolean leido) { this.leido = leido; }

    public int getIdUsuarios() { return idUsuarios; }
    public void setIdUsuarios(int idUsuarios) { this.idUsuarios = idUsuarios; }
}
