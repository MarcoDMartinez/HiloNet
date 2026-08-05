package mx.edu.utez.proyectotextil.Controllers;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import mx.edu.utez.proyectotextil.services.IncidenciaService;
import com.google.gson.Gson;
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

@WebServlet(name = "incidenciaApiController", urlPatterns = {"/api/incidencias/*"})
public class IncidenciaApiController extends HttpServlet {
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
        String query = request.getQueryString();

        if (pathInfo == null || pathInfo.equals("/")) {
            // GET /api/incidencias - obtener todas o filtradas
            if (query != null && query.contains("prioridad=")) {
                String prioridad = query.split("prioridad=")[1];
                response.getWriter().write(gson.toJson(new HashMap<String, Object>() {{
                    put("success", true);
                    put("data", IncidenciaService.obtenerPorPrioridad(prioridad));
                }}));
            } else {
                response.getWriter().write(gson.toJson(new HashMap<String, Object>() {{
                    put("success", true);
                    put("data", IncidenciaService.obtenerTodas());
                }}));
            }
        } else {
            // GET /api/incidencias/{id}
            String id = pathInfo.substring(1);
            var incidencia = IncidenciaService.obtenerPorId(id);
            if (incidencia != null) {
                response.getWriter().write(gson.toJson(new HashMap<String, Object>() {{
                    put("success", true);
                    put("data", incidencia);
                }}));
            } else {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                response.getWriter().write(gson.toJson(new HashMap<String, Object>() {{
                    put("success", false);
                    put("message", "Incidencia no encontrada");
                }}));
            }
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json;charset=UTF-8");

        try {
            Map<String, String> datos = gson.fromJson(request.getReader(), Map.class);
            String titulo = datos.get("titulo");
            String descripcion = datos.get("descripcion");
            String area = datos.get("area");
            String prioridad = datos.get("prioridad");

            if (titulo == null || titulo.trim().isEmpty()) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write(gson.toJson(new HashMap<String, Object>() {{
                    put("success", false);
                    put("message", "Título requerido");
                }}));
                return;
            }

            var nuevaIncidencia = IncidenciaService.crearIncidencia(titulo, descripcion, area, prioridad);
            response.setStatus(HttpServletResponse.SC_CREATED);
            response.getWriter().write(gson.toJson(new HashMap<String, Object>() {{
                put("success", true);
                put("message", "Incidencia creada");
                put("data", nuevaIncidencia);
            }}));
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(gson.toJson(new HashMap<String, Object>() {{
                put("success", false);
                put("message", "Error creando incidencia: " + e.getMessage());
            }}));
        }
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json;charset=UTF-8");
        String pathInfo = request.getPathInfo();

        if (pathInfo == null || pathInfo.equals("/")) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(gson.toJson(new HashMap<String, Object>() {{
                put("success", false);
                put("message", "ID de incidencia requerido");
            }}));
            return;
        }

        String id = pathInfo.substring(1);
        var incidenciaExistente = IncidenciaService.obtenerPorId(id);
        if (incidenciaExistente == null) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            response.getWriter().write(gson.toJson(new HashMap<String, Object>() {{
                put("success", false);
                put("message", "Incidencia no encontrada");
            }}));
            return;
        }

        try {
            Map<String, String> datos = gson.fromJson(request.getReader(), Map.class);
            if (datos.containsKey("estado")) {
                String nuevoEstado = datos.get("estado");
                if (IncidenciaService.actualizarEstado(id, nuevoEstado)) {
                    response.getWriter().write(gson.toJson(new HashMap<String, Object>() {{
                        put("success", true);
                        put("message", "Incidencia actualizada");
                        put("data", IncidenciaService.obtenerPorId(id));
                    }}));
                } else {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    response.getWriter().write(gson.toJson(new HashMap<String, Object>() {{
                        put("success", false);
                        put("message", "Estado inválido");
                    }}));
                }
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(gson.toJson(new HashMap<String, Object>() {{
                put("success", false);
                put("message", "Error actualizando incidencia: " + e.getMessage());
            }}));
        }
    }
}
