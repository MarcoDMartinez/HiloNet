package mx.edu.utez.proyectotextil.Controllers;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import mx.edu.utez.proyectotextil.services.AuthService;
import mx.edu.utez.proyectotextil.models.Usuario;
import java.io.IOException;
import java.io.PrintWriter;
import com.google.gson.Gson;
import java.util.HashMap;
import java.util.Map;

@WebServlet(name = "authApiController", urlPatterns = {"/api/auth/login", "/api/auth/logout", "/api/auth/validate"})
public class AuthApiController extends HttpServlet {
    private Gson gson = new Gson();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String path = request.getServletPath(); // Cambiado de getRequestURI()
        response.setContentType("application/json;charset=UTF-8");

        if ("/api/auth/login".equals(path)) {
            handleLogin(request, response);
        } else if ("/api/auth/logout".equals(path)) {
            handleLogout(request, response);
        } else {
            sendError(response, HttpServletResponse.SC_NOT_FOUND, "Endpoint no encontrado");
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String path = request.getServletPath(); // Cambiado de getRequestURI()
        response.setContentType("application/json;charset=UTF-8");

        if ("/api/auth/validate".equals(path)) {
            handleValidate(request, response);
        } else {
            sendError(response, HttpServletResponse.SC_NOT_FOUND, "Endpoint no encontrado");
        }
    }

    private void handleLogin(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            Map<String, String> datos = gson.fromJson(request.getReader(), Map.class);
            String username = datos.get("username");
            String password = datos.get("password");

            AuthService.LoginResult resultado = AuthService.validarCredenciales(username, password);

            if (resultado.success) {
                // Crear sesión
                HttpSession session = request.getSession(true);
                session.setAttribute("usuarioId", resultado.usuario.getIdUsuarios());
                session.setAttribute("username", resultado.usuario.getNumeroTelefono());
                session.setAttribute("nombre", resultado.usuario.getNombre());
                session.setAttribute("rol", resultado.usuario.getRolNombre());
                session.setAttribute("area", resultado.usuario.getAreaNombre());
                session.setMaxInactiveInterval(3600); // 1 hora

                // Responder con éxito
                Map<String, Object> respuesta = new HashMap<>();
                respuesta.put("success", true);
                respuesta.put("message", resultado.message);
                respuesta.put("usuario", new HashMap<String, Object>() {{
                    put("id", resultado.usuario.getIdUsuarios());
                    put("nombre", resultado.usuario.getNombre());
                    put("rol", resultado.usuario.getRolNombre());
                    put("area", resultado.usuario.getAreaNombre());
                }});

                response.setStatus(HttpServletResponse.SC_OK);
                response.getWriter().write(gson.toJson(respuesta));
            } else {
                sendError(response, HttpServletResponse.SC_UNAUTHORIZED, resultado.message);
            }
        } catch (Exception e) {
            sendError(response, HttpServletResponse.SC_BAD_REQUEST, "Error procesando login: " + e.getMessage());
        }
    }

    private void handleLogout(HttpServletRequest request, HttpServletResponse response) throws IOException {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("success", true);
        respuesta.put("message", "Sesión cerrada");

        response.setStatus(HttpServletResponse.SC_OK);
        response.getWriter().write(gson.toJson(respuesta));
    }

    private void handleValidate(HttpServletRequest request, HttpServletResponse response) throws IOException {
        HttpSession session = request.getSession(false);

        if (session != null && session.getAttribute("usuarioId") != null) {
            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("success", true);
            respuesta.put("message", "Sesión válida");
            respuesta.put("usuario", new HashMap<String, Object>() {{
                put("id", session.getAttribute("usuarioId"));
                put("nombre", session.getAttribute("nombre"));
                put("rol", session.getAttribute("rol"));
                put("area", session.getAttribute("area"));
            }});

            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write(gson.toJson(respuesta));
        } else {
            sendError(response, HttpServletResponse.SC_UNAUTHORIZED, "Sesión no válida o expirada");
        }
    }

    private void sendError(HttpServletResponse response, int statusCode, String message) throws IOException {
        Map<String, Object> error = new HashMap<>();
        error.put("success", false);
        error.put("message", message);

        response.setStatus(statusCode);
        response.getWriter().write(gson.toJson(error));
    }
}
