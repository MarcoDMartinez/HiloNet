# Pasos Inmediatos - Integración Base de Datos

Después de la refactorización completada, estos son los pasos para conectar a base de datos.

## Fase 1: Preparar la Base de Datos

### 1. Crear Base de Datos

```sql
-- MySQL
CREATE DATABASE hilonet DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hilonet;

-- Crear tablas
CREATE TABLE usuarios (
    id VARCHAR(20) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    area_id VARCHAR(20),
    rol ENUM('ADMIN', 'EMPLEADO') NOT NULL,
    activo BOOLEAN DEFAULT true,
    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE areas (
    id VARCHAR(20) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    responsable VARCHAR(100),
    empleados INT DEFAULT 0,
    activa BOOLEAN DEFAULT true,
    color VARCHAR(7),
    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE pedidos (
    id VARCHAR(20) PRIMARY KEY,
    cliente VARCHAR(100) NOT NULL,
    descripcion TEXT,
    areas VARCHAR(255),
    fecha DATE,
    estado ENUM('Pendiente', 'En producción', 'Entregado') NOT NULL,
    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE incidencias (
    id VARCHAR(20) PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    area_id VARCHAR(20),
    prioridad ENUM('Baja', 'Media', 'Alta') NOT NULL,
    estado ENUM('Abierta', 'En progreso', 'Resuelta') NOT NULL,
    pedido_id VARCHAR(20),
    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (area_id) REFERENCES areas(id),
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
);

CREATE TABLE tareas (
    id VARCHAR(20) PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    area_id VARCHAR(20),
    pedido_id VARCHAR(20),
    asignado_a VARCHAR(50),
    estado ENUM('Pendiente', 'En progreso', 'Completada') DEFAULT 'Pendiente',
    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (area_id) REFERENCES areas(id),
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
);

-- Datos iniciales
INSERT INTO areas VALUES
    ('A-01', 'Diseño', 'Marco D.', 6, true, '#5a7a4a', NOW(), NOW()),
    ('A-02', 'Corte', 'Lander B.', 8, true, '#4a6fa5', NOW(), NOW()),
    ('A-03', 'Costura', 'Merari N.', 7, true, '#7a5c44', NOW(), NOW());

-- Contraseña hasheada (usar BCrypt en aplicación)
INSERT INTO usuarios VALUES
    ('A-001', 'Admin General', 'admin', 'HASH_AQUI', NULL, 'ADMIN', true, NOW(), NOW()),
    ('E-014', 'Lander Bautista', 'lander', 'HASH_AQUI', 'A-02', 'EMPLEADO', true, NOW(), NOW()),
    ('E-009', 'Merari Núñez', 'merari', 'HASH_AQUI', 'A-03', 'EMPLEADO', true, NOW(), NOW()),
    ('E-003', 'Marco Díaz', 'marcod', 'HASH_AQUI', 'A-01', 'EMPLEADO', true, NOW(), NOW());
```

## Fase 2: Agregar Dependencias Maven

```xml
<!-- pom.xml -->

<!-- MySQL Driver -->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.33</version>
</dependency>

<!-- Bcrypt para hashing de contraseñas -->
<dependency>
    <groupId>org.mindrot</groupId>
    <artifactId>jbcrypt</artifactId>
    <version>0.4</version>
</dependency>

<!-- Connection Pooling (HikariCP) -->
<dependency>
    <groupId>com.zaxxer</groupId>
    <artifactId>HikariCP</artifactId>
    <version>5.1.0</version>
</dependency>
```

## Fase 3: Crear Capa DAO

```
src/main/java/mx/edu/utez/proyectotextil/
├── dao/
│   ├── ConnectionPool.java
│   ├── UsuarioDAO.java
│   ├── AreaDAO.java
│   ├── PedidoDAO.java
│   ├── IncidenciaDAO.java
│   └── TareaDAO.java
```

### Ejemplo: ConnectionPool.java

```java
package mx.edu.utez.proyectotextil.dao;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import java.sql.Connection;
import java.sql.SQLException;

public class ConnectionPool {
    private static HikariDataSource dataSource;

    static {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:mysql://localhost:3306/hilonet");
        config.setUsername("root");
        config.setPassword("password");
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(5);
        config.setConnectionTimeout(30000);
        config.setIdleTimeout(600000);
        config.setMaxLifetime(1800000);
        
        dataSource = new HikariDataSource(config);
    }

    public static Connection getConnection() throws SQLException {
        return dataSource.getConnection();
    }

    public static void closePool() {
        if (dataSource != null && !dataSource.isClosed()) {
            dataSource.close();
        }
    }
}
```

