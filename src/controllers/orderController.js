const Order = require('../models/Order');
const { mapRequestToOrder, mapOrderToResponse } = require('../utils/mapper');

/**
 * Cria um novo pedido.
 * Recebe o body em formato PT-BR, transforma para EN e salva no MongoDB.
 * POST /order
 */
const createOrder = async (req, res, next) => {
  try {
    const { numeroPedido, valorTotal, dataCriacao, items } = req.body;

    // Validação dos campos obrigatórios
    if (!numeroPedido || valorTotal === undefined || !dataCriacao || !items) {
      return res.status(400).json({
        error: 'Campos obrigatórios: numeroPedido, valorTotal, dataCriacao, items'
      });
    }

    // Verifica se o pedido já existe
    const existingOrder = await Order.findOne({ orderId: numeroPedido });
    if (existingOrder) {
      return res.status(409).json({
        error: `Pedido com número "${numeroPedido}" já existe`
      });
    }

    // Transforma os dados do body para o formato do banco
    const orderData = mapRequestToOrder(req.body);

    // Salva o pedido no banco de dados
    const order = await Order.create(orderData);

    return res.status(201).json({
      message: 'Pedido criado com sucesso',
      order: mapOrderToResponse(order)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtém um pedido pelo número (orderId).
 * GET /order/:orderId
 */
const getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({
        error: `Pedido "${orderId}" não encontrado`
      });
    }

    return res.status(200).json(mapOrderToResponse(order));
  } catch (error) {
    next(error);
  }
};

/**
 * Lista todos os pedidos.
 * GET /order/list
 */
const listOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ creationDate: -1 });

    return res.status(200).json({
      total: orders.length,
      orders: orders.map(mapOrderToResponse)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Atualiza um pedido existente pelo número (orderId).
 * PUT /order/:orderId
 */
const updateOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    // Verifica se o pedido existe
    const existingOrder = await Order.findOne({ orderId });
    if (!existingOrder) {
      return res.status(404).json({
        error: `Pedido "${orderId}" não encontrado`
      });
    }

    // Transforma os dados recebidos
    const orderData = mapRequestToOrder(req.body);

    // Atualiza o pedido mantendo o orderId original
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId },
      { ...orderData, orderId },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      message: 'Pedido atualizado com sucesso',
      order: mapOrderToResponse(updatedOrder)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Deleta um pedido pelo número (orderId).
 * DELETE /order/:orderId
 */
const deleteOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const deletedOrder = await Order.findOneAndDelete({ orderId });
    if (!deletedOrder) {
      return res.status(404).json({
        error: `Pedido "${orderId}" não encontrado`
      });
    }

    return res.status(200).json({
      message: `Pedido "${orderId}" deletado com sucesso`
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retorna sugestão do próximo número de pedido (incremental).
 * GET /order/next-id
 */
const getNextOrderId = async (req, res, next) => {
  try {
    const lastOrder = await Order.findOne().sort({ _id: -1 });

    let nextNumber = 1;
    if (lastOrder && lastOrder.orderId) {
      const match = lastOrder.orderId.match(/(\d+)/);
      if (match) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }

    const nextId = `PED-${String(nextNumber).padStart(4, '0')}`;

    return res.status(200).json({ nextOrderId: nextId });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrderById,
  listOrders,
  updateOrder,
  deleteOrder,
  getNextOrderId
};
