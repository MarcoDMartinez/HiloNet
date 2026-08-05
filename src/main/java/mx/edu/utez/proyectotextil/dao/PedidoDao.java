package mx.edu.utez.proyectotextil.dao;

import mx.edu.utez.proyectotextil.models.Pedido;
import mx.edu.utez.proyectotextil.utils.DatabaseConnection;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class PedidoDao {

    private static final String PEDIDOS_TABLE = DatabaseConnection.qualifiedName("PEDIDOS");
    private static final String USUARIOS_TABLE = DatabaseConnection.qualifiedName("USUARIOS");
    private static final String AREAS_TABLE = DatabaseConnection.qualifiedName("AREAS");
    private static final String ASIGNACION_TABLE = DatabaseConnection.qualifiedName("ASIGNACION_PEDIDO_AREA");

    public List<Pedido> getAll() {
        ensureTablesExist();
        String sql = "SELECT ID_PEDIDO, CLIENTE, DESCRIPCION, AREAS, FECHA, ESTADO, CREADO, ACTUALIZADO FROM ("
               + "SELECT P.ID_PEDIDOS AS ID_PEDIDO, "
               + "COALESCE(U.NOMBRE || ' ' || U.APELLIDO_P, 'Sin cliente') AS CLIENTE, "
               + "P.DESCRIPCION AS DESCRIPCION, "
               + "COALESCE(LISTAGG(A.AREA_NOMBRE, ', ') WITHIN GROUP (ORDER BY A.AREA_NOMBRE), '') AS AREAS, "
               + "P.DIA_PEDIDO AS FECHA, "
               + "COALESCE(MAX(APA.ESTADO_TAREA), 'PENDIENTE') AS ESTADO, "
               + "P.DIA_PEDIDO AS CREADO, "
               + "P.DIA_PEDIDO AS ACTUALIZADO "
               + "FROM " + PEDIDOS_TABLE + " P "
               + "LEFT JOIN " + USUARIOS_TABLE + " U ON P.ID_USUARIOS = U.ID_USUARIOS "
               + "LEFT JOIN " + ASIGNACION_TABLE + " APA ON P.ID_PEDIDOS = APA.ID_PEDIDOS "
               + "LEFT JOIN " + AREAS_TABLE + " A ON APA.ID_AREA = A.ID_AREA "
               + "GROUP BY P.ID_PEDIDOS, U.NOMBRE, U.APELLIDO_P, P.DESCRIPCION, P.DIA_PEDIDO) "
               + "ORDER BY CREADO DESC";
        List<Pedido> pedidos = new ArrayList<>();

        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
               pedidos.add(mapPedido(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return pedidos;
    }

    public Pedido getById(String id) {
        ensureTablesExist();
        String sql = "SELECT ID_PEDIDO, CLIENTE, DESCRIPCION, AREAS, FECHA, ESTADO, CREADO, ACTUALIZADO FROM ("
               + "SELECT P.ID_PEDIDOS AS ID_PEDIDO, "
               + "COALESCE(U.NOMBRE || ' ' || U.APELLIDO_P, 'Sin cliente') AS CLIENTE, "
               + "P.DESCRIPCION AS DESCRIPCION, "
               + "COALESCE(LISTAGG(A.AREA_NOMBRE, ', ') WITHIN GROUP (ORDER BY A.AREA_NOMBRE), '') AS AREAS, "
               + "P.DIA_PEDIDO AS FECHA, "
               + "COALESCE(MAX(APA.ESTADO_TAREA), 'PENDIENTE') AS ESTADO, "
               + "P.DIA_PEDIDO AS CREADO, "
               + "P.DIA_PEDIDO AS ACTUALIZADO "
               + "FROM " + PEDIDOS_TABLE + " P "
               + "LEFT JOIN " + USUARIOS_TABLE + " U ON P.ID_USUARIOS = U.ID_USUARIOS "
               + "LEFT JOIN " + ASIGNACION_TABLE + " APA ON P.ID_PEDIDOS = APA.ID_PEDIDOS "
               + "LEFT JOIN " + AREAS_TABLE + " A ON APA.ID_AREA = A.ID_AREA "
               + "WHERE P.ID_PEDIDOS = ? "
               + "GROUP BY P.ID_PEDIDOS, U.NOMBRE, U.APELLIDO_P, P.DESCRIPCION, P.DIA_PEDIDO)";

        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, id);
            try (ResultSet rs = ps.executeQuery()) {
               if (rs.next()) {
                   return mapPedido(rs);
               }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public List<Pedido> getByEstado(String estado) {
        ensureTablesExist();
        String sql = "SELECT ID_PEDIDO, CLIENTE, DESCRIPCION, AREAS, FECHA, ESTADO, CREADO, ACTUALIZADO FROM ("
               + "SELECT P.ID_PEDIDOS AS ID_PEDIDO, "
               + "COALESCE(U.NOMBRE || ' ' || U.APELLIDO_P, 'Sin cliente') AS CLIENTE, "
               + "P.DESCRIPCION AS DESCRIPCION, "
               + "COALESCE(LISTAGG(A.AREA_NOMBRE, ', ') WITHIN GROUP (ORDER BY A.AREA_NOMBRE), '') AS AREAS, "
               + "P.DIA_PEDIDO AS FECHA, "
               + "COALESCE(MAX(APA.ESTADO_TAREA), 'PENDIENTE') AS ESTADO, "
               + "P.DIA_PEDIDO AS CREADO, "
               + "P.DIA_PEDIDO AS ACTUALIZADO "
               + "FROM " + PEDIDOS_TABLE + " P "
               + "LEFT JOIN " + USUARIOS_TABLE + " U ON P.ID_USUARIOS = U.ID_USUARIOS "
               + "LEFT JOIN " + ASIGNACION_TABLE + " APA ON P.ID_PEDIDOS = APA.ID_PEDIDOS "
               + "LEFT JOIN " + AREAS_TABLE + " A ON APA.ID_AREA = A.ID_AREA "
               + "GROUP BY P.ID_PEDIDOS, U.NOMBRE, U.APELLIDO_P, P.DESCRIPCION, P.DIA_PEDIDO) "
               + "WHERE UPPER(ESTADO) = UPPER(?) ORDER BY CREADO DESC";
        List<Pedido> pedidos = new ArrayList<>();

        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, estado);
            try (ResultSet rs = ps.executeQuery()) {
               while (rs.next()) {
                   pedidos.add(mapPedido(rs));
               }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return pedidos;
    }

    public Pedido create(Pedido pedido) {
        ensureTablesExist();
        String sql = "INSERT INTO " + PEDIDOS_TABLE + " (DIA_PEDIDO, TOTAL, DESCRIPCION, FECHA_ENTREGA_ESTIMADA, ID_USUARIOS, CODIGO_VERIFICACION, CODIGO_EXPIRACION) VALUES (?, ?, ?, ?, ?, ?, ?)";

        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            LocalDateTime now = LocalDateTime.now();
            Timestamp pedidoTimestamp = Timestamp.valueOf(pedido.getFecha() != null ? pedido.getFecha() : now);
            Timestamp entregaTimestamp = Timestamp.valueOf(pedido.getFecha() != null ? pedido.getFecha().plusDays(3) : now.plusDays(3));
            int usuarioId = resolveDefaultUsuarioId(con);

            ps.setTimestamp(1, pedidoTimestamp);
            ps.setBigDecimal(2, java.math.BigDecimal.valueOf(0.00));
            ps.setString(3, pedido.getDescripcion());
            ps.setTimestamp(4, entregaTimestamp);
            ps.setInt(5, usuarioId);
            ps.setString(6, null);
            ps.setTimestamp(7, null);

            if (ps.executeUpdate() == 1) {
               int generatedId = getLastGeneratedId(con, "ID_PEDIDOS");
               pedido.setId(String.valueOf(generatedId));
               pedido.setFecha(pedido.getFecha() != null ? pedido.getFecha() : now);
               pedido.setCreado(now);
               pedido.setActualizado(now);
               persistAreasForPedido(con, generatedId, pedido.getAreas());
               return pedido;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public boolean updateEstado(String id, String estado) {
        ensureTablesExist();
        String sql = "UPDATE " + ASIGNACION_TABLE + " SET ESTADO_TAREA = ? WHERE ID_PEDIDOS = ?";

        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, mapEstadoToSchema(estado));
            ps.setInt(2, Integer.parseInt(id));
            return ps.executeUpdate() >= 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    private void ensureTablesExist() {
        try (Connection con = DatabaseConnection.getConnection()) {
            ensureTableExists(con, "PEDIDOS", "CREATE TABLE " + PEDIDOS_TABLE + " (ID_PEDIDOS NUMBER GENERATED AS IDENTITY PRIMARY KEY, DIA_PEDIDO TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL, TOTAL NUMBER(10,2) DEFAULT 0.00 NOT NULL CHECK (TOTAL >= 0), DESCRIPCION VARCHAR2(500), FECHA_ENTREGA_ESTIMADA DATE NOT NULL, ID_USUARIOS NUMBER NOT NULL REFERENCES " + USUARIOS_TABLE + ", CODIGO_VERIFICACION VARCHAR2(10), CODIGO_EXPIRACION TIMESTAMP)");
            ensureTableExists(con, "AREAS", "CREATE TABLE " + AREAS_TABLE + " (ID_AREA NUMBER GENERATED AS IDENTITY PRIMARY KEY, AREA_NOMBRE VARCHAR2(50) NOT NULL)");
            ensureTableExists(con, "ASIGNACION_PEDIDO_AREA", "CREATE TABLE " + ASIGNACION_TABLE + " (ID_PEDIDOS NUMBER NOT NULL REFERENCES " + PEDIDOS_TABLE + ", ID_AREA NUMBER NOT NULL REFERENCES " + AREAS_TABLE + ", ESTADO_TAREA VARCHAR2(50) DEFAULT 'PENDIENTE' NOT NULL CHECK (ESTADO_TAREA IN ('PENDIENTE', 'EN_PROCESO', 'COMPLETADO', 'CANCELADO')), ACTUALIZACION_FECHA TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL, PRIMARY KEY (ID_PEDIDOS, ID_AREA))");
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private void ensureTableExists(Connection con, String tableName, String createSql) throws SQLException {
        String checkSql = "SELECT COUNT(*) FROM ALL_TABLES WHERE OWNER = '" + DatabaseConnection.getSchema() + "' AND TABLE_NAME = '" + tableName + "'";
        try (PreparedStatement checkPs = con.prepareStatement(checkSql);
             ResultSet rs = checkPs.executeQuery()) {
            if (rs.next() && rs.getInt(1) == 0) {
               try (PreparedStatement createPs = con.prepareStatement(createSql)) {
                   createPs.executeUpdate();
               }
            }
        }
    }

    private int resolveDefaultUsuarioId(Connection con) throws SQLException {
        String sql = "SELECT MIN(ID_USUARIOS) AS ID_USUARIOS FROM " + USUARIOS_TABLE;
        try (PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            if (rs.next()) {
               int id = rs.getInt("ID_USUARIOS");
               if (!rs.wasNull()) {
                   return id;
               }
            }
        }
        return 1;
    }

    private void persistAreasForPedido(Connection con, int pedidoId, String areasCsv) throws SQLException {
        if (areasCsv == null || areasCsv.trim().isEmpty()) {
            return;
        }
        String[] areas = areasCsv.split(",");
        for (String areaName : areas) {
            String trimmedName = areaName.trim();
            if (trimmedName.isEmpty()) {
               continue;
            }
            Integer areaId = findAreaId(con, trimmedName);
            if (areaId == null) {
               continue;
            }
            String sql = "INSERT INTO " + ASIGNACION_TABLE + " (ID_PEDIDOS, ID_AREA, ESTADO_TAREA, ACTUALIZACION_FECHA) VALUES (?, ?, 'PENDIENTE', SYSTIMESTAMP)";
            try (PreparedStatement ps = con.prepareStatement(sql)) {
               ps.setInt(1, pedidoId);
               ps.setInt(2, areaId);
               ps.executeUpdate();
            }
        }
    }

    private Integer findAreaId(Connection con, String areaName) throws SQLException {
        String sql = "SELECT ID_AREA FROM " + AREAS_TABLE + " WHERE UPPER(AREA_NOMBRE) = UPPER(?)";
        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, areaName);
            try (ResultSet rs = ps.executeQuery()) {
               if (rs.next()) {
                   return rs.getInt("ID_AREA");
               }
            }
        }
        return null;
    }

    private int getLastGeneratedId(Connection con, String columnName) throws SQLException {
        String sql = "SELECT MAX(" + columnName + ") AS LAST_ID FROM " + PEDIDOS_TABLE;
        try (PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            if (rs.next()) {
                return rs.getInt("LAST_ID");
            }
        }
        return 0;
    }

    private String mapEstadoToSchema(String estado) {
        if (estado == null) {
            return "PENDIENTE";
        }
        switch (estado.toUpperCase()) {
            case "EN PRODUCCION":
            case "EN_PRODUCCION":
               return "EN_PROCESO";
            case "ENTREGADO":
            case "COMPLETADO":
               return "COMPLETADO";
            case "CANCELADO":
               return "CANCELADO";
            default:
               return "PENDIENTE";
        }
    }

    private Pedido mapPedido(ResultSet rs) throws SQLException {
        Pedido pedido = new Pedido();
        pedido.setId(rs.getString("ID_PEDIDO"));
        pedido.setCliente(rs.getString("CLIENTE"));
        pedido.setDescripcion(rs.getString("DESCRIPCION"));
        pedido.setAreas(rs.getString("AREAS"));
        Timestamp fecha = rs.getTimestamp("FECHA");
        if (fecha != null) {
            pedido.setFecha(fecha.toLocalDateTime());
        }
        pedido.setEstado(rs.getString("ESTADO"));
        Timestamp creado = rs.getTimestamp("CREADO");
        if (creado != null) {
            pedido.setCreado(creado.toLocalDateTime());
        }
        Timestamp actualizado = rs.getTimestamp("ACTUALIZADO");
        if (actualizado != null) {
            pedido.setActualizado(actualizado.toLocalDateTime());
        }
        return pedido;
    }
}
