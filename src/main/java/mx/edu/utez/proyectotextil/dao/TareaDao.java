package mx.edu.utez.proyectotextil.dao;

import mx.edu.utez.proyectotextil.models.Tarea;
import mx.edu.utez.proyectotextil.utils.DatabaseConnection;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class TareaDao {

    private static final String TABLE = DatabaseConnection.qualifiedName("TAREAS");

    public List<Tarea> getAll() {
        ensureTableExists();
        String sql = "SELECT ID_TAREA, TITULO, DESCRIPCION, AREA, PEDIDO, ASIGNADO_A, ESTADO, CREADO, ACTUALIZADO FROM " + TABLE + " ORDER BY CREADO DESC";
        List<Tarea> tareas = new ArrayList<>();

        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
               tareas.add(mapTarea(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return tareas;
    }

    public List<Tarea> getByArea(String area) {
        ensureTableExists();
        String sql = "SELECT ID_TAREA, TITULO, DESCRIPCION, AREA, PEDIDO, ASIGNADO_A, ESTADO, CREADO, ACTUALIZADO FROM " + TABLE + " WHERE UPPER(AREA) = UPPER(?) ORDER BY CREADO DESC";
        List<Tarea> tareas = new ArrayList<>();

        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, area);
            try (ResultSet rs = ps.executeQuery()) {
               while (rs.next()) {
                   tareas.add(mapTarea(rs));
               }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return tareas;
    }

    public Tarea create(Tarea tarea) {
        ensureTableExists();
        String nextId = nextId("TAREAS", "T-");
        String sql = "INSERT INTO " + TABLE + " (ID_TAREA, TITULO, DESCRIPCION, AREA, PEDIDO, ASIGNADO_A, ESTADO, CREADO, ACTUALIZADO) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            LocalDateTime now = LocalDateTime.now();
            ps.setString(1, nextId);
            ps.setString(2, tarea.getTitulo());
            ps.setString(3, tarea.getDescripcion());
            ps.setString(4, tarea.getArea());
            ps.setString(5, tarea.getPedido());
            ps.setString(6, tarea.getAsignadoA());
            ps.setString(7, tarea.getEstado() != null ? tarea.getEstado() : "Pendiente");
            ps.setTimestamp(8, Timestamp.valueOf(now));
            ps.setTimestamp(9, Timestamp.valueOf(now));
            if (ps.executeUpdate() == 1) {
               tarea.setId(nextId);
               tarea.setActualizado(now);
               return tarea;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    private void ensureTableExists() {
        String checkSql = "SELECT COUNT(*) FROM ALL_TABLES WHERE OWNER = '" + DatabaseConnection.getSchema() + "' AND TABLE_NAME = 'TAREAS'";
        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(checkSql);
             ResultSet rs = ps.executeQuery()) {
            if (rs.next() && rs.getInt(1) == 0) {
               String createSql = "CREATE TABLE " + TABLE + " (" +
                       "ID_TAREA VARCHAR2(20) PRIMARY KEY, " +
                       "TITULO VARCHAR2(200) NOT NULL, " +
                       "DESCRIPCION VARCHAR2(1000), " +
                       "AREA VARCHAR2(100), " +
                       "PEDIDO VARCHAR2(20), " +
                       "ASIGNADO_A VARCHAR2(100), " +
                       "ESTADO VARCHAR2(30) NOT NULL, " +
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
               return prefix + String.format("%04d", rs.getInt("TOTAL") + 1);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return prefix + "0001";
    }

    private Tarea mapTarea(ResultSet rs) throws SQLException {
        Tarea tarea = new Tarea();
        tarea.setId(rs.getString("ID_TAREA"));
        tarea.setTitulo(rs.getString("TITULO"));
        tarea.setDescripcion(rs.getString("DESCRIPCION"));
        tarea.setArea(rs.getString("AREA"));
        tarea.setPedido(rs.getString("PEDIDO"));
        tarea.setAsignadoA(rs.getString("ASIGNADO_A"));
        tarea.setEstado(rs.getString("ESTADO"));
        Timestamp creado = rs.getTimestamp("CREADO");
        if (creado != null) {
            tarea.setCreado(creado.toLocalDateTime());
        }
        Timestamp actualizado = rs.getTimestamp("ACTUALIZADO");
        if (actualizado != null) {
            tarea.setActualizado(actualizado.toLocalDateTime());
        }
        return tarea;
    }
}
