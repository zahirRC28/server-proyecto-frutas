# server-proyecto-frutas

API RESTful y servidor de sockets para la gestión de cultivos, incidencias, reportes, usuarios y comunicación en tiempo real para el sector agrícola.

## Tabla de Contenidos
- [Descripción](#descripción)
- [Instalación](#instalación)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Variables de Entorno](#variables-de-entorno)
- [Rutas Principales (API)](#rutas-principales-api)
- [Modelos Principales](#modelos-principales)
- [Sockets](#sockets)
- [Documentación y Swagger](#documentación-y-swagger)
- [Scripts útiles](#scripts-útiles)
- [Dependencias](#dependencias-instaladas)

---

## Descripción
Este proyecto implementa un backend Node.js con Express y Socket.io para la gestión integral de usuarios, cultivos, incidencias, reportes, notificaciones, multimedia y chat en tiempo real, orientado a la digitalización del sector agrícola.

Incluye autenticación JWT, roles, validaciones, subida de archivos a Cloudinary, integración con APIs externas, y documentación Swagger.

## Instalación
1. **Clona el repositorio:**
	```bash
	git clone https://github.com/zahirRC28/server-proyecto-frutas.git
	cd server-proyecto-frutas
	```
2. **Instala dependencias:**
	```bash
	npm install
	```
3. **Configura las variables de entorno:**
	Crea un archivo `.env` en la raíz con el siguiente contenido:
	```env
	PORT=3005
	STRINGDB=postgresql://<usuario>:<password>@<host>:<puerto>/<db>
	SECRET_KEY=claveSecreta
	CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
	```
4. **Inicia el servidor:**
	```bash
	npm run dev
	# o para producción
	npm start
	```

## Estructura del Proyecto

```
src/
  app.js                # Configuración principal de Express y middlewares
  server.js             # Inicialización de servidor HTTP y Socket.io
  swagger.js            # Configuración de Swagger
  configs/              # Configuración de base de datos y Cloudinary
  controllers/          # Lógica de negocio para cada recurso
  helpers/              # Funciones auxiliares (JWT, fetch, notificaciones)
  middlewares/          # Middlewares de validación, roles, uploads
  models/               # Modelos de datos y acceso a BD (PostgreSQL)
  routes/               # Definición de rutas y endpoints
  socket/               # Lógica de sockets y reglas de chat
uploads/                # Archivos subidos (videos, imágenes)
docs/                   # Documentación generada por JSDoc
jsdoc.json              # Configuración de JSDoc
package.json            # Dependencias y scripts
```

## Variables de Entorno
Debes definir en `.env`:

- `PORT`: Puerto del servidor (por defecto 3005)
- `STRINGDB`: Cadena de conexión a PostgreSQL
- `SECRET_KEY`: Clave secreta para JWT
- `CLOUDINARY_URL`: URL de Cloudinary para subida de archivos

## Rutas Principales (API)
Las rutas están bajo `/api/v1/`.

### Autenticación
- `POST /auth/login` — Login de usuario
- `GET /auth/renovar` — Renovar token JWT

### Usuarios
- `POST /user/crear` — Crear usuario (Admin)
- `PUT /user/actualizar/:id` — Actualizar usuario
- `DELETE /user/eliminar/:id` — Eliminar usuario
- `GET /user/usuario/:id` — Obtener usuario por ID
- `GET /user/todosUsuarios/:id` — Listar todos los usuarios (Admin)
- `PUT /user/cambiarEstado/:id` — Activar/desactivar usuario
- `GET /user/todosRoles` — Listar roles
- `POST /user/porUserRol` — Usuarios por rol
- `GET /user/productores` — Listar productores según rol

### Cultivos
- `GET /cultivo/` — Listar cultivos
- `GET /cultivo/:id` — Ver cultivo por ID
- `GET /cultivo/productor/:id` — Cultivos de un productor
- `POST /cultivo/crear` — Crear cultivo (Productor)
- `PUT /cultivo/editar/:id` — Editar cultivo
- `DELETE /cultivo/eliminar/:id` — Eliminar cultivo

### Incidencias
- `POST /incidencia/crear` — Crear incidencia (Productor)
- `GET /incidencia/listado` — Listar incidencias
- `GET /incidencia/:id` — Ver incidencia por ID
- `GET /incidencia/productor/:id` — Incidencias de un productor
- `PUT /incidencia/editar/:id` — Editar incidencia
- `DELETE /incidencia/eliminar/:id` — Eliminar incidencia
- `PATCH /incidencia/estado/:id` — Cambiar estado
- `PATCH /incidencia/prioridad/:id` — Cambiar prioridad

### Reportes
- `POST /reporte/crear` — Crear reporte (Productor)
- `GET /reporte/` — Listar reportes
- `GET /reporte/productor/:id` — Reportes de un productor
- `GET /reporte/:id` — Ver reporte por ID
- `PUT /reporte/editar/:id` — Editar reporte
- `DELETE /reporte/eliminar/:id` — Eliminar reporte

### Notificaciones
- `POST /notificacion/crear` — Crear notificación
- `GET /notificacion/por-creador/:id` — Notificaciones enviadas
- `GET /notificacion/por-receptor/:id` — Notificaciones recibidas
- `GET /notificacion/` — Todas las notificaciones (Admin)
- `PUT /notificacion/:id/leida` — Marcar como leída
- `DELETE /notificacion/por-receptor/:id` — Eliminar todas por receptor

### Multimedia
- `POST /multimedia/:entidad/:id` — Subir archivo (Admin/Productor)
- `GET /multimedia/:entidad/:id` — Listar archivos
- `DELETE /multimedia/:id_multimedia` — Eliminar archivo (Admin)

### Chat
- `POST /chat/conversacion/:idReceptor` — Crear/obtener conversación
- `GET /chat/` — Listar conversaciones
- `GET /chat/:idConversacion` — Mensajes de una conversación
- `POST /chat/mensaje/:idConversacion` — Enviar mensaje

### APIs externas y Asistente
- `/apis/temperatura`, `/apis/humedad-relativa`, ... — Integraciones climáticas
- `/apis/chatbot` — Chatbot IA

## Modelos Principales

- **Usuario:** nombre, correo, contraseña (hash), rol, id_manager, activo
- **Cultivo:** nombre, zona, tipo, región, país, sistema de riego, polígono (GeoJSON), id_productor
- **Incidencia:** título, descripción, tipo, prioridad, estado, id_cultivo, id_productor
- **Reporte:** título, descripción, id_productor, id_cultivo, id_incidencia (opcional)
- **Notificación:** tipo, título, mensaje, leido, id_creador, id_receptor, entidad_tipo, entidad_id
- **Multimedia:** tipo, filename, mimetype, size, url, public_id
- **Chat:** conversaciones y mensajes entre usuarios según reglas de rol

## Sockets
El servidor implementa comunicación en tiempo real con Socket.io para:
- Mensajería instantánea entre usuarios (según reglas de rol)
- Notificaciones push
- Indicadores de escritura y lectura de mensajes

La autenticación de sockets se realiza mediante JWT.

## Documentación y Swagger

- Accede a la documentación interactiva en: `http://localhost:3005/api/docs`
- Documentación generada automáticamente con JSDoc en la carpeta `/docs`

## Scripts útiles

- `npm run dev` — Inicia el servidor en modo desarrollo (nodemon)
- `npm start` — Inicia el servidor en modo producción
- `npm run docs` — Genera documentación JSDoc en `/docs`

---

## Dependencias instaladas

| Paquete                | Propósito principal                                                                 |
|------------------------|-----------------------------------------------------------------------------------|
| **express**            | Framework principal para el servidor HTTP y rutas REST                             |
| **socket.io**          | Comunicación en tiempo real (chat, notificaciones push)                           |
| **pg**                 | Cliente para PostgreSQL                                                           |
| **dotenv**             | Carga de variables de entorno desde `.env`                                        |
| **bcryptjs**           | Hash y verificación de contraseñas                                                |
| **jsonwebtoken**       | Generación y validación de tokens JWT                                             |
| **express-validator**  | Validación de datos en rutas                                                      |
| **cors**               | Configuración de CORS para peticiones cross-origin                               |
| **multer**             | Manejo de archivos subidos (uploads)                                              |
| **cloudinary**         | Subida y gestión de archivos multimedia en la nube                                |
| **form-data**          | Construcción de formularios para peticiones HTTP (APIs externas)                 |
| **node-fetch**         | Realizar peticiones HTTP a servicios externos                                     |
| **pdfkit**             | Generación de archivos PDF (reportes)                                             |
| **swagger-jsdoc**      | Generación automática de especificaciones Swagger/OpenAPI                        |
| **swagger-ui-express** | Servir la documentación Swagger en una ruta web                                   |
| **jsdoc**              | Generación de documentación automática a partir de comentarios en el código       |

> Además, se utiliza **nodemon** en desarrollo para recarga automática (`npm run dev`).