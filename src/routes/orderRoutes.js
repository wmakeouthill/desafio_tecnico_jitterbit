const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  listOrders,
  updateOrder,
  deleteOrder,
  getNextOrderId
} = require('../controllers/orderController');
const auth = require('../middlewares/auth');

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     ItemInput:
 *       type: object
 *       required:
 *         - idItem
 *         - quantidadeItem
 *         - valorItem
 *       properties:
 *         idItem:
 *           type: string
 *           example: "2434"
 *         quantidadeItem:
 *           type: integer
 *           example: 1
 *         valorItem:
 *           type: number
 *           example: 1000
 *     OrderInput:
 *       type: object
 *       required:
 *         - numeroPedido
 *         - valorTotal
 *         - dataCriacao
 *         - items
 *       properties:
 *         numeroPedido:
 *           type: string
 *           example: "v10089015vdb-01"
 *         valorTotal:
 *           type: number
 *           example: 10000
 *         dataCriacao:
 *           type: string
 *           format: date-time
 *           example: "2023-07-19T12:24:11.5299601+00:00"
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ItemInput'
 *     ItemOutput:
 *       type: object
 *       properties:
 *         idItem:
 *           type: string
 *         quantidadeItem:
 *           type: integer
 *         valorItem:
 *           type: number
 *     OrderOutput:
 *       type: object
 *       properties:
 *         numeroPedido:
 *           type: string
 *         valorTotal:
 *           type: number
 *         dataCriacao:
 *           type: string
 *           format: date-time
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ItemOutput'
 */

/**
 * @swagger
 * /order:
 *   post:
 *     summary: Cria um novo pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderInput'
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Pedido já existe
 */
router.post('/', auth, createOrder);

/**
 * @swagger
 * /order/list:
 *   get:
 *     summary: Lista todos os pedidos
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos retornada com sucesso
 */
router.get('/list', auth, listOrders);

/**
 * @swagger
 * /order/next-id:
 *   get:
 *     summary: Sugere o próximo número de pedido incremental
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Próximo ID sugerido
 */
router.get('/next-id', auth, getNextOrderId);

/**
 * @swagger
 * /order/{orderId}:
 *   get:
 *     summary: Obtém um pedido pelo número
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Número do pedido
 *         example: v10089016vdb
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *       404:
 *         description: Pedido não encontrado
 */
router.get('/:orderId', auth, getOrderById);

/**
 * @swagger
 * /order/{orderId}:
 *   put:
 *     summary: Atualiza um pedido existente
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Número do pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderInput'
 *     responses:
 *       200:
 *         description: Pedido atualizado com sucesso
 *       404:
 *         description: Pedido não encontrado
 */
router.put('/:orderId', auth, updateOrder);

/**
 * @swagger
 * /order/{orderId}:
 *   delete:
 *     summary: Deleta um pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Número do pedido
 *     responses:
 *       200:
 *         description: Pedido deletado com sucesso
 *       404:
 *         description: Pedido não encontrado
 */
router.delete('/:orderId', auth, deleteOrder);

module.exports = router;
