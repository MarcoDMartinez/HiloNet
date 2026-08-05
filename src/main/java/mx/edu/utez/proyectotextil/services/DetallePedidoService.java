package mx.edu.utez.proyectotextil.services;

import mx.edu.utez.proyectotextil.dao.DetallePedidoDao;
import mx.edu.utez.proyectotextil.models.DetallePedido;
import java.util.List;

public class DetallePedidoService {
    private final DetallePedidoDao dao = new DetallePedidoDao();

    public List<DetallePedido> listarPorPedido(int pedidoId) { return dao.getByPedidoId(pedidoId); }

    public DetallePedido crear(DetallePedido detalle) { return dao.create(detalle); }
}
