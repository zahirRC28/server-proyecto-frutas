const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API AgroTech',
    version: '1.0.0',
    description: 'Documentación de la API AgroTech',
  },
  servers: [
    {
      url: 'http://localhost:3005/api/v1',
      description: 'Servidor local',
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
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: [
    './src/docs/*.swagger.js'
  ],
};

module.exports = swaggerJSDoc(options);