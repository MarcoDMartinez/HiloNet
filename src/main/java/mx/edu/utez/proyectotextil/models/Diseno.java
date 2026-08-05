package mx.edu.utez.proyectotextil.models;

import java.time.LocalDateTime;

public class Diseno {
    private int idDiseno;
    private String disenoNombre;
    private String imagen;
    private String categoria;
    private LocalDateTime fecha;
    private String status;
    private int idPedidos;

    public int getIdDiseno() { return idDiseno; }
    public void setIdDiseno(int idDiseno) { this.idDiseno = idDiseno; }

    public String getDisenoNombre() { return disenoNombre; }
    public void setDisenoNombre(String disenoNombre) { this.disenoNombre = disenoNombre; }

    public String getImagen() { return imagen; }
    public void setImagen(String imagen) { this.imagen = imagen; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public LocalDateTime getFecha() { return fecha; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getIdPedidos() { return idPedidos; }
    public void setIdPedidos(int idPedidos) { this.idPedidos = idPedidos; }
}
