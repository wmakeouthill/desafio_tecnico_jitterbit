/**
 * Mapper responsável por transformar os dados recebidos no body (PT-BR)
 * para o formato armazenado no banco de dados (EN).
 *
 * Entrada (body):
 *   numeroPedido, valorTotal, dataCriacao, items[{ idItem, quantidadeItem, valorItem }]
 *
 * Saída (banco):
 *   orderId, value, creationDate, items[{ productId, quantity, price }]
 */

/**
 * Transforma o body do request (campos em português) para o modelo do banco (campos em inglês).
 */
const mapRequestToOrder = (body) => {
  return {
    orderId: body.numeroPedido,
    value: body.valorTotal,
    creationDate: new Date(body.dataCriacao),
    items: (body.items || []).map((item) => ({
      productId: Number(item.idItem),
      quantity: item.quantidadeItem,
      price: item.valorItem
    }))
  };
};

/**
 * Transforma o modelo do banco (campos em inglês) de volta para o formato de resposta (português).
 */
const mapOrderToResponse = (order) => {
  return {
    numeroPedido: order.orderId,
    valorTotal: order.value,
    dataCriacao: order.creationDate,
    items: (order.items || []).map((item) => ({
      idItem: String(item.productId),
      quantidadeItem: item.quantity,
      valorItem: item.price
    }))
  };
};

module.exports = { mapRequestToOrder, mapOrderToResponse };
