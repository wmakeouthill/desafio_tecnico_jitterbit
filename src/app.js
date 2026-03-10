require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const connectDB = require('./config/database');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middlewares/errorHandler');
const swaggerSpec = require('./swagger/swaggerConfig');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globais
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos do frontend
app.use(express.static('public'));

// Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API Pedidos - Documentação'
}));

// Rotas
app.use('/auth', authRoutes);
app.use('/order', orderRoutes);

// Rota de health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Middleware de tratamento de erros (deve ser o último)
app.use(errorHandler);

// Conecta ao banco e inicia o servidor
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Documentação Swagger: http://localhost:${PORT}/api-docs`);
    console.log(`Frontend: http://localhost:${PORT}`);
  });
});

module.exports = app;
