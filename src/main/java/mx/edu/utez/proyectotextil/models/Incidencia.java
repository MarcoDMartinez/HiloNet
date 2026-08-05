package mx.edu.utez.proyectotextil.models;

import java.time.LocalDateTime;

public class Incidencia {
    private String id;
    private String titulo;
    private String descripcion;
    private String area;
    private String prioridad; // Baja, Media, Alta
    private String estado; // Abierta, En progreso, Resuelta
    private String pedido; // ID del pedido relacionado
    private LocalDateTime creado;
    private LocalDateTime actualizado;

    public Incidencia() {}

    public Incidencia(String id, String titulo, String descripcion, String area, String prioridad, String estado) {
        this.id = id;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.area = area;
        this.prioridad = prioridad;
        this.estado = estado;
        this.creado = LocalDateTime.now();
        this.actualizado = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }

    public String getPrioridad() { return prioridad; }
    public void setPrioridad(String prioridad) { this.prioridad = prioridad; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getPedido() { return pedido; }
    public void setPedido(String pedido) { this.pedido = pedido; }
    
    public LocalDateTime getCreado() { return creado; }
    public void setCreado(LocalDateTime creado) { this.creado = creado; }
    public LocalDateTime getActualizado() { return actualizado; }
    public void setActualizado(LocalDateTime actualizado) { this.actualizado = actualizado; }
}
