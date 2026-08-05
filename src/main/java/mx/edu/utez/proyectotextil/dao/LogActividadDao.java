package mx.edu.utez.proyectotextil.dao;

import mx.edu.utez.proyectotextil.models.LogActividad;
import mx.edu.utez.proyectotextil.utils.DatabaseConnection;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class LogActividadDao {
    private static final String TABLE = DatabaseConnection.qualifiedName("LOG_ACTIVIDADES");

    public List<LogActividad> getAll() {
        ensureTableExists();
        String sql = "SELECT ID_LOG, ACCION_REALIZADA, FECHA_HORA, ID_USUARIOS FROM " + TABLE + " ORDER BY FECHA_HORA DESC";
        List<LogActividad> logs = new ArrayList<>();
        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                logs.add(mapLog(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return logs;
    }

    public LogActividad create(LogActividad log) {
        ensureTableExists();
        String sql = "INSERT INTO " + TABLE + " (ACCION_REALIZADA, FECHA_HORA, ID_USUARIOS) VALUES (?, ?, ?)";
        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            LocalDateTime now = LocalDateTime.now();
            ps.setString(1, log.getAccionRealizada());
            ps.setTimestamp(2, Timestamp.valueOf(now));
            ps.setInt(3, log.getIdUsuarios());
            if (ps.executeUpdate() == 1) {
                log.setFechaHora(now);
                return log;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    private void ensureTableExists() {
        String checkSql = "SELECT COUNT(*) FROM ALL_TABLES WHERE OWNER = '" + DatabaseConnection.getSchema() + "' AND TABLE_NAME = 'LOG_ACTIVIDADES'";
        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(checkSql);
             ResultSet rs = ps.executeQuery()) {
            if (rs.next() && rs.getInt(1) == 0) {
                String createSql = "CREATE TABLE " + TABLE + " (ID_LOG NUMBER GENERATED AS IDENTITY PRIMARY KEY, ACCION_REALIZADA VARCHAR2(255) NOT NULL, FECHA_HORA TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL, ID_USUARIOS NUMBER NOT NULL REFERENCES " + DatabaseConnection.qualifiedName("USUARIOS") + ")";
                try (PreparedStatement createPs = con.prepareStatement(createSql)) {
                    createPs.executeUpdate();
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private LogActividad mapLog(ResultSet rs) throws SQLException {
        LogActividad log = new LogActividad();
        log.setIdLog(rs.getInt("ID_LOG"));
        log.setAccionRealizada(rs.getString("ACCION_REALIZADA"));
        Timestamp fecha = rs.getTimestamp("FECHA_HORA");
        if (fecha != null) {
            log.setFechaHora(fecha.toLocalDateTime());
        }
        log.setIdUsuarios(rs.getInt("ID_USUARIOS"));
        return log;
    }
}
