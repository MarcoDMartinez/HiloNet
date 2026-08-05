package mx.edu.utez.proyectotextil.models;

public class Area {
    private int idArea;
    private String areaNombre;

    // Propiedades originales para retrocompatibilidad
    private String id;
    private String nombre;
    private String responsable;
    private int empleados;
    private boolean activa;
    private String color;

    public Area() {}

    // Getters y Setters de retrocompatibilidad
    public int getIdArea() { return idArea; }
    public void setIdArea(int idArea) { this.idArea = idArea; }

    public String getAreaNombre() { return areaNombre; }
    public void setAreaNombre(String areaNombre) { this.areaNombre = areaNombre; }

    public String getId() { return id != null ? id : String.valueOf(idArea); }
    public void setId(String id) { this.id = id; }
    
    public String getNombre() { return nombre != null ? nombre : areaNombre; }
    public void setNombre(String nombre) { this.nombre = nombre; this.areaNombre = nombre; }
    
    public String getResponsable() { return responsable; }
    public void setResponsable(String responsable) { this.responsable = responsable; }
    
    public int getEmpleados() { return empleados; }
    public void setEmpleados(int empleados) { this.empleados = empleados; }
    
    public boolean isActiva() { return activa; }
    public void setActiva(boolean activa) { this.activa = activa; }
    
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
}
