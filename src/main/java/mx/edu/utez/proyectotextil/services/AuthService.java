package mx.edu.utez.proyectotextil.services;

import mx.edu.utez.proyectotextil.models.Usuario;
import mx.edu.utez.proyectotextil.dao.UsuarioDao;

public class    AuthService {

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

        String user = username.trim();
        UsuarioDao dao = new UsuarioDao();
        dao.ensureDefaultAdminExists();
        Usuario usuario = dao.login(user, password);

        if (usuario == null) {
            return new LoginResult(false, "Usuario o contraseña incorrectos", null);
        }

        return new LoginResult(true, "Login exitoso", usuario);
    }

    /**
     * Recupera un usuario por username
     */
    public static Usuario obtenerUsuarioPorUsername(String username) {
        if (username == null || username.trim().isEmpty()) {
            return null;
        }
        UsuarioDao dao = new UsuarioDao();
        return dao.findByNumeroTelefono(username.trim());
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
        if (username == null || username.trim().isEmpty()) {
            return false;
        }
        if (contraseñaActual == null || contraseñaNueva == null) {
            return false;
        }
        if (!validarContraseña(contraseñaNueva)) {
            return false;
        }

        UsuarioDao dao = new UsuarioDao();
        return dao.actualizarPassword(username.trim(), contraseñaActual, contraseñaNueva);
    }
}
