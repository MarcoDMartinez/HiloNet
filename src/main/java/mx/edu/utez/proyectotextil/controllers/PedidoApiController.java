package mx.edu.utez.proyectotextil.Controllers;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import mx.edu.utez.proyectotextil.services.PedidoService;
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

@WebServlet(name = "pedidoApiController", urlPatterns = {"/api/pedidos/*"})
public class PedidoApiController extends HttpServlet {
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
            // GET /api/pedidos - obtener todos o filtrados
            if (query != null && query.contains("estado=")) {
                String estado = query.split("estado=")[1];
                response.getWriter().write(gson.toJson(new HashMap<String, Object>() {{
                    put("success", true);
                    put("data", PedidoService.obtenerPorEstado(estado));
                }}));
            } else {
                response.getWriter().write(gson.toJson(new HashMap<String, Object>() {{
                    put("success", true);
                    put("data", PedidoService.obtenerTodos());
                }}));
            }
        } else {
            // GET /api/pedidos/{id}
            String id = pathInfo.substring(1);
            var pedido = PedidoService.obtenerPorId(id);
            if (pedido != null) {
                response.getWriter().write(gson.toJson(new HashMap<String, Object>() {{
                    put("success", true);
                    put("data", pedido);
                }}));
            } else {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                response.getWriter().write(gson.toJson(new HashMap<String, Object>() {{
                    put("success", false);
                    put("message", "Pedido no encontrado");
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
            String cliente = datos.get("cliente");
            String descripcion = datos.get("descripcion");
            String areas = datos.get("areas");

            if (cliente == null || cliente.trim().isEmpty()) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write(gson.toJson(new HashMap<String, Object>() {{
                    put("success", false);
                    put("message", "Cliente requerido");
                }}));
                return;
            }

            var nuevoPedido = PedidoService.crearPedido(cliente, descripcion, areas);
            response.setStatus(HttpServletResponse.SC_CREATED);
            response.getWriter().write(gson.toJson(new HashMap<String, Object>() {{
                put("success", true);
                put("message", "Pedido creado");
                put("data", nuevoPedido);
            }}));
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(gson.toJson(new HashMap<String, Object>() {{
                put("success", false);
                put("message", "Error creando pedido: " + e.getMessage());
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
                put("message", "ID de pedido requerido");
            }}));
            return;
        }

        String id = pathInfo.substring(1);
        var pedidoExistente = PedidoService.obtenerPorId(id);
        if (pedidoExistente == null) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            response.getWriter().write(gson.toJson(new HashMap<String, Object>() {{
                put("success", false);
                put("message", "Pedido no encontrado");
            }}));
            return;
        }

        try {
            Map<String, String> datos = gson.fromJson(request.getReader(), Map.class);
            if (datos.containsKey("estado")) {
                String nuevoEstado = datos.get("estado");
                if (PedidoService.actualizarEstado(id, nuevoEstado)) {
                    response.getWriter().write(gson.toJson(new HashMap<String, Object>() {{
                        put("success", true);
                        put("message", "Pedido actualizado");
                        put("data", PedidoService.obtenerPorId(id));
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
                put("message", "Error actualizando pedido: " + e.getMessage());
            }}));
        }
    }
}
