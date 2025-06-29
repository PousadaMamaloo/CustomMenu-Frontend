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
   * Lista os itens dos eventos ativos de hoje.
   * Usa o endpoint GET /api/eventos/hoje.
   */
  async listarEventosAtivos() {
    try {
      const response = await ApiServiceBase.get('/eventos/hoje');
      // Retorna o array de eventos (response.data.data)
      return response && response.data && Array.isArray(response.data.data)
        ? response.data.data
        : [];
    } catch (error) {
      console.error('Erro ao listar eventos ativos de hoje:', error);
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