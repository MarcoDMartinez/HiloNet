package mx.edu.utez.proyectotextil.services;

import mx.edu.utez.proyectotextil.models.Usuario;
import java.util.HashMap;
import java.util.Map;

public class AuthService {
    private static final Map<String, Usuario> usuariosCache = new HashMap<>();

    static {
        // Datos iniciales - será reemplazado con BD
        usuariosCache.put("admin", new Usuario("A-001", "Admin General", "admin", "admin123", null, "ADMIN"));
        usuariosCache.put("lander", new Usuario("E-014", "Lander Bautista", "lander", "123", "Corte", "EMPLEADO"));
        usuariosCache.put("merari", new Usuario("E-009", "Merari Núñez", "merari", "123", "Costura", "EMPLEADO"));
        usuariosCache.put("marcod", new Usuario("E-003", "Marco Díaz", "marcod", "123", "Diseño", "EMPLEADO"));
    }

    public static class LoginResult {
        public boolean success;
        public String message;
        public Usuario usuario;

        public LoginResult(boolean success, String message, Usuario usuario) {
            this.success = success;
            this.message = message;
            this.usuario = usuario;
        }
    }

    /**
     * Valida credenciales de usuario
     * @param username Username o matrícula
     * @param password Contraseña
     * @return LoginResult con resultado y usuario si es válido
     */
    public static LoginResult validarCredenciales(String username, String password) {
        if (username == null || username.trim().isEmpty()) {
            return new LoginResult(false, "Usuario requerido", null);
        }

        if (password == null || password.trim().isEmpty()) {
            return new LoginResult(false, "Contraseña requerida", null);
        }

        String user = username.trim().toLowerCase();
        Usuario usuario = usuariosCache.get(user);

        if (usuario == null) {
            return new LoginResult(false, "Usuario no encontrado", null);
        }

        if (!usuario.getPassword().equals(password)) {
            return new LoginResult(false, "Contraseña incorrecta", null);
        }

        if (!usuario.isActivo()) {
            return new LoginResult(false, "Usuario inactivo", null);
        }

        return new LoginResult(true, "Login exitoso", usuario);
    }

    /**
     * Recupera un usuario por username
     */
    public static Usuario obtenerUsuarioPorUsername(String username) {
        return usuariosCache.get(username != null ? username.toLowerCase() : null);
    }

    /**
     * Valida que una contraseña cumple requisitos mínimos
     */
    public static boolean validarContraseña(String password) {
        if (password == null || password.length() < 8) {
            return false;
        }
        boolean tieneNumero = password.matches(".*\\d.*");
        boolean tieneMayuscula = password.matches(".*[A-Z].*");
        return tieneNumero && tieneMayuscula;
    }

    /**
     * Actualiza la contraseña de un usuario
     */
    public static boolean actualizarContraseña(String username, String contraseñaActual, String contraseñaNueva) {
        Usuario usuario = usuariosCache.get(username != null ? username.toLowerCase() : null);
        if (usuario == null) {
            return false;
        }

        if (!usuario.getPassword().equals(contraseñaActual)) {
            return false;
        }

        if (!validarContraseña(contraseñaNueva)) {
            return false;
        }

        usuario.setPassword(contraseñaNueva);
        return true;
    }
}
