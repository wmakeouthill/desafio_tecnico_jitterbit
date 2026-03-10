/**
 * Middleware global de tratamento de erros.
 * Captura erros não tratados e retorna respostas HTTP apropriadas.
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[ERRO] ${err.message}`);

  // Erro de validação do Mongoose
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      error: 'Erro de validação',
      details: messages
    });
  }

  // Erro de chave duplicada do MongoDB
  if (err.code === 11000) {
    return res.status(409).json({
      error: 'Registro duplicado',
      details: `O valor já existe: ${JSON.stringify(err.keyValue)}`
    });
  }

  // Erro de cast do Mongoose (ID inválido, etc.)
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'Dados inválidos',
      details: `Valor inválido para o campo "${err.path}"`
    });
  }

  // Erro genérico do servidor
  return res.status(500).json({
    error: 'Erro interno do servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

module.exports = errorHandler;
