package mx.edu.utez.proyectotextil.services;

import mx.edu.utez.proyectotextil.dao.PedidoDao;
import mx.edu.utez.proyectotextil.models.Pedido;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class PedidoService {
    private static final PedidoDao pedidoDao = new PedidoDao();

    public static List<Pedido> obtenerTodos() {
        return pedidoDao.getAll();
    }

    public static Pedido obtenerPorId(String id) {
        return pedidoDao.getById(id);
    }

    public static List<Pedido> obtenerPorEstado(String estado) {
        return pedidoDao.getByEstado(estado);
    }

    public static List<Pedido> obtenerPorArea(String area) {
        List<Pedido> pedidos = pedidoDao.getAll();
        List<Pedido> resultado = new ArrayList<>();
        for (Pedido pedido : pedidos) {
            if (pedido.getAreas() != null && pedido.getAreas().contains(area)) {
                resultado.add(pedido);
            }
        }
        return resultado;
    }

    public static Pedido crearPedido(String cliente, String descripcion, String areas) {
        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setDescripcion(descripcion);
        pedido.setAreas(areas);
        pedido.setEstado("Pendiente");
        return pedidoDao.create(pedido);
    }

    public static boolean actualizarEstado(String id, String nuevoEstado) {
        if (!esEstadoValido(nuevoEstado)) {
            return false;
        }
        return pedidoDao.updateEstado(id, nuevoEstado);
    }

    private static boolean esEstadoValido(String estado) {
        return estado != null && (
                estado.equals("Pendiente") ||
                estado.equals("En producción") ||
                estado.equals("Entregado")
        );
    }

    public static Map<String, Object> obtenerEstadisticas() {
        List<Pedido> pedidos = pedidoDao.getAll();
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", pedidos.size());
        stats.put("pendientes", pedidos.stream().filter(p -> p.getEstado().equals("Pendiente")).count());
        stats.put("en_produccion", pedidos.stream().filter(p -> p.getEstado().equals("En producción")).count());
        stats.put("entregados", pedidos.stream().filter(p -> p.getEstado().equals("Entregado")).count());
        return stats;
    }
}
