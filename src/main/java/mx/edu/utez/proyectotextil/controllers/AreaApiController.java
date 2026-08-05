package mx.edu.utez.proyectotextil.controllers;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import mx.edu.utez.proyectotextil.services.AreaService;
import com.google.gson.Gson;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@WebServlet(name = "areaApiController", urlPatterns = {"/api/areas/*"})
public class AreaApiController extends HttpServlet {
    private Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json;charset=UTF-8");
        String pathInfo = request.getPathInfo();

        if (pathInfo == null || pathInfo.equals("/")) {
            // GET /api/areas - obtener todas
            response.getWriter().write(gson.toJson(new HashMap<String, Object>() {{
                put("success", true);
                put("data", AreaService.obtenerAreasActivas());
            }}));
        } else {
            // GET /api/areas/{id}
            String id = pathInfo.substring(1);
            var area = AreaService.obtenerAreaPorId(id);
            if (area != null) {
                response.getWriter().write(gson.toJson(new HashMap<String, Object>() {{
                    put("success", true);
                    put("data", area);
                }}));
            } else {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                response.getWriter().write(gson.toJson(new HashMap<String, Object>() {{
                    put("success", false);
                    put("message", "Área no encontrada");
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
            String nombre = datos.get("nombre");
            String responsable = datos.get("responsable");
            int empleados = Integer.parseInt(datos.get("empleados"));
            String color = datos.get("color");

            if (nombre == null || nombre.trim().isEmpty()) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write(gson.toJson(new HashMap<String, Object>() {{
                    put("success", false);
                    put("message", "Nombre de área requerido");
                }}));
                return;
            }

            var nuevaArea = AreaService.crearArea(nombre, responsable, empleados, color);
            response.setStatus(HttpServletResponse.SC_CREATED);
            response.getWriter().write(gson.toJson(new HashMap<String, Object>() {{
                put("success", true);
                put("message", "Área creada");
                put("data", nuevaArea);
            }}));
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(gson.toJson(new HashMap<String, Object>() {{
                put("success", false);
                put("message", "Error creando área: " + e.getMessage());
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
                put("message", "ID de área requerido");
            }}));
            return;
        }

        String id = pathInfo.substring(1);
        var areaExistente = AreaService.obtenerAreaPorId(id);
        if (areaExistente == null) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            response.getWriter().write(gson.toJson(new HashMap<String, Object>() {{
                put("success", false);
                put("message", "Área no encontrada");
            }}));
            return;
        }

        try {
            Map<String, String> datos = gson.fromJson(request.getReader(), Map.class);
            areaExistente.setNombre(datos.getOrDefault("nombre", areaExistente.getNombre()));
            areaExistente.setResponsable(datos.getOrDefault("responsable", areaExistente.getResponsable()));
            if (datos.containsKey("empleados")) {
                areaExistente.setEmpleados(Integer.parseInt(datos.get("empleados")));
            }

            AreaService.actualizarArea(id, areaExistente);
            response.getWriter().write(gson.toJson(new HashMap<String, Object>() {{
                put("success", true);
                put("message", "Área actualizada");
                put("data", areaExistente);
            }}));
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(gson.toJson(new HashMap<String, Object>() {{
                put("success", false);
                put("message", "Error actualizando área: " + e.getMessage());
            }}));
        }
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json;charset=UTF-8");
        String pathInfo = request.getPathInfo();

        if (pathInfo == null || pathInfo.equals("/")) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(gson.toJson(new HashMap<String, Object>() {{
                put("success", false);
                put("message", "ID de área requerido");
            }}));
            return;
        }

        String id = pathInfo.substring(1);
        if (AreaService.desactivarArea(id)) {
            response.getWriter().write(gson.toJson(new HashMap<String, Object>() {{
                put("success", true);
                put("message", "Área desactivada");
            }}));
        } else {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            response.getWriter().write(gson.toJson(new HashMap<String, Object>() {{
                put("success", false);
                put("message", "Área no encontrada");
            }}));
        }
    }
}