### Ejemplo: UsuarioDAO.java

```java
package mx.edu.utez.proyectotextil.dao;

import mx.edu.utez.proyectotextil.models.Usuario;
import org.mindrot.jbcrypt.BCrypt;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class UsuarioDAO {
    
    public static Usuario obtenerPorUsername(String username) throws SQLException {
        String sql = "SELECT * FROM usuarios WHERE username = ?";
        try (Connection conn = ConnectionPool.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, username);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    Usuario usuario = new Usuario();
                    usuario.setId(rs.getString("id"));
                    usuario.setNombre(rs.getString("nombre"));
                    usuario.setUsername(rs.getString("username"));
                    usuario.setPassword(rs.getString("password_hash"));
                    usuario.setArea(rs.getString("area_id"));
                    usuario.setRol(rs.getString("rol"));
                    usuario.setActivo(rs.getBoolean("activo"));
                    return usuario;
                }
            }
        }
        return null;
    }

    public static boolean validarContraseña(String username, String password) throws SQLException {
        Usuario usuario = obtenerPorUsername(username);
        if (usuario == null) return false;
        return BCrypt.checkpw(password, usuario.getPassword());
    }

    public static void crear(Usuario usuario) throws SQLException {
        String sql = "INSERT INTO usuarios (id, nombre, username, password_hash, area_id, rol) VALUES (?, ?, ?, ?, ?, ?)";
        try (Connection conn = ConnectionPool.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, usuario.getId());
            stmt.setString(2, usuario.getNombre());
            stmt.setString(3, usuario.getUsername());
            stmt.setString(4, BCrypt.hashpw(usuario.getPassword(), BCrypt.gensalt()));
            stmt.setString(5, usuario.getArea());
            stmt.setString(6, usuario.getRol());
            stmt.executeUpdate();
        }
    }
}
```

## Fase 4: Actualizar Services

```java
// Antes - AuthService.java
public static LoginResult validarCredenciales(String username, String password) {
    String user = username.trim().toLowerCase();
    Usuario usuario = usuariosCache.get(user); // ← ELIMINAR
    
    if (!usuario.getPassword().equals(password)) { // ← CAMBIAR
        return new LoginResult(false, "Contraseña incorrecta", null);
    }
    // ...
}

// Después - AuthService.java
public static LoginResult validarCredenciales(String username, String password) {
    try {
        if (!UsuarioDAO.validarContraseña(username, password)) {
            return new LoginResult(false, "Usuario o contraseña incorrectos", null);
        }
        
        Usuario usuario = UsuarioDAO.obtenerPorUsername(username);
        if (usuario == null || !usuario.isActivo()) {
            return new LoginResult(false, "Usuario inactivo", null);
        }
        
        return new LoginResult(true, "Login exitoso", usuario);
    } catch (SQLException e) {
        return new LoginResult(false, "Error en BD: " + e.getMessage(), null);
    }
}
```

## Fase 5: Configuración

Crear `src/main/resources/database.properties`:

```properties
# Database Configuration
db.url=jdbc:mysql://localhost:3306/hilonet
db.username=root
db.password=your_password
db.pool.size=10
db.pool.min=5
db.connection.timeout=30000
```

## Fase 6: Migración de Código

1. Reemplazar todos los `Cache.get()` con `DAO.obtener()`
2. Reemplazar `Cache.add()` con `DAO.crear()`
3. Reemplazar `Cache.update()` con `DAO.actualizar()`
4. Reemplazar `Cache.delete()` con `DAO.eliminar()`

## Testing

```bash
# Compilar con nuevas dependencias
.\build.cmd

# Ejecutar pruebas
mvnw.cmd test

# Depurar
mvnw.cmd tomcat7:run -DskipTests
```

## Seguridad - Checklist

- ✅ Usar BCrypt para hashing de contraseñas
- ✅ Validar sesión en cada request (filtro/interceptor)
- ✅ Usar prepared statements (inyección SQL)
- ✅ Validar entrada en backend
- ✅ HTTPS en producción
- ✅ CSRF tokens en formularios
- ✅ Rate limiting en login
- ✅ Logging de auditoría

## Próximas Mejoras

1. **Caché**: Redis para sesiones y datos frecuentes
2. **Validación**: Agregar decoradores @Validated
3. **Testing**: Tests unitarios para DAOs
4. **API Security**: OAuth2 / JWT tokens
5. **Monitoring**: Logs centralizados
6. **CI/CD**: GitHub Actions para builds automáticos

---

**Estado:** Listo para conexión a BD
**Tiempo estimado:** 4-6 horas
**Dificultad:** Media
