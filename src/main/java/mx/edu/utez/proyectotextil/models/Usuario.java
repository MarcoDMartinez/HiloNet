package mx.edu.utez.proyectotextil.models;

import java.time.LocalDateTime;

public class Usuario {
    private String id;
    private String nombre;
    private String username;
    private String password;
    private String area;
    private String rol; // ADMIN, EMPLEADO
    private boolean activo;
    private LocalDateTime creado;
    private LocalDateTime actualizado;

    public Usuario() {}

    public Usuario(String id, String nombre, String username, String password, String area, String rol) {
        this.id = id;
        this.nombre = nombre;
        this.username = username;
        this.password = password;
        this.area = area;
        this.rol = rol;
        this.activo = true;
        this.creado = LocalDateTime.now();
        this.actualizado = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }

    public boolean isActivo() { return activo; }
    public void setActivo(boolean activo) { this.activo = activo; }

    public LocalDateTime getCreado() { return creado; }
    public LocalDateTime getActualizado() { return actualizado; }
    public void setActualizado(LocalDateTime actualizado) { this.actualizado = actualizado; }
}
