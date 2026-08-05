package mx.edu.utez.proyectotextil.dao;

import mx.edu.utez.proyectotextil.models.Usuario;
import mx.edu.utez.proyectotextil.services.AuthService;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertEquals;

class AuthBootstrapTest {

    @Test
    void defaultAdminCanLogin() {
        UsuarioDao usuarioDao = new UsuarioDao();
        usuarioDao.ensureDefaultAdminExists();

        AuthService.LoginResult result = AuthService.validarCredenciales("9999999999", "Admin123!");

        assertNotNull(result, "El resultado del login no debe ser nulo");
        assertTrue(result.success, "El administrador por defecto debe poder iniciar sesión");
        assertNotNull(result.usuario, "El usuario autenticado no debe ser nulo");
        assertEquals("ADMIN", result.usuario.getRolNombre(), "El rol del administrador debe ser ADMIN");
    }
}
