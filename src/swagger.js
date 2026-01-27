const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API CultiTech',
    version: '1.0.0',
    description: 'Sistema de gestión agrícola con reportes, incidencias y datos climáticos.',
  },
  servers: [
    {
      url: 'http://localhost:3005/api/v1',
      description: 'Servidor local de desarrollo',
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      // 1. USUARIO (Para Auth y Perfil)
      Usuario: {
        type: 'object',
        properties: {
          uid: { type: 'integer', example: 1 },
          nombre: { type: 'string', example: 'Juan Pérez' },
          correo: { type: 'string', example: 'juan@cultitech.com' },
          rol: { type: 'string', enum: ['Administrador', 'Productor', 'Manager', 'Asesor'] }
        }
      },

      // 2. CULTIVO
      Cultivo: {
        type: 'object',
        required: ['nombre', 'tipo_cultivo'],
        properties: {
          nombre: { type: 'string', example: 'Parcela Norte' },
          zona_cultivo: { type: 'string' },
          tipo_cultivo: { type: 'string', example: 'Tomate' },
          region: { type: 'string' },
          pais: { type: 'string' },
          sistema_riego: { type: 'string' },
          poligono: { type: 'object', description: 'GeoJSON del área' }
        }
      },

      // 3. INCIDENCIA
      Incidencia: {
        type: 'object',
        required: ['titulo', 'descripcion', 'tipo', 'id_cultivo', 'id_productor'],
        properties: {
          titulo: { type: 'string', maxLength: 150 },
          descripcion: { type: 'string' },
          tipo: { type: 'string', maxLength: 50 },
          prioridad: { type: 'string', enum: ['baja', 'media', 'alta'], default: 'media' },
          estado: { type: 'string', enum: ['abierta', 'en proceso', 'cerrada'], default: 'abierta' },
          id_cultivo: { type: 'integer' },
          id_productor: { type: 'integer' }
        }
      },

      // 4. REPORTE
      Reporte: {
        type: 'object',
        required: ['titulo', 'id_cultivo'],
        properties: {
          titulo: { type: 'string', maxLength: 150 },
          id_cultivo: { type: 'integer' },
          descripcion: { type: 'string', maxLength: 5000 }
        }
      },

      // 5. NOTIFICACIÓN
      Notificacion: {
        type: 'object',
        required: ['tipo', 'titulo', 'mensaje'],
        properties: {
          tipo: { type: 'string', maxLength: 50 },
          titulo: { type: 'string', maxLength: 150 },
          mensaje: { type: 'string', maxLength: 2000 },
          leida: { type: 'boolean', default: false }
        }
      },

      // 6. DATOS DE MEDICIONES (Body para POST)
      Mediciones: {
        type: 'object',
        required: ['parcela_id', 'lat', 'lon'],
        properties: {
          parcela_id: { type: 'integer' },
          lat: { type: 'number', format: 'float' },
          lon: { type: 'number', format: 'float' },
          valor: { type: 'number', description: 'Valor de la medición (temp, humedad, etc)' }
        }
      },

      // 7. MULTIMEDIA
      Multimedia: {
        type: 'object',
        properties: {
          id_multimedia: { type: 'integer' },
          url: { type: 'string', description: 'URL de Cloudinary o servidor' },
          entidad: { type: 'string', enum: ['incidencia', 'reporte', 'cultivo'] },
          ref_id: { type: 'integer' }
        }
      }
    }
  },
  security: [{ bearerAuth: [] }],
  paths: {
    // ================= AUTH =================
    '/auth/login': {
      post: {
        tags: ['Autenticación'],
        summary: 'Login de usuario',
        security: [],
        requestBody: {
          content: { 'application/json': { schema: { type: 'object', properties: { correo: { type: 'string' }, contrasenia: { type: 'string' } } } } }
        },
        responses: { 200: { content: { 'application/json': { schema: { $ref: '#/components/schemas/UsuarioLogueado' } } } } }
      }
    },
    '/auth/renew': {
      get: {
        tags: ['Autenticación'],
        summary: 'Renovar sesión (JWT)',
        responses: { 200: { description: 'Token renovado' } }
      }
    },

    // ================= CULTIVOS =================
    '/cultivos': {
      get: {
        tags: ['Cultivos'],
        summary: 'Obtener todos los cultivos',
        responses: { 200: { description: 'Lista completa' } }
      },
      post: {
        tags: ['Cultivos'],
        summary: 'Registrar nuevo cultivo',
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Cultivo' } } } },
        responses: { 201: { description: 'Creado correctamente' } }
      }
    },
    '/cultivos/{id}': {
      get: {
        tags: ['Cultivos'],
        summary: 'Ver detalle de un cultivo',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Datos del cultivo' } }
      },
      put: {
        tags: ['Cultivos'],
        summary: 'Actualizar cultivo',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Cultivo' } } } },
        responses: { 200: { description: 'Actualizado' } }
      },
      delete: {
        tags: ['Cultivos'],
        summary: 'Borrar cultivo',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Eliminado' } }
      }
    },
    '/cultivos/productor/{id}': {
      get: {
        tags: ['Cultivos'],
        summary: 'Cultivos por ID de productor',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Lista del productor' } }
      }
    },

    // ================= CHAT =================
    '/chat/conversaciones': {
      get: {
        tags: ['Chat'],
        summary: 'Listar mis chats activos y usuarios disponibles',
        responses: { 200: { description: 'Bandeja de entrada' } }
      }
    },
    '/chat/conversacion/{idReceptor}': {
      post: {
        tags: ['Chat'],
        summary: 'Crear/Abrir chat con un usuario',
        parameters: [{ name: 'idReceptor', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Conversación lista' } }
      }
    },
    '/chat/mensajes/{idConversacion}': {
      get: {
        tags: ['Chat'],
        summary: 'Cargar mensajes de un chat',
        parameters: [{ name: 'idConversacion', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Historial de mensajes' } }
      },
      post: {
        tags: ['Chat'],
        summary: 'Enviar mensaje nuevo',
        parameters: [{ name: 'idConversacion', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { contenido: { type: 'string' } } } } } },
        responses: { 201: { description: 'Enviado' } }
      }
    },

    // ================= MEDICIONES  =================
    '/apis/temperatura': { post: { tags: ['Mediciones'], summary: 'Temperatura (C)', requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/SensorBody' } } } }, responses: { 200: { description: 'Ok' } } } },
    '/apis/humedad-relativa': { post: { tags: ['Mediciones'], summary: 'Humedad Aire (%)', requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/SensorBody' } } } }, responses: { 200: { description: 'Ok' } } } },
    '/apis/humedad-suelo': { post: { tags: ['Mediciones'], summary: 'Humedad Suelo (m3)', requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/SensorBody' } } } }, responses: { 200: { description: 'Ok' } } } },
    '/apis/precipitacion': { post: { tags: ['Mediciones'], summary: 'Lluvia (mm)', requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/SensorBody' } } } }, responses: { 200: { description: 'Ok' } } } },
    '/apis/viento-velocidad': { post: { tags: ['Mediciones'], summary: 'Velocidad Viento', requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/SensorBody' } } } }, responses: { 200: { description: 'Ok' } } } },
    '/apis/viento-direccion': { post: { tags: ['Mediciones'], summary: 'Dirección Viento', requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/SensorBody' } } } }, responses: { 200: { description: 'Ok' } } } },
    '/apis/evapotranspiracion': { post: { tags: ['Mediciones'], summary: 'Evapotranspiración', requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/SensorBody' } } } }, responses: { 200: { description: 'Ok' } } } },
    '/apis/historico': {
      post: {
        tags: ['Mediciones'],
        summary: 'Histórico combinado',
        requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { parcela_id: { type: 'integer' }, inicio: { type: 'string' }, fin: { type: 'string' } } } } } },
        responses: { 200: { description: 'Array de datos históricos' } }
      }
    },

    // ================= ANÁLISIS CON IA=================
    '/apis/alerta-plagas': {
      post: {
        tags: ['IA y Alertas'],
        summary: 'Riesgo de plagas por clima',
        requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { lat: { type: 'number' }, lon: { type: 'number' }, fruta: { type: 'string' } } } } } },
        responses: { 200: { description: 'Lista de alertas' } }
      }
    },
    '/apis/analisis-climatico': {
      get: {
        tags: ['IA y Alertas'],
        summary: 'Datos climáticos últimos días',
        parameters: [{ name: 'lat', in: 'query' }, { name: 'lon', in: 'query' }, { name: 'days', in: 'query' }],
        responses: { 200: { description: 'Análisis obtenido' } }
      }
    },
    '/apis/alerta-meteo': {
      post: {
        tags: ['IA y Alertas'],
        summary: 'Predicción riesgos 7 días',
        requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { lat: { type: 'number' }, lon: { type: 'number' }, cultivo: { type: 'string' } } } } } },
        responses: { 200: { description: 'Reporte semanal' } }
      }
    },
    '/apis/identificar-plaga': {
      post: {
        tags: ['IA e Imagen'],
        summary: 'Detección en imagen (file)',
        requestBody: { content: { 'multipart/form-data': { schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } } } },
        responses: { 200: { description: 'Plagas detectadas' } }
      }
    },
    '/apis/identificar-planta': {
      post: {
        tags: ['IA e Imagen'],
        summary: 'Identificar especie (image)',
        requestBody: { content: { 'multipart/form-data': { schema: { type: 'object', properties: { image: { type: 'string', format: 'binary' } } } } } },
        responses: { 200: { description: 'Nombre científico y común' } }
      }
    },
    '/apis/info-suelo': {
      post: {
        tags: ['IA y Alertas'],
        summary: 'Análisis de suelo (Topografía)',
        requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { lat: { type: 'number' }, lon: { type: 'number' } } } } } },
        responses: { 200: { description: 'Datos topográficos' } }
      }
    },
    '/apis/chatbot': {
      post: {
        tags: ['IA y Alertas'],
        summary: 'Chatbot Agronómico',
        requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } } },
        responses: { 200: { description: 'Respuesta de la IA' } }
      }
    },
    // ================= INCIDENCIAS =================
    '/incidencias/listado': {
      get: {
        tags: ['Incidencias'],
        summary: 'Listar todas las incidencias (Staff)',
        responses: { 200: { description: 'Lista total obtenida' } }
      }
    },
    '/incidencias/crear': {
      post: {
        tags: ['Incidencias'],
        summary: 'Crear nueva incidencia (Solo Productor)',
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Incidencia' } } } },
        responses: { 201: { description: 'Creada correctamente' } }
      }
    },
    '/incidencias/{id}': {
      get: {
        tags: ['Incidencias'],
        summary: 'Ver detalle de una incidencia',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Detalle obtenido' } }
      }
    },
    '/incidencias/productor/{id}': {
      get: {
        tags: ['Incidencias'],
        summary: 'Listar incidencias de un productor',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Lista filtrada' } }
      }
    },
    '/incidencias/editar/{id}': {
      put: {
        tags: ['Incidencias'],
        summary: 'Editar incidencia (Manager/Admin)',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Incidencia' } } } },
        responses: { 200: { description: 'Actualizada' } }
      }
    },
    '/incidencias/eliminar/{id}': {
      delete: {
        tags: ['Incidencias'],
        summary: 'Eliminar incidencia',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Eliminada' } }
      }
    },
    '/incidencias/estado/{id}': {
      patch: {
        tags: ['Incidencias'],
        summary: 'Actualizar solo el estado',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          content: { 'application/json': { schema: { type: 'object', properties: { estado: { type: 'string', enum: ['abierta', 'en proceso', 'cerrada'] } } } } }
        },
        responses: { 200: { description: 'Estado actualizado' } }
      }
    },
    '/incidencias/prioridad/{id}': {
      patch: {
        tags: ['Incidencias'],
        summary: 'Actualizar solo la prioridad',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          content: { 'application/json': { schema: { type: 'object', properties: { prioridad: { type: 'string', enum: ['alta', 'media', 'baja'] } } } } }
        },
        responses: { 200: { description: 'Prioridad actualizada' } }
      }
    },

    // ================= MULTIMEDIA =================
    '/multimedia/{entidad}/{id}': {
      post: {
        tags: ['Multimedia'],
        summary: 'Subir un archivo (Imagen, PDF, Video)',
        description: 'Formatos permitidos: jpg, jpeg, png, webp, pdf, mp4, mov, avi, mkv. Máx 50MB.',
        parameters: [
          { name: 'entidad', in: 'path', required: true, schema: { type: 'string', enum: ['incidencia', 'reporte', 'cultivo'] } },
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        requestBody: {
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  archivo: {
                    type: 'string',
                    format: 'binary',
                    description: 'El archivo binario a subir'
                  }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Archivo subido con éxito' },
          400: { description: 'Formato no permitido o error de validación' }
        }
      },
      get: {
        tags: ['Multimedia'],
        summary: 'Listar archivos de una entidad específica',
        parameters: [
          { name: 'entidad', in: 'path', required: true, schema: { type: 'string', enum: ['incidencia', 'reporte', 'cultivo'] } },
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: { 200: { description: 'Lista de URLs de archivos' } }
      }
    },
    '/multimedia/{id_multimedia}': {
      delete: {
        tags: ['Multimedia'],
        summary: 'Eliminar un archivo multimedia (Solo Admin)',
        parameters: [
          { name: 'id_multimedia', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: { 200: { description: 'Archivo eliminado de la base de datos y servidor' } }
      }
    },

    // ================= NOTIFICACIONES =================
    '/notificaciones': {
      get: {
        tags: ['Notificaciones'],
        summary: 'Obtener todas las notificaciones (Solo Administrador)',
        responses: { 200: { description: 'Lista total' } }
      }
    },
    '/notificaciones/crear': {
      post: {
        tags: ['Notificaciones'],
        summary: 'Crear nueva notificación',
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Notificacion' } } } },
        responses: { 201: { description: 'Notificación creada' } }
      }
    },
    '/notificaciones/por-creador/{id}': {
      get: {
        tags: ['Notificaciones'],
        summary: 'Notificaciones enviadas por un usuario',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Lista' } }
      }
    },
    '/notificaciones/por-receptor/{id}': {
      get: {
        tags: ['Notificaciones'],
        summary: 'Notificaciones recibidas por un usuario',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Lista' } }
      },
      delete: {
        tags: ['Notificaciones'],
        summary: 'Eliminar todas las notificaciones de un receptor',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Borradas' } }
      }
    },
    '/notificaciones/{id}/leida': {
      put: {
        tags: ['Notificaciones'],
        summary: 'Marcar notificación como leída',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Marcada como leída' } }
      }
    },
    // ================= REPORTES =================
    '/reportes': {
      get: {
        tags: ['Reportes'],
        summary: 'Listar todos mis reportes',
        responses: { 200: { description: 'Lista obtenida' } }
      }
    },
    '/reportes/crear': {
      post: {
        tags: ['Reportes'],
        summary: 'Crear un reporte (Solo Productor)',
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Reporte' } } } },
        responses: { 201: { description: 'Creado' } }
      }
    },
    '/reportes/productor/{id}': {
      get: {
        tags: ['Reportes'],
        summary: 'Reportes de un productor específico',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Lista del productor' } }
      }
    },
    '/reportes/{id}': {
      get: {
        tags: ['Reportes'],
        summary: 'Ver detalle de un reporte',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Detalle del reporte' } }
      }
    },
    '/reportes/editar/{id}': {
      put: {
        tags: ['Reportes'],
        summary: 'Editar reporte',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Reporte' } } } },
        responses: { 200: { description: 'Actualizado' } }
      }
    },
    '/reportes/eliminar/{id}': {
      delete: {
        tags: ['Reportes'],
        summary: 'Eliminar reporte',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Eliminado' } }
      }
    },
  }
};

const options = { swaggerDefinition, apis: [] };
module.exports = swaggerJSDoc(options);