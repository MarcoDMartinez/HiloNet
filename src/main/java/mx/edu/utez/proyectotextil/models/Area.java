package mx.edu.utez.proyectotextil.models;

import java.time.LocalDateTime;

public class Area {
    private String id;
    private String nombre;
    private String responsable;
    private int empleados;
    private boolean activa;
    private String color;
    private LocalDateTime creado;
    private LocalDateTime actualizado;

    public Area() {}

    public Area(String id, String nombre, String responsable, int empleados, boolean activa, String color) {
        this.id = id;
        this.nombre = nombre;
        this.responsable = responsable;
        this.empleados = empleados;
        this.activa = activa;
        this.color = color;
        this.creado = LocalDateTime.now();
        this.actualizado = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getResponsable() { return responsable; }
    public void setResponsable(String responsable) { this.responsable = responsable; }

    public int getEmpleados() { return empleados; }
    public void setEmpleados(int empleados) { this.empleados = empleados; }

    public boolean isActiva() { return activa; }
    public void setActiva(boolean activa) { this.activa = activa; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public LocalDateTime getCreado() { return creado; }
    public LocalDateTime getActualizado() { return actualizado; }
    public void setActualizado(LocalDateTime actualizado) { this.actualizado = actualizado; }
}
