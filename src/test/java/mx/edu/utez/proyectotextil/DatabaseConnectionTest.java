package mx.edu.utez.proyectotextil;

import mx.edu.utez.proyectotextil.utils.DatabaseConnection;
import org.junit.jupiter.api.Test;
import java.sql.Connection;
import static org.junit.jupiter.api.Assertions.assertNotNull;

public class DatabaseConnectionTest {

    @Test
    public void testConnection() {
        try {
            Connection conn = DatabaseConnection.getConnection();
            assertNotNull(conn, "La conexión no debería ser nula");
            System.out.println("¡Prueba de conexión exitosa a Oracle Cloud!");
            conn.close();
        } catch (Exception e) {
            e.printStackTrace();
            assertNotNull(null, "Hubo una excepción al conectar: " + e.getMessage());
        }
    }
}
