# HiloNet - Sistema de Gestión Textil

Aplicación web para gestión de procesos en la industria textil, desarrollada en Java con Jakarta Servlet/JSP.

## Requisitos

- **Java**: 11 o superior (actualmente usando Java 21)
- **Maven**: Incluido en el wrapper (`mvnw.cmd`)

## Construcción

### Opción 1: Script de construcción (Recomendado)
```bash
.\build.cmd
```

### Opción 2: Maven directo
```bash
mvnw.cmd clean package -DskipTests
```

El archivo WAR se generará en: `target/ProyectoTextil-1.0-SNAPSHOT.war`

## Estructura del Proyecto

```
src/main/
├── java/
│   └── mx/edu/utez/proyectotextil/
│       ├── controllers/          # Controladores servlet
│       │   ├── AuthController.java
│       │   ├── AdminController.java
│       │   └── TrabajadorController.java
│       └── models/               # Modelos de datos
└── webapp/
    ├── WEB-INF/
    │   ├── views/               # Vistas JSP
    │   └── web.xml             # Configuración deployment
    └── recursos/               # Recursos estáticos
        ├── js/                 # JavaScript (núcleo y páginas)
        └── css/                # Hojas de estilo
```

## Módulos Principales

### Autenticación (`AuthController`)
- Login/Logout
- Recuperación de contraseña
- Gestión de sesiones

### Gestión de Trabajadores (`TrabajadorController`)
- Vistas de pedidos
- Incidencias
- Perfil de trabajador

### Administración (`AdminController`)
- Usuarios
- Áreas
- Pedidos
- Incidencias
- Soporte

## Tecnologías

- **Backend**: Jakarta Servlet 6.1, JSP 3.0, JSTL 3.0
- **Frontend**: HTML5, CSS3, JavaScript vanilla
- **Build**: Apache Maven 3.9+
- **Testing**: JUnit 5
- **Logging**: SLF4J + Logback

## Desarrollo

### Compilar sin tests
```bash
mvnw.cmd clean package -DskipTests
```

### Ejecutar con Tomcat (Maven plugin)
```bash
mvnw.cmd tomcat7:run
```

Accede a: `http://localhost:8080`

## Limpieza

Para limpiar archivos generados:
```bash
mvnw.cmd clean
```

## Notas

- Todos los archivos duplicados han sido eliminados
- Archivos obsoletos (HelloServlet.java, HTML estáticos) se removieron
- Java actualizado a versión 11 mínimo (compatible con Jakarta)
- Configuración Maven mejorada con plugins modernos
