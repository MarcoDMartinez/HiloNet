package mx.edu.utez.proyectotextil.models;

import java.time.LocalDateTime;

public class Pedido {
    private String id;
    private String cliente;
    private String descripcion;
    private String areas; // Comma-separated
    private LocalDateTime fecha;
    private String estado; // Pendiente, En producción, Entregado
    private LocalDateTime creado;
    private LocalDateTime actualizado;

    public Pedido() {}

    public Pedido(String id, String cliente, String descripcion, String areas, LocalDateTime fecha, String estado) {
        this.id = id;
        this.cliente = cliente;
        this.descripcion = descripcion;
        this.areas = areas;
        this.fecha = fecha;
        this.estado = estado;
        this.creado = LocalDateTime.now();
        this.actualizado = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCliente() { return cliente; }
    public void setCliente(String cliente) { this.cliente = cliente; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getAreas() { return areas; }
    public void setAreas(String areas) { this.areas = areas; }

    public LocalDateTime getFecha() { return fecha; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }
    
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    
    public LocalDateTime getCreado() { return creado; }
    public void setCreado(LocalDateTime creado) { this.creado = creado; }
    public LocalDateTime getActualizado() { return actualizado; }
    public void setActualizado(LocalDateTime actualizado) { this.actualizado = actualizado; }
}
