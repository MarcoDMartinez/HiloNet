package mx.edu.utez.proyectotextil.dao;

import mx.edu.utez.proyectotextil.models.DetallePedido;
import mx.edu.utez.proyectotextil.utils.DatabaseConnection;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class DetallePedidoDao {
    private static final String TABLE = DatabaseConnection.qualifiedName("DETALLES_PEDIDOS");

    public List<DetallePedido> getByPedidoId(int pedidoId) {
        ensureTableExists();
        String sql = "SELECT ID_DETALLE, TALLA, CANTIDAD, ID_PEDIDOS FROM " + TABLE + " WHERE ID_PEDIDOS = ? ORDER BY ID_DETALLE";
        List<DetallePedido> detalles = new ArrayList<>();
        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, pedidoId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    detalles.add(mapDetalle(rs));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return detalles;
    }

    public DetallePedido create(DetallePedido detalle) {
        ensureTableExists();
        String sql = "INSERT INTO " + TABLE + " (TALLA, CANTIDAD, ID_PEDIDOS) VALUES (?, ?, ?)";
        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, detalle.getTalla());
            ps.setInt(2, detalle.getCantidad());
            ps.setInt(3, detalle.getIdPedidos());
            if (ps.executeUpdate() == 1) {
                return detalle;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    private void ensureTableExists() {
        String checkSql = "SELECT COUNT(*) FROM ALL_TABLES WHERE OWNER = '" + DatabaseConnection.getSchema() + "' AND TABLE_NAME = 'DETALLES_PEDIDOS'";
        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(checkSql);
             ResultSet rs = ps.executeQuery()) {
            if (rs.next() && rs.getInt(1) == 0) {
                String createSql = "CREATE TABLE " + TABLE + " (ID_DETALLE NUMBER GENERATED AS IDENTITY PRIMARY KEY, TALLA VARCHAR2(10) NOT NULL, CANTIDAD NUMBER NOT NULL CHECK (CANTIDAD > 0), ID_PEDIDOS NUMBER NOT NULL REFERENCES " + DatabaseConnection.qualifiedName("PEDIDOS") + ")";
                try (PreparedStatement createPs = con.prepareStatement(createSql)) {
                    createPs.executeUpdate();
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private DetallePedido mapDetalle(ResultSet rs) throws SQLException {
        DetallePedido detalle = new DetallePedido();
        detalle.setIdDetalle(rs.getInt("ID_DETALLE"));
        detalle.setTalla(rs.getString("TALLA"));
        detalle.setCantidad(rs.getInt("CANTIDAD"));
        detalle.setIdPedidos(rs.getInt("ID_PEDIDOS"));
        return detalle;
    }
}
