package mx.edu.utez.proyectotextil.dao;

import mx.edu.utez.proyectotextil.models.Incidencia;
import mx.edu.utez.proyectotextil.utils.DatabaseConnection;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class IncidenciaDao {

    private static final String TABLE = DatabaseConnection.qualifiedName("INCIDENCIAS");

    public List<Incidencia> getAll() {
        ensureTableExists();
        String sql = "SELECT ID_INCIDENCIA, TITULO, DESCRIPCION, AREA, PRIORIDAD, ESTADO, PEDIDO, CREADO, ACTUALIZADO FROM " + TABLE + " ORDER BY CREADO DESC";
        List<Incidencia> incidencias = new ArrayList<>();

        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
               incidencias.add(mapIncidencia(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return incidencias;
    }

    public Incidencia getById(String id) {
        ensureTableExists();
        String sql = "SELECT ID_INCIDENCIA, TITULO, DESCRIPCION, AREA, PRIORIDAD, ESTADO, PEDIDO, CREADO, ACTUALIZADO FROM " + TABLE + " WHERE ID_INCIDENCIA = ?";

        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, id);
            try (ResultSet rs = ps.executeQuery()) {
               if (rs.next()) {
                   return mapIncidencia(rs);
               }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public List<Incidencia> getByArea(String area) {
        ensureTableExists();
        String sql = "SELECT ID_INCIDENCIA, TITULO, DESCRIPCION, AREA, PRIORIDAD, ESTADO, PEDIDO, CREADO, ACTUALIZADO FROM " + TABLE + " WHERE UPPER(AREA) = UPPER(?) ORDER BY CREADO DESC";
        List<Incidencia> incidencias = new ArrayList<>();

        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, area);
            try (ResultSet rs = ps.executeQuery()) {
               while (rs.next()) {
                   incidencias.add(mapIncidencia(rs));
               }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return incidencias;
    }

    public List<Incidencia> getByPrioridad(String prioridad) {
        ensureTableExists();
        String sql = "SELECT ID_INCIDENCIA, TITULO, DESCRIPCION, AREA, PRIORIDAD, ESTADO, PEDIDO, CREADO, ACTUALIZADO FROM " + TABLE + " WHERE UPPER(PRIORIDAD) = UPPER(?) ORDER BY CREADO DESC";
        List<Incidencia> incidencias = new ArrayList<>();

        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, prioridad);
            try (ResultSet rs = ps.executeQuery()) {
               while (rs.next()) {
                   incidencias.add(mapIncidencia(rs));
               }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return incidencias;
    }

    public Incidencia create(Incidencia incidencia) {
        ensureTableExists();
        String nextId = nextId("INCIDENCIAS", "INC-");
        String sql = "INSERT INTO " + TABLE + " (ID_INCIDENCIA, TITULO, DESCRIPCION, AREA, PRIORIDAD, ESTADO, PEDIDO, CREADO, ACTUALIZADO) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            LocalDateTime now = LocalDateTime.now();
            ps.setString(1, nextId);
            ps.setString(2, incidencia.getTitulo());
            ps.setString(3, incidencia.getDescripcion());
            ps.setString(4, incidencia.getArea());
            ps.setString(5, incidencia.getPrioridad());
            ps.setString(6, incidencia.getEstado() != null ? incidencia.getEstado() : "Abierta");
            ps.setString(7, incidencia.getPedido());
            ps.setTimestamp(8, Timestamp.valueOf(now));
            ps.setTimestamp(9, Timestamp.valueOf(now));
            if (ps.executeUpdate() == 1) {
               incidencia.setId(nextId);
               incidencia.setActualizado(now);
               return incidencia;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public boolean updateEstado(String id, String estado) {
        ensureTableExists();
        String sql = "UPDATE " + TABLE + " SET ESTADO = ?, ACTUALIZADO = ? WHERE ID_INCIDENCIA = ?";

        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, estado);
            ps.setTimestamp(2, Timestamp.valueOf(LocalDateTime.now()));
            ps.setString(3, id);
            return ps.executeUpdate() == 1;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    private void ensureTableExists() {
        String checkSql = "SELECT COUNT(*) FROM ALL_TABLES WHERE OWNER = '" + DatabaseConnection.getSchema() + "' AND TABLE_NAME = 'INCIDENCIAS'";
        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(checkSql);
             ResultSet rs = ps.executeQuery()) {
            if (rs.next() && rs.getInt(1) == 0) {
               String createSql = "CREATE TABLE " + TABLE + " (" +
                       "ID_INCIDENCIA VARCHAR2(20) PRIMARY KEY, " +
                       "TITULO VARCHAR2(200) NOT NULL, " +
                       "DESCRIPCION VARCHAR2(1000), " +
                       "AREA VARCHAR2(100), " +
                       "PRIORIDAD VARCHAR2(20), " +
                       "ESTADO VARCHAR2(30) NOT NULL, " +
                       "PEDIDO VARCHAR2(20), " +
                       "CREADO TIMESTAMP NOT NULL, " +
                       "ACTUALIZADO TIMESTAMP NOT NULL)";
               try (PreparedStatement createPs = con.prepareStatement(createSql)) {
                   createPs.executeUpdate();
               }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private String nextId(String tableName, String prefix) {
        String sql = "SELECT COUNT(*) AS TOTAL FROM " + DatabaseConnection.qualifiedName(tableName);
        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            if (rs.next()) {
               return prefix + String.format("%03d", rs.getInt("TOTAL") + 1);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return prefix + "001";
    }

    private Incidencia mapIncidencia(ResultSet rs) throws SQLException {
        Incidencia incidencia = new Incidencia();
        incidencia.setId(rs.getString("ID_INCIDENCIA"));
        incidencia.setTitulo(rs.getString("TITULO"));
        incidencia.setDescripcion(rs.getString("DESCRIPCION"));
        incidencia.setArea(rs.getString("AREA"));
        incidencia.setPrioridad(rs.getString("PRIORIDAD"));
        incidencia.setEstado(rs.getString("ESTADO"));
        incidencia.setPedido(rs.getString("PEDIDO"));
        Timestamp creado = rs.getTimestamp("CREADO");
        if (creado != null) {
            incidencia.setCreado(creado.toLocalDateTime());
        }
        Timestamp actualizado = rs.getTimestamp("ACTUALIZADO");
        if (actualizado != null) {
            incidencia.setActualizado(actualizado.toLocalDateTime());
        }
        return incidencia;
    }
}
