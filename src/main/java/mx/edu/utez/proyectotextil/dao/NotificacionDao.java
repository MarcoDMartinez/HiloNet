package mx.edu.utez.proyectotextil.dao;

import mx.edu.utez.proyectotextil.models.Notificacion;
import mx.edu.utez.proyectotextil.utils.DatabaseConnection;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class NotificacionDao {
    private static final String TABLE = DatabaseConnection.qualifiedName("NOTIFICACION");

    public List<Notificacion> getAll() {
        ensureTableExists();
        String sql = "SELECT ID_NOTIFICACIONES, MENSAJE, FECHA_NOTIFICACION, LEIDO, ID_USUARIOS FROM " + TABLE + " ORDER BY FECHA_NOTIFICACION DESC";
        List<Notificacion> notificaciones = new ArrayList<>();
        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                notificaciones.add(mapNotificacion(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return notificaciones;
    }

    public Notificacion create(Notificacion notificacion) {
        ensureTableExists();
        String sql = "INSERT INTO " + TABLE + " (MENSAJE, FECHA_NOTIFICACION, LEIDO, ID_USUARIOS) VALUES (?, ?, ?, ?)";
        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            LocalDateTime now = LocalDateTime.now();
            ps.setString(1, notificacion.getMensaje());
            ps.setTimestamp(2, Timestamp.valueOf(now));
            ps.setInt(3, notificacion.isLeido() ? 1 : 0);
            ps.setInt(4, notificacion.getIdUsuarios());
            if (ps.executeUpdate() == 1) {
                notificacion.setFechaNotificacion(now);
                return notificacion;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public boolean markAsRead(int idNotificaciones) {
        ensureTableExists();
        String sql = "UPDATE " + TABLE + " SET LEIDO = 1 WHERE ID_NOTIFICACIONES = ?";
        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, idNotificaciones);
            return ps.executeUpdate() == 1;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    private void ensureTableExists() {
        String checkSql = "SELECT COUNT(*) FROM ALL_TABLES WHERE OWNER = '" + DatabaseConnection.getSchema() + "' AND TABLE_NAME = 'NOTIFICACION'";
        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(checkSql);
             ResultSet rs = ps.executeQuery()) {
            if (rs.next() && rs.getInt(1) == 0) {
                String createSql = "CREATE TABLE " + TABLE + " (ID_NOTIFICACIONES NUMBER GENERATED AS IDENTITY PRIMARY KEY, MENSAJE VARCHAR2(255) NOT NULL, FECHA_NOTIFICACION TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL, LEIDO NUMBER(1) DEFAULT 0 NOT NULL CHECK (LEIDO IN (0, 1)), ID_USUARIOS NUMBER NOT NULL REFERENCES " + DatabaseConnection.qualifiedName("USUARIOS") + ")";
                try (PreparedStatement createPs = con.prepareStatement(createSql)) {
                    createPs.executeUpdate();
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private Notificacion mapNotificacion(ResultSet rs) throws SQLException {
        Notificacion n = new Notificacion();
        n.setIdNotificaciones(rs.getInt("ID_NOTIFICACIONES"));
        n.setMensaje(rs.getString("MENSAJE"));
        Timestamp fecha = rs.getTimestamp("FECHA_NOTIFICACION");
        if (fecha != null) {
            n.setFechaNotificacion(fecha.toLocalDateTime());
        }
        n.setLeido(rs.getInt("LEIDO") == 1);
        n.setIdUsuarios(rs.getInt("ID_USUARIOS"));
        return n;
    }
}
