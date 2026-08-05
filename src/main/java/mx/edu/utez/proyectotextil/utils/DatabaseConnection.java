package mx.edu.utez.proyectotextil.utils;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

public class DatabaseConnection {

    // =========================================================================
    // CONFIGURACIÓN DE BASE DE DATOS ORACLE CLOUD (CON WALLET)
    // =========================================================================
    
    // 1. Descomprime tu archivo Wallet (.zip) en una carpeta de tu computadora.
    // 2. Escribe la ruta absoluta hacia esa carpeta descomprimida aquí:
    // EJEMPLO: "C:\\Users\\marco\\Desktop\\Wallet_BD"
    private static final String WALLET_PATH = "C:\\Users\\marco\\Desktop\\ProyectoTextil\\src\\main\\java\\mx\\edu\\utez\\proyectotextil\\Wallet_F6MYNQSB13ZDQWEJ";
    
    // 3. Escribe el alias de red de tu base de datos (se encuentra en el archivo tnsnames.ora dentro del Wallet)
    // Usualmente tiene el formato: nombrebd_high, nombrebd_medium, nombrebd_low
    private static final String TNS_ALIAS = "f6mynqsb13zdqwej_high";
    
    // Credenciales proporcionadas
    private static final String DB_USER = "ADMIN";
    private static final String DB_PASS = "mX4@zQ8p!bF3$tW9*vN5#pL2";

    public static Connection getConnection() throws SQLException {
        Connection conn = null;
        try {
            // Cargar el driver de Oracle
            Class.forName("oracle.jdbc.OracleDriver");
            
            // Construir la URL de conexión usando el TNS_ADMIN
            String url = "jdbc:oracle:thin:@" + TNS_ALIAS + "?TNS_ADMIN=" + WALLET_PATH;
            
            Properties props = new Properties();
            props.put("user", DB_USER);
            props.put("password", DB_PASS);
            // Configurar la propiedad de seguridad del Wallet por si la URL no es suficiente
            props.put("oracle.net.wallet_location", "(SOURCE=(METHOD=file)(METHOD_DATA=(DIRECTORY=" + WALLET_PATH + ")))");
            
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
}
