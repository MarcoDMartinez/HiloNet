package mx.edu.utez.proyectotextil.dao;

import mx.edu.utez.proyectotextil.models.Area;
import mx.edu.utez.proyectotextil.utils.DatabaseConnection;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class AreaDao {

    private static final String TABLE = DatabaseConnection.qualifiedName("AREAS");

    public List<Area> getAllAreas() {
        ensureTableExists();
        List<Area> areas = new ArrayList<>();
        String sql = "SELECT ID_AREA, AREA_NOMBRE FROM " + TABLE + " ORDER BY ID_AREA";

        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
               areas.add(mapArea(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return areas;
    }

    public Area getAreaById(int idArea) {
        ensureTableExists();
        String sql = "SELECT ID_AREA, AREA_NOMBRE FROM " + TABLE + " WHERE ID_AREA = ?";

        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, idArea);

            try (ResultSet rs = ps.executeQuery()) {
               if (rs.next()) {
                   return mapArea(rs);
               }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public Area getAreaByName(String nombre) {
        ensureTableExists();
        String sql = "SELECT ID_AREA, AREA_NOMBRE FROM " + TABLE + " WHERE UPPER(AREA_NOMBRE) = UPPER(?)";

        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, nombre);

            try (ResultSet rs = ps.executeQuery()) {
               if (rs.next()) {
                   return mapArea(rs);
               }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public Area createArea(Area area) {
        ensureTableExists();
        String sql = "INSERT INTO " + TABLE + " (AREA_NOMBRE) VALUES (?)";

        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, area.getNombre());

            if (ps.executeUpdate() == 1) {
               int generatedId = getLastGeneratedId(con, "ID_AREA");
               area.setIdArea(generatedId);
               area.setAreaNombre(area.getNombre());
               area.setActiva(true);
               return area;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public boolean updateArea(int idArea, Area area) {
        ensureTableExists();
        String sql = "UPDATE " + TABLE + " SET AREA_NOMBRE = ? WHERE ID_AREA = ?";

        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, area.getNombre());
            ps.setInt(2, idArea);
            return ps.executeUpdate() == 1;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean deleteArea(int idArea) {
        ensureTableExists();
        String sql = "DELETE FROM " + TABLE + " WHERE ID_AREA = ?";

        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, idArea);
            return ps.executeUpdate() == 1;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    private void ensureTableExists() {
        String checkSql = "SELECT COUNT(*) FROM ALL_TABLES WHERE OWNER = '" + DatabaseConnection.getSchema() + "' AND TABLE_NAME = 'AREAS'";
        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(checkSql);
             ResultSet rs = ps.executeQuery()) {
            if (rs.next() && rs.getInt(1) == 0) {
               String createSql = "CREATE TABLE " + TABLE + " ("
                       + "ID_AREA NUMBER GENERATED AS IDENTITY PRIMARY KEY, "
                       + "AREA_NOMBRE VARCHAR2(50) NOT NULL)";
               try (PreparedStatement createPs = con.prepareStatement(createSql)) {
                   createPs.executeUpdate();
               }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private int getLastGeneratedId(Connection con, String columnName) throws SQLException {
        String sql = "SELECT MAX(" + columnName + ") AS LAST_ID FROM " + TABLE;
        try (PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            if (rs.next()) {
               return rs.getInt("LAST_ID");
            }
        }
        return 0;
    }

    private Area mapArea(ResultSet rs) throws SQLException {
        Area area = new Area();
        area.setIdArea(rs.getInt("ID_AREA"));
        area.setAreaNombre(rs.getString("AREA_NOMBRE"));
        area.setNombre(rs.getString("AREA_NOMBRE"));
        return area;
    }
}
