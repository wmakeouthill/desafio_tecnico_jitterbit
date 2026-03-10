const swaggerJsdoc = require('swagger-jsdoc');

/**
 * Configuração do Swagger para documentação da API.
 */
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gerenciamento de Pedidos',
      version: '1.0.0',
      description: 'API para criar, ler, atualizar e excluir pedidos - Desafio Técnico Jitterbit',
      contact: {
        name: 'Desafio Técnico'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desenvolvimento'
      }
    ]
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;
