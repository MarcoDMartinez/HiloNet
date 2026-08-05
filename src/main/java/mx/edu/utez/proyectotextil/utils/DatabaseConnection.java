package mx.edu.utez.proyectotextil.utils;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

public class DatabaseConnection {

    private static final String SCHEMA = "ADMIN";

    // =========================================================================
    // CONFIGURACIÓN DE BASE DE DATOS ORACLE CLOUD (CON WALLET)
    // =========================================================================

    private static final String WALLET_PATH = "C:\\Users\\marco\\Desktop\\ProyectoTextil\\src\\main\\java\\mx\\edu\\utez\\proyectotextil\\Wallet_F6MYNQSB13ZDQWEJ";
    private static final String TNS_ALIAS = "f6mynqsb13zdqwej_high";

    private static final String DB_USER = "ADMIN";
    private static final String DB_PASS = "mX4@zQ8p!bF3$tW9*vN5#pL2";

    public static String getSchema() {
        return SCHEMA;
    }

    public static String qualifiedName(String objectName) {
        return SCHEMA + "." + objectName;
    }

    public static Connection getConnection() throws SQLException {
        Connection conn = null;
        try {
            Class.forName("oracle.jdbc.OracleDriver");

            String walletPath = resolveWalletPath();
            String url = "jdbc:oracle:thin:@" + resolveTnsAlias();

            System.setProperty("oracle.net.tns_admin", walletPath);
            System.setProperty("oracle.net.wallet_location", "(SOURCE=(METHOD=file)(METHOD_DATA=(DIRECTORY=" + walletPath + ")))" );
            System.setProperty("TNS_ADMIN", walletPath);

            Properties props = new Properties();
            props.put("user", resolveDbUser());
            props.put("password", resolveDbPassword());

            conn = DriverManager.getConnection(url, props);
            System.out.println("Conexión a Oracle Cloud exitosa.");

        } catch (ClassNotFoundException e) {
            System.err.println("Error: Driver JDBC de Oracle no encontrado.");
            e.printStackTrace();
        } catch (SQLException e) {
            System.err.println("Error de conexión a la base de datos Oracle:");
            e.printStackTrace();
            throw e;
        }
        return conn;
    }

    private static String resolveWalletPath() {
        String configured = System.getProperty("oracle.net.tns_admin");
        if (configured != null && !configured.isBlank()) {
            return configured;
        }

        String envPath = System.getenv("TNS_ADMIN");
        if (envPath != null && !envPath.isBlank()) {
            return envPath;
        }

        Path fromProjectRoot = Paths.get("src", "main", "java", "mx", "edu", "utez", "proyectotextil", "Wallet_F6MYNQSB13ZDQWEJ");
        if (Files.exists(fromProjectRoot)) {
            return fromProjectRoot.toAbsolutePath().toString();
        }

        return WALLET_PATH;
    }

    private static String resolveTnsAlias() {
        String configured = System.getProperty("oracle.tns.alias");
        return configured != null && !configured.isBlank() ? configured : TNS_ALIAS;
    }

    private static String resolveDbUser() {
        String configured = System.getProperty("oracle.db.user");
        return configured != null && !configured.isBlank() ? configured : DB_USER;
    }

    private static String resolveDbPassword() {
        String configured = System.getProperty("oracle.db.password");
        return configured != null && !configured.isBlank() ? configured : DB_PASS;
    }
}
