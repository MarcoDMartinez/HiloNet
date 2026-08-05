package mx.edu.utez.proyectotextil.models;

public class DetallePedido {
    private int idDetalle;
    private String talla;
    private int cantidad;
    private int idPedidos;

    public int getIdDetalle() { return idDetalle; }
    public void setIdDetalle(int idDetalle) { this.idDetalle = idDetalle; }

    public String getTalla() { return talla; }
    public void setTalla(String talla) { this.talla = talla; }

    public int getCantidad() { return cantidad; }
    public void setCantidad(int cantidad) { this.cantidad = cantidad; }

    public int getIdPedidos() { return idPedidos; }
    public void setIdPedidos(int idPedidos) { this.idPedidos = idPedidos; }
}
