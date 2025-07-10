import ApiServiceBase from './ApiServices';

/**
 * Serviço para gerenciar operações de Pedidos, principalmente para a área administrativa.
 */
const PedidoService = {
  /**
   * Lista o histórico de todos os pedidos com paginação.
   * @param {object} params - Parâmetros de paginação e filtro.
   * @returns {Promise<object>} Um objeto com a lista de pedidos e dados de paginação.
   */
  async listarHistorico(params) {
    try {
      const response = await ApiServiceBase.get('/pedidos/historico', { params });
      if (response && response.data) {
        return response.data;
      }
      return { pedidos: [], paginacao: { total_paginas: 0 } };
    } catch (error) {
      toast.error('Erro ao listar histórico de pedidos:');
      throw error;
    }
  },

  /**
   * Lista os pedidos feitos na data atual.
   * @returns {Promise<Array>} Uma lista de pedidos de hoje.
   */
  async listarPedidosDeHoje() {
    try {
      const response = await ApiServiceBase.get('/pedidos/hoje');
      return response && Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      toast.error('Erro ao listar pedidos de hoje');
      throw error;
    }
  },

  /**
   * Lista os eventos ativos de hoje.
   * @returns {Promise<Array>} Uma lista de eventos ativos.
   */
  async listarEventosAtivos() {
    try {
      const response = await ApiServiceBase.get('/eventos/hoje');
      return response && response.data 
        ? response.data
        : [];
    } catch (error) {
      toast.error('Erro ao listar eventos ativos de hoje');
      throw error;
    }
  },

  /** 
   * Lista os pedidos de um quarto específico.
   * @param {number} idQuarto - O ID do quarto.
   * @returns {Promise<Array>} Uma lista de pedidos do quarto.
   */
  async pedidosPorQuarto(idQuarto) {
    try {
      const response = await ApiServiceBase.get(`/pedidos/quarto/${idQuarto}`);
      return response && Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      toast.error(`Erro ao listar pedidos do quarto ${idQuarto}:`);
      throw error;
    }
  },

  /**
   * Busca os detalhes de um pedido específico pelo seu ID.
   * @param {number} idPedido - O ID do pedido.
   * @returns {Promise<object|null>} Os dados do pedido ou nulo.
   */
  async obterPedidoPorId(idPedido) {
    try {
      const response = await ApiServiceBase.get(`/pedidos/${idPedido}`);
      return response && response.data ? response.data : null;
    } catch (error) {
      toast.error(`Erro ao obter pedido`);
      throw error;
    }
  },

  /**
   * Edita um pedido existente.
   * @param {number} idPedido - O ID do pedido a ser editado.
   * @param {object} dadosPedido - Os novos dados do pedido.
   * @returns {Promise<object|null>} O pedido editado ou nulo.
   */
  async editarPedido(idPedido, dadosPedido) {
    try {
      const response = await ApiServiceBase.put(`/pedidos/${idPedido}`, dadosPedido);
      return response && response.data ? response.data : null;
    } catch (error) {
      toast.error(`Erro ao editar pedido com ID ${idPedido}:`);
      throw error;
    }
  },


  /**
   * Exclui um pedido.
   * @param {number} idPedido - O ID do pedido a ser excluído.
   * @returns {Promise<object|null>} A resposta da API ou nulo.
   */
  async excluirPedido(idPedido) {
    try {
      const response = await ApiServiceBase.delete(`/pedidos/${idPedido}`);
      return response && response.data ? response.data : null;
    } catch (error) {
      toast.error(`Erro ao excluir pedido com ID ${idPedido}:`);
      throw error;
    }
  },

    /**
   * Cria um novo pedido.
   * @param {object} dadosPedido - Os dados do novo pedido.
   * @returns {Promise<object|null>} O pedido criado ou nulo.
   */
  async criarPedido(dadosPedido) {
    try {
      const response = await ApiServiceBase.post('/pedidos', dadosPedido);
      return response && response.data ? response.data : null;
    } catch (error) {
      toast.error('Erro ao criar pedido:');
      throw error;
    }
  },
};

export default PedidoService;