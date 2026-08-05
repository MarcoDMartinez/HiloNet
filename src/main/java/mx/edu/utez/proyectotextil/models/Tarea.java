package mx.edu.utez.proyectotextil.models;

import java.time.LocalDateTime;

public class Tarea {
    private String id;
    private String titulo;
    private String descripcion;
    private String area;
    private String pedido; // ID del pedido
    private String asignadoA; // Username del usuario
    private String estado; // Pendiente, En progreso, Completada
    private LocalDateTime creado;
    private LocalDateTime actualizado;

    public Tarea() {}

    public Tarea(String id, String titulo, String descripcion, String area, String pedido, String asignadoA) {
        this.id = id;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.area = area;
        this.pedido = pedido;
        this.asignadoA = asignadoA;
        this.estado = "Pendiente";
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

    public String getPedido() { return pedido; }
    public void setPedido(String pedido) { this.pedido = pedido; }

    public String getAsignadoA() { return asignadoA; }
    public void setAsignadoA(String asignadoA) { this.asignadoA = asignadoA; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    
    public LocalDateTime getCreado() { return creado; }
    public void setCreado(LocalDateTime creado) { this.creado = creado; }
    public LocalDateTime getActualizado() { return actualizado; }
    public void setActualizado(LocalDateTime actualizado) { this.actualizado = actualizado; }
}
