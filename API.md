# HiloNet API Reference

API REST moderna para gestión integral del taller textil. Todos los endpoints retornan JSON.

## Base URL
```
http://localhost:8080/api
```

---

## 🔐 Autenticación

### POST `/auth/login`
Inicia sesión con credenciales.

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login exitoso",
  "usuario": {
    "id": "A-001",
    "nombre": "Admin General",
    "rol": "ADMIN",
    "area": null
  }
}
```

**Response (401):**
```json
{
  "success": false,
  "message": "Usuario no encontrado"
}
```

### GET `/auth/validate`
Valida sesión actual.

**Response (200):**
```json
{
  "success": true,
  "message": "Sesión válida",
  "usuario": {
    "id": "A-001",
    "nombre": "Admin General",
    "rol": "ADMIN",
    "area": null
  }
}
```

### POST `/auth/logout`
Cierra sesión.

**Response (200):**
```json
{
  "success": true,
  "message": "Sesión cerrada"
}
```

---

## 📋 Áreas

### GET `/areas`
Obtiene todas las áreas activas.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "A-01",
      "nombre": "Diseño",
      "responsable": "Marco D.",
      "empleados": 6,
      "activa": true,
      "color": "#5a7a4a"
    }
  ]
}
```

### GET `/areas/{id}`
Obtiene un área específica.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "A-01",
    "nombre": "Diseño",
    "responsable": "Marco D.",
    "empleados": 6,
    "activa": true,
    "color": "#5a7a4a"
  }
}
```

### POST `/areas`
Crea una nueva área.

**Request:**
```json
{
  "nombre": "Empaque",
  "responsable": "Juan García",
  "empleados": 4,
  "color": "#a24f5d"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Área creada",
  "data": {
    "id": "A-04",
    "nombre": "Empaque",
    "responsable": "Juan García",
    "empleados": 4,
    "activa": true,
    "color": "#a24f5d"
  }
}
```

### PUT `/areas/{id}`
Actualiza un área.

**Request:**
```json
{
  "nombre": "Diseño Avanzado",
  "responsable": "Marco D.",
  "empleados": 8
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Área actualizada",
  "data": {
    "id": "A-01",
    "nombre": "Diseño Avanzado",
    "responsable": "Marco D.",
    "empleados": 8,
    "activa": true,
    "color": "#5a7a4a"
  }
}
```

### DELETE `/areas/{id}`
Desactiva un área.

**Response (200):**
```json
{
  "success": true,
  "message": "Área desactivada"
}
```

---

## 📦 Pedidos

### GET `/pedidos`
Obtiene todos los pedidos.

**Parámetros Query:**
- `estado=En producción` - Filtrar por estado

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "P-0023",
      "cliente": "Confecciones Morelos",
      "descripcion": "20 camisetas polo bordadas",
      "areas": "Diseño, Costura",
      "fecha": "2026-06-15T00:00:00",
      "estado": "En producción"
    }
  ]
}
```

### GET `/pedidos/{id}`
Obtiene un pedido específico.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "P-0023",
    "cliente": "Confecciones Morelos",
    "descripcion": "20 camisetas polo bordadas",
    "areas": "Diseño, Costura",
    "fecha": "2026-06-15T00:00:00",
    "estado": "En producción"
  }
}
```

### POST `/pedidos`
Crea un nuevo pedido.

**Request:**
```json
{
  "cliente": "Cliente Nuevo",
  "descripcion": "Descripción del pedido",
  "areas": "Corte, Costura"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Pedido creado",
  "data": {
    "id": "P-0024",
    "cliente": "Cliente Nuevo",
    "descripcion": "Descripción del pedido",
    "areas": "Corte, Costura",
    "fecha": "2026-08-04T14:30:00",
    "estado": "Pendiente"
  }
}
```

### PUT `/pedidos/{id}`
Actualiza el estado de un pedido.

**Request:**
```json
{
  "estado": "Entregado"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Pedido actualizado",
  "data": {
    "id": "P-0023",
    "cliente": "Confecciones Morelos",
    "descripcion": "20 camisetas polo bordadas",
    "areas": "Diseño, Costura",
    "fecha": "2026-06-15T00:00:00",
    "estado": "Entregado"
  }
}
```

**Estados válidos:** `Pendiente`, `En producción`, `Entregado`

---

## ⚠️ Incidencias

### GET `/incidencias`
Obtiene todas las incidencias.

**Parámetros Query:**
- `prioridad=Alta` - Filtrar por prioridad

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "INC-001",
      "titulo": "Máquina overlock atascada",
      "descripcion": "La máquina no responde desde las 10am",
      "area": "Costura",
      "prioridad": "Alta",
      "estado": "Abierta"
    }
  ]
}
```

### GET `/incidencias/{id}`
Obtiene una incidencia específica.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "INC-001",
    "titulo": "Máquina overlock atascada",
    "descripcion": "La máquina no responde desde las 10am",
    "area": "Costura",
    "prioridad": "Alta",
    "estado": "Abierta"
  }
}
```

### POST `/incidencias`
Crea una nueva incidencia.

**Request:**
```json
{
  "titulo": "Falta de tela",
  "descripcion": "Se acabó el denim azul",
  "area": "Corte",
  "prioridad": "Alta"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Incidencia creada",
  "data": {
    "id": "INC-019",
    "titulo": "Falta de tela",
    "descripcion": "Se acabó el denim azul",
    "area": "Corte",
    "prioridad": "Alta",
    "estado": "Abierta"
  }
}
```

### PUT `/incidencias/{id}`
Actualiza el estado de una incidencia.

**Request:**
```json
{
  "estado": "Resuelta"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Incidencia actualizada",
  "data": {
    "id": "INC-001",
    "titulo": "Máquina overlock atascada",
    "descripcion": "La máquina no responde desde las 10am",
    "area": "Costura",
    "prioridad": "Alta",
    "estado": "Resuelta"
  }
}
```

**Estados válidos:** `Abierta`, `En progreso`, `Resuelta`
**Prioridades válidas:** `Baja`, `Media`, `Alta`

---

## 📝 Usuarios de Prueba

```
Admin:
  Username: admin
  Password: admin123
  Rol: ADMIN

Empleados (Contraseña: 123):
  lander     (Corte)
  merari     (Costura)
  marcod     (Diseño)
```

---

## ✅ Códigos de Estado HTTP

- `200 OK` - Operación exitosa
- `201 Created` - Recurso creado
- `400 Bad Request` - Datos inválidos
- `401 Unauthorized` - No autenticado
- `404 Not Found` - Recurso no encontrado
- `500 Internal Server Error` - Error del servidor

---

## 🔄 Arquitectura

```
Controllers (REST API)
    ↓
Services (Business Logic)
    ↓
Models (Data Objects)
    ↓
Database (cuando esté conectada)
```

La lógica de negocio reside en los servicios, NO en JavaScript.
Los controladores solo manejan HTTP requests/responses.
Los modelos representan entidades de negocio.
