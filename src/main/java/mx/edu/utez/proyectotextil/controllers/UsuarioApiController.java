package mx.edu.utez.proyectotextil.Controllers;

import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import mx.edu.utez.proyectotextil.dao.UsuarioDao;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@WebServlet(name = "usuarioApiController", urlPatterns = {"/api/usuarios/*"})
public class UsuarioApiController extends HttpServlet {
    private final Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json;charset=UTF-8");
        UsuarioDao dao = new UsuarioDao();
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("success", true);
        respuesta.put("data", dao.getAllActiveUsers());
        response.getWriter().write(gson.toJson(respuesta));
    }
}
