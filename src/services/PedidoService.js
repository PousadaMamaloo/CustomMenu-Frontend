import ApiServiceBase from './ApiServices';

const PedidoService = {
  /**
   * Busca os detalhes de um pedido específico pelo seu ID.
   */
  async obterPedidoPorId(idPedido) {
    try {
      const response = await ApiServiceBase.get(`/pedidos/${idPedido}`);
      return response && response.data ? response.data : null;
    } catch (error) {
      console.error(`Erro ao obter pedido com ID ${idPedido}:`, error);
      throw error;
    }
  },

  /**
   * Lista os pedidos feitos na data atual.
   * Usa o endpoint GET /api/pedidos/hoje.
   */
  async listarPedidosDeHoje() {
    try {
      const response = await ApiServiceBase.get('/pedidos/hoje');
      return response && Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Erro ao listar pedidos de hoje:', error);
      throw error;
    }
  },

  /**
   * Lista o histórico de todos os pedidos com paginação.
   */
  async listarHistorico(params) {
    try {
      const response = await ApiServiceBase.get('/pedidos/historico', { params });
      if (response && response.data) {
        return response.data;
      }
      return { pedidos: [], paginacao: { total_paginas: 0 } };
    } catch (error) {
      console.error('Erro ao listar histórico de pedidos:', error);
      throw error;
    }
  },
};

export default PedidoService;