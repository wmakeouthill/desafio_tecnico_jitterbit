const mongoose = require('mongoose');

/**
 * Conecta ao banco de dados MongoDB.
 * Utiliza a URI definida na variável de ambiente MONGODB_URI.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Erro ao conectar ao MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
