package mx.edu.utez.proyectotextil.dao;

import mx.edu.utez.proyectotextil.models.Usuario;
import mx.edu.utez.proyectotextil.utils.DatabaseConnection;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.List;

public class UsuarioDao {

    private static final String USUARIOS_TABLE = DatabaseConnection.qualifiedName("USUARIOS");
    private static final String ROLES_TABLE = DatabaseConnection.qualifiedName("ROLES");
    private static final String AREAS_TABLE = DatabaseConnection.qualifiedName("AREAS");
    private static final String CREDENCIALES_TABLE = DatabaseConnection.qualifiedName("CREDENCIALES_USUARIO");

    private static final String DEFAULT_ADMIN_PHONE = "9999999999";
    private static final String DEFAULT_ADMIN_PASSWORD = "Admin123!";
    private static final String DEFAULT_ADMIN_ROLE = "ADMIN";
    private static final String DEFAULT_ADMIN_NAME = "Administrador";
    private static final String DEFAULT_ADMIN_LAST_NAME = "Principal";
    private static final String DEFAULT_ADMIN_MOTHER_LAST_NAME = "Sistema";
    private static final String DEFAULT_AREA_NAME = "Diseño";

    public void ensureDefaultAdminExists() {
        ensureTablesExist();

        Integer roleId = getOrCreateRole(DEFAULT_ADMIN_ROLE);
        Integer areaId = getOrCreateArea(DEFAULT_AREA_NAME);
        Integer userId = getUserIdByPhone(DEFAULT_ADMIN_PHONE);

        if (userId == null) {
            Usuario admin = new Usuario();
            admin.setNumeroTelefono(DEFAULT_ADMIN_PHONE);
            admin.setNombre(DEFAULT_ADMIN_NAME);
            admin.setApellidoP(DEFAULT_ADMIN_LAST_NAME);
            admin.setApellidoM(DEFAULT_ADMIN_MOTHER_LAST_NAME);
            admin.setStatus("ACTIVO");
            admin.setIdRol(roleId);
            if (areaId != null) {
                admin.setIdArea(areaId);
            }
            crearUsuario(admin, DEFAULT_ADMIN_PASSWORD);
            return;
        }

        ensureUserDefaults(userId, roleId, areaId);
        upsertCredential(userId, DEFAULT_ADMIN_PASSWORD);
    }

