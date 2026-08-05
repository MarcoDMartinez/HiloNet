package mx.edu.utez.proyectotextil.Controllers;

import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import mx.edu.utez.proyectotextil.services.TareaService;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@WebServlet(name = "tareaApiController", urlPatterns = {"/api/tareas/*"})
public class TareaApiController extends HttpServlet {
    private final Gson gson = new GsonBuilder()
            .registerTypeAdapter(LocalDateTime.class, new JsonSerializer<LocalDateTime>() {
                @Override
                public JsonElement serialize(LocalDateTime src, java.lang.reflect.Type typeOfSrc, JsonSerializationContext context) {
                    return new JsonPrimitive(src == null ? null : src.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
                }
            })
            .create();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json;charset=UTF-8");
        String pathInfo = request.getPathInfo();
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("success", true);
        if (pathInfo != null && !pathInfo.equals("/")) {
            String area = pathInfo.substring(1);
            respuesta.put("data", TareaService.obtenerPorArea(area));
        } else {
            respuesta.put("data", TareaService.obtenerTodas());
        }
        response.getWriter().write(gson.toJson(respuesta));
    }
}
