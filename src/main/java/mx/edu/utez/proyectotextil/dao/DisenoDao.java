package mx.edu.utez.proyectotextil.dao;

import mx.edu.utez.proyectotextil.models.Diseno;
import mx.edu.utez.proyectotextil.utils.DatabaseConnection;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class DisenoDao {
    private static final String TABLE = DatabaseConnection.qualifiedName("DISENO");

    public List<Diseno> getAll() {
        ensureTableExists();
        String sql = "SELECT ID_DISENO, DISENO_NOMBRE, IMAGEN, CATEGORIA, FECHA, STATUS, ID_PEDIDOS FROM " + TABLE + " ORDER BY FECHA DESC";
        List<Diseno> diseños = new ArrayList<>();
        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                diseños.add(mapDiseno(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return diseños;
    }

    public Diseno create(Diseno diseno) {
        ensureTableExists();
        String sql = "INSERT INTO " + TABLE + " (DISENO_NOMBRE, IMAGEN, CATEGORIA, FECHA, STATUS, ID_PEDIDOS) VALUES (?, ?, ?, ?, ?, ?)";
        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            LocalDateTime now = LocalDateTime.now();
            ps.setString(1, diseno.getDisenoNombre());
            ps.setString(2, diseno.getImagen());
            ps.setString(3, diseno.getCategoria());
            ps.setTimestamp(4, Timestamp.valueOf(now));
            ps.setString(5, diseno.getStatus() != null ? diseno.getStatus() : "EN_ESPERA");
            ps.setInt(6, diseno.getIdPedidos());
            if (ps.executeUpdate() == 1) {
                diseno.setFecha(now);
                return diseno;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    private void ensureTableExists() {
        String checkSql = "SELECT COUNT(*) FROM ALL_TABLES WHERE OWNER = '" + DatabaseConnection.getSchema() + "' AND TABLE_NAME = 'DISENO'";
        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(checkSql);
             ResultSet rs = ps.executeQuery()) {
            if (rs.next() && rs.getInt(1) == 0) {
                String createSql = "CREATE TABLE " + TABLE + " (ID_DISENO NUMBER GENERATED AS IDENTITY PRIMARY KEY, DISENO_NOMBRE VARCHAR2(100) NOT NULL, IMAGEN VARCHAR2(2083) NOT NULL, CATEGORIA VARCHAR2(50), FECHA TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL, STATUS VARCHAR2(20) DEFAULT 'EN_ESPERA' NOT NULL CHECK (STATUS IN ('EN_ESPERA', 'EN_PROCESO', 'FINALIZADO')), ID_PEDIDOS NUMBER NOT NULL REFERENCES " + DatabaseConnection.qualifiedName("PEDIDOS") + ")";
                try (PreparedStatement createPs = con.prepareStatement(createSql)) {
                    createPs.executeUpdate();
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private Diseno mapDiseno(ResultSet rs) throws SQLException {
        Diseno diseno = new Diseno();
        diseno.setIdDiseno(rs.getInt("ID_DISENO"));
        diseno.setDisenoNombre(rs.getString("DISENO_NOMBRE"));
        diseno.setImagen(rs.getString("IMAGEN"));
        diseno.setCategoria(rs.getString("CATEGORIA"));
        Timestamp fecha = rs.getTimestamp("FECHA");
        if (fecha != null) {
            diseno.setFecha(fecha.toLocalDateTime());
        }
        diseno.setStatus(rs.getString("STATUS"));
        diseno.setIdPedidos(rs.getInt("ID_PEDIDOS"));
        return diseno;
    }
}