    public List<Usuario> getAllActiveUsers() {
        ensureTablesExist();
        String sql = "SELECT U.ID_USUARIOS, U.NUMERO_TELEFONO, U.NOMBRE, U.APELLIDO_P, U.APELLIDO_M, U.STATUS, U.ID_ROL, U.ID_AREA, R.ROL_NOMBRE, A.AREA_NOMBRE " +
               "FROM " + USUARIOS_TABLE + " U " +
               "JOIN " + ROLES_TABLE + " R ON U.ID_ROL = R.ID_ROL " +
               "LEFT JOIN " + AREAS_TABLE + " A ON U.ID_AREA = A.ID_AREA " +
               "WHERE U.STATUS = 'ACTIVO' ORDER BY U.NOMBRE";
        List<Usuario> usuarios = new ArrayList<>();

        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
               usuarios.add(mapUsuario(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return usuarios;
    }

    public Usuario login(String numeroTelefono, String passwordInput) {
        ensureTablesExist();
        String sql = "SELECT U.ID_USUARIOS, U.NUMERO_TELEFONO, U.NOMBRE, U.APELLIDO_P, U.APELLIDO_M, U.STATUS, U.ID_ROL, U.ID_AREA, R.ROL_NOMBRE, A.AREA_NOMBRE " +
               "FROM " + USUARIOS_TABLE + " U " +
               "JOIN " + CREDENCIALES_TABLE + " C ON U.ID_USUARIOS = C.ID_USUARIOS " +
               "JOIN " + ROLES_TABLE + " R ON U.ID_ROL = R.ID_ROL " +
               "LEFT JOIN " + AREAS_TABLE + " A ON U.ID_AREA = A.ID_AREA " +
               "WHERE U.NUMERO_TELEFONO = ? AND C.HASH_PASSWORD = ? AND U.STATUS = 'ACTIVO'";

        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, numeroTelefono);
            ps.setString(2, passwordInput);

            try (ResultSet rs = ps.executeQuery()) {
               if (rs.next()) {
                   return mapUsuario(rs);
               }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public Usuario findByNumeroTelefono(String numeroTelefono) {
        ensureTablesExist();
        String sql = "SELECT U.ID_USUARIOS, U.NUMERO_TELEFONO, U.NOMBRE, U.APELLIDO_P, U.APELLIDO_M, U.STATUS, U.ID_ROL, U.ID_AREA, R.ROL_NOMBRE, A.AREA_NOMBRE " +
               "FROM " + USUARIOS_TABLE + " U " +
               "JOIN " + ROLES_TABLE + " R ON U.ID_ROL = R.ID_ROL " +
               "LEFT JOIN " + AREAS_TABLE + " A ON U.ID_AREA = A.ID_AREA " +
               "WHERE U.NUMERO_TELEFONO = ? AND U.STATUS = 'ACTIVO'";

        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, numeroTelefono);

            try (ResultSet rs = ps.executeQuery()) {
               if (rs.next()) {
                   return mapUsuario(rs);
               }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public boolean actualizarPassword(String numeroTelefono, String passwordActual, String passwordNueva) {
        ensureTablesExist();
        String selectSql = "SELECT C.ID_USUARIOS, C.HASH_PASSWORD " +
               "FROM " + USUARIOS_TABLE + " U " +
               "JOIN " + CREDENCIALES_TABLE + " C ON U.ID_USUARIOS = C.ID_USUARIOS " +
               "WHERE U.NUMERO_TELEFONO = ? AND U.STATUS = 'ACTIVO'";

        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(selectSql)) {
            ps.setString(1, numeroTelefono);

            try (ResultSet rs = ps.executeQuery()) {
               if (rs.next() && passwordActual.equals(rs.getString("HASH_PASSWORD"))) {
                   String updateSql = "UPDATE " + CREDENCIALES_TABLE + " " +
                           "SET HASH_PASSWORD = ?, FECHA_CAMBIO = SYSTIMESTAMP, INTENTOS_FALLIDOS = 0 " +
                           "WHERE ID_USUARIOS = ?";

                   try (PreparedStatement updatePs = con.prepareStatement(updateSql)) {
                       updatePs.setString(1, passwordNueva);
                       updatePs.setInt(2, rs.getInt("ID_USUARIOS"));
                       return updatePs.executeUpdate() == 1;
                   }
               }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public Usuario crearUsuario(Usuario usuario, String password) {
        ensureTablesExist();
        String insertUsuarioSql = "INSERT INTO " + USUARIOS_TABLE + " (NUMERO_TELEFONO, NOMBRE, APELLIDO_P, APELLIDO_M, STATUS, ID_ROL, ID_AREA) VALUES (?, ?, ?, ?, ?, ?, ?)";
        String insertCredentialSql = "INSERT INTO " + CREDENCIALES_TABLE + " (ID_USUARIOS, HASH_PASSWORD, FECHA_CAMBIO, INTENTOS_FALLIDOS) VALUES (?, ?, SYSTIMESTAMP, 0)";

        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(insertUsuarioSql)) {
            ps.setString(1, usuario.getNumeroTelefono());
            ps.setString(2, usuario.getNombre());
            ps.setString(3, usuario.getApellidoP());
            ps.setString(4, usuario.getApellidoM());
            ps.setString(5, usuario.getStatus() != null ? usuario.getStatus() : "ACTIVO");
            ps.setInt(6, usuario.getIdRol());
            if (usuario.getIdArea() != null) {
               ps.setInt(7, usuario.getIdArea());
            } else {
               ps.setNull(7, Types.INTEGER);
            }

            if (ps.executeUpdate() == 1) {
               int generatedId = getLastGeneratedId(con, USUARIOS_TABLE, "ID_USUARIOS");
               try (PreparedStatement credentialPs = con.prepareStatement(insertCredentialSql)) {
                   credentialPs.setInt(1, generatedId);
                   credentialPs.setString(2, password);
                   if (credentialPs.executeUpdate() == 1) {
                       usuario.setIdUsuarios(generatedId);
                       return usuario;
                   }
               }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    private void ensureTablesExist() {
        try (Connection con = DatabaseConnection.getConnection()) {
            ensureTableExists(con, "ROLES", "CREATE TABLE " + ROLES_TABLE + " (ID_ROL NUMBER GENERATED AS IDENTITY PRIMARY KEY, ROL_NOMBRE VARCHAR2(50) NOT NULL)");
            ensureTableExists(con, "AREAS", "CREATE TABLE " + AREAS_TABLE + " (ID_AREA NUMBER GENERATED AS IDENTITY PRIMARY KEY, AREA_NOMBRE VARCHAR2(50) NOT NULL)");
            ensureTableExists(con, "USUARIOS", "CREATE TABLE " + USUARIOS_TABLE + " (ID_USUARIOS NUMBER GENERATED AS IDENTITY PRIMARY KEY, NUMERO_TELEFONO VARCHAR2(15) NOT NULL UNIQUE, NOMBRE VARCHAR2(100) NOT NULL, APELLIDO_P VARCHAR2(100) NOT NULL, APELLIDO_M VARCHAR2(100), STATUS VARCHAR2(20) DEFAULT 'ACTIVO' NOT NULL CHECK (STATUS IN ('ACTIVO', 'INACTIVO', 'SUSPENDIDO')), ID_ROL NUMBER NOT NULL REFERENCES " + ROLES_TABLE + ", ID_AREA NUMBER REFERENCES " + AREAS_TABLE + ")");
            ensureTableExists(con, "CREDENCIALES_USUARIO", "CREATE TABLE " + CREDENCIALES_TABLE + " (ID_USUARIOS NUMBER PRIMARY KEY REFERENCES " + USUARIOS_TABLE + ", HASH_PASSWORD VARCHAR2(255) NOT NULL, FECHA_CAMBIO TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL, INTENTOS_FALLIDOS NUMBER DEFAULT 0 NOT NULL)");
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private Integer getOrCreateRole(String roleName) {
        String selectSql = "SELECT ID_ROL FROM " + ROLES_TABLE + " WHERE UPPER(ROL_NOMBRE) = UPPER(?)";
        String insertSql = "INSERT INTO " + ROLES_TABLE + " (ROL_NOMBRE) VALUES (?)";

        try (Connection con = DatabaseConnection.getConnection()) {
            try (PreparedStatement ps = con.prepareStatement(selectSql)) {
                ps.setString(1, roleName);
                try (ResultSet rs = ps.executeQuery()) {
                    if (rs.next()) {
                        return rs.getInt("ID_ROL");
                    }
                }
            }

            try (PreparedStatement ps = con.prepareStatement(insertSql)) {
                ps.setString(1, roleName);
                if (ps.executeUpdate() == 1) {
                    return getLastGeneratedId(con, ROLES_TABLE, "ID_ROL");
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    private Integer getOrCreateArea(String areaName) {
        String selectSql = "SELECT ID_AREA FROM " + AREAS_TABLE + " WHERE UPPER(AREA_NOMBRE) = UPPER(?)";
        String insertSql = "INSERT INTO " + AREAS_TABLE + " (AREA_NOMBRE) VALUES (?)";

        try (Connection con = DatabaseConnection.getConnection()) {
            try (PreparedStatement ps = con.prepareStatement(selectSql)) {
                ps.setString(1, areaName);
                try (ResultSet rs = ps.executeQuery()) {
                    if (rs.next()) {
                        return rs.getInt("ID_AREA");
                    }
                }
            }

            try (PreparedStatement ps = con.prepareStatement(insertSql)) {
                ps.setString(1, areaName);
                if (ps.executeUpdate() == 1) {
                    return getLastGeneratedId(con, AREAS_TABLE, "ID_AREA");
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    private Integer getUserIdByPhone(String phone) {
        String sql = "SELECT ID_USUARIOS FROM " + USUARIOS_TABLE + " WHERE NUMERO_TELEFONO = ?";
        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, phone);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt("ID_USUARIOS");
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    private void ensureUserDefaults(int userId, Integer roleId, Integer areaId) {
        String sql = "UPDATE " + USUARIOS_TABLE + " SET STATUS = 'ACTIVO', ID_ROL = ?, ID_AREA = ? WHERE ID_USUARIOS = ?";
        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, roleId != null ? roleId : 1);
            if (areaId != null) {
                ps.setInt(2, areaId);
            } else {
                ps.setNull(2, Types.INTEGER);
            }
            ps.setInt(3, userId);
            ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private void upsertCredential(int userId, String password) {
        String existsSql = "SELECT COUNT(*) AS TOTAL FROM " + CREDENCIALES_TABLE + " WHERE ID_USUARIOS = ?";
        String insertSql = "INSERT INTO " + CREDENCIALES_TABLE + " (ID_USUARIOS, HASH_PASSWORD, FECHA_CAMBIO, INTENTOS_FALLIDOS) VALUES (?, ?, SYSTIMESTAMP, 0)";
        String updateSql = "UPDATE " + CREDENCIALES_TABLE + " SET HASH_PASSWORD = ?, FECHA_CAMBIO = SYSTIMESTAMP, INTENTOS_FALLIDOS = 0 WHERE ID_USUARIOS = ?";

        try (Connection con = DatabaseConnection.getConnection()) {
            try (PreparedStatement ps = con.prepareStatement(existsSql)) {
                ps.setInt(1, userId);
                try (ResultSet rs = ps.executeQuery()) {
                    if (rs.next() && rs.getInt("TOTAL") > 0) {
                        try (PreparedStatement updatePs = con.prepareStatement(updateSql)) {
                            updatePs.setString(1, password);
                            updatePs.setInt(2, userId);
                            updatePs.executeUpdate();
                        }
                        return;
                    }
                }
            }

            try (PreparedStatement insertPs = con.prepareStatement(insertSql)) {
                insertPs.setInt(1, userId);
                insertPs.setString(2, password);
                insertPs.executeUpdate();
            }
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

    private int getLastGeneratedId(Connection con, String tableName, String columnName) throws SQLException {
        String sql = "SELECT MAX(" + columnName + ") AS LAST_ID FROM " + tableName;
        try (PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            if (rs.next()) {
                return rs.getInt("LAST_ID");
            }
        }
        return 0;
    }

    private Usuario mapUsuario(ResultSet rs) throws SQLException {
        Usuario usuario = new Usuario();
        usuario.setIdUsuarios(rs.getInt("ID_USUARIOS"));
        usuario.setNumeroTelefono(rs.getString("NUMERO_TELEFONO"));
        usuario.setNombre(rs.getString("NOMBRE"));
        usuario.setApellidoP(rs.getString("APELLIDO_P"));
        usuario.setApellidoM(rs.getString("APELLIDO_M"));
        usuario.setStatus(rs.getString("STATUS"));
        usuario.setIdRol(rs.getInt("ID_ROL"));
        usuario.setRolNombre(rs.getString("ROL_NOMBRE"));

        int idArea = rs.getInt("ID_AREA");
        if (!rs.wasNull()) {
            usuario.setIdArea(idArea);
            usuario.setAreaNombre(rs.getString("AREA_NOMBRE"));
        }
        return usuario;
    }
}
