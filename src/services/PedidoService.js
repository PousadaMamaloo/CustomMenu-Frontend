import ApiServiceBase from './ApiServices';

/**
 * Service para gerenciar as operações da API relacionadas a Pedidos.
 */
const PedidoService = {
  /**
   * Cria um novo pedido no sistema.
   * @param {object} dadosPedido - O corpo da requisição para criar o pedido.
   * @param {number} dadosPedido.id_quarto - ID do quarto que está fazendo o pedido.
   * @param {number} [dadosPedido.id_evento] - ID do evento associado (opcional).
   * @param {Array<object>} dadosPedido.itens - Lista de itens do pedido.
   * @param {number} dadosPedido.itens[].id_item - ID do item.
   * @param {number} dadosPedido.itens[].qntd_item - Quantidade do item.
   * @returns {Promise<object>} Uma promessa que resolve para o objeto com o ID do pedido criado.
   */
  async criarPedido(dadosPedido) {
    const response = await ApiServiceBase.post('/pedidos', dadosPedido);
    // A API retorna { mensagem: "...", data: { id_pedido: ... } }
    // Retornamos o objeto 'data' que contém o ID do novo pedido.
    if (response && response.data) {
      return response.data;
    }
    return response;
  },

  /**
   * Obtém os detalhes de um pedido específico pelo seu ID.
   * @param {number} idPedido - O ID do pedido a ser buscado.
   * @returns {Promise<object>} Uma promessa que resolve para os detalhes do pedido.
   */
  async obterPedidoPorId(idPedido) {
    const response = await ApiServiceBase.get(`/pedidos/${idPedido}`);
    // A API retorna os detalhes dentro de um objeto 'data'.
    if (response && response.data) {
      return response.data;
    }
    return response;
  },

  /**
   * Atualiza os itens de um pedido existente.
   * @param {number} idPedido - O ID do pedido a ser atualizado.
   * @param {object} dadosAtualizacao - O corpo da requisição com os novos itens.
   * @param {Array<object>} dadosAtualizacao.itens - A nova lista de itens.
   * @returns {Promise<object>} A resposta da API.
   */
  async atualizarPedido(idPedido, dadosAtualizacao) {
    return await ApiServiceBase.put(`/pedidos/${idPedido}`, dadosAtualizacao);
  },

  /**
   * Deleta um pedido existente pelo seu ID.
   * @param {number} idPedido - O ID do pedido a ser deletado.
   * @returns {Promise<object>} A resposta da API.
   */
  async deletarPedido(idPedido) {
    return await ApiServiceBase.delete(`/pedidos/${idPedido}`);
  },

  /**
   * Lista todos os pedidos associados a um quarto específico.
   * @param {string|number} numQuarto - O número do quarto.
   * @returns {Promise<Array>} Uma promessa que resolve para a lista de pedidos do quarto.
   */
  async listarPedidosPorQuarto(numQuarto) {
    const response = await ApiServiceBase.get(`/pedidos/quarto/${numQuarto}`);
    // A API retorna a lista de pedidos dentro de um objeto 'data'.
    if (response && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  }
};

export default PedidoService