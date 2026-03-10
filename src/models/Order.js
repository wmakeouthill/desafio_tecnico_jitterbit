const mongoose = require('mongoose');

/**
 * Schema do item do pedido.
 * Cada item possui productId, quantity e price.
 */
const itemSchema = new mongoose.Schema({
  productId: {
    type: Number,
    required: [true, 'O productId é obrigatório']
  },
  quantity: {
    type: Number,
    required: [true, 'A quantity é obrigatória'],
    min: [1, 'A quantidade mínima é 1']
  },
  price: {
    type: Number,
    required: [true, 'O price é obrigatório'],
    min: [0, 'O preço não pode ser negativo']
  }
});

/**
 * Schema do pedido.
 * Armazena orderId, value, creationDate e uma lista de items.
 */
const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: [true, 'O orderId é obrigatório'],
    unique: true
  },
  value: {
    type: Number,
    required: [true, 'O value é obrigatório'],
    min: [0, 'O valor não pode ser negativo']
  },
  creationDate: {
    type: Date,
    required: [true, 'A creationDate é obrigatória']
  },
  items: {
    type: [itemSchema],
    validate: {
      validator: (v) => Array.isArray(v) && v.length > 0,
      message: 'O pedido deve conter pelo menos um item'
    }
  }
});

module.exports = mongoose.model('Order', orderSchema);
