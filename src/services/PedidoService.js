import ApiServiceBase from './ApiServices'; // Garanta que o caminho está correto

/**
 * Service para gerenciar as operações da API relacionadas a Pedidos.
 */
const PedidoService = {
  /**
   * Busca os detalhes de um pedido específico pelo seu ID.
   */
  async obterPedidoPorId(idPedido) {
    const response = await ApiServiceBase.get(`/pedidos/${idPedido}`);
    return response && response.data ? response.data : null;
  },

  /**
   * Lista os pedidos associados a eventos ativos no dia.
   */
  async listarPedidosDeEventosAtivos() {
    const response = await ApiServiceBase.get('/pedidos/eventos/ativos');
    // Garante que retorna sempre um array de pedidos
    return response && Array.isArray(response.data) ? response.data : [];
  },

  /**
   * Lista o histórico de todos os pedidos com paginação.
   */
  async listarHistorico(page = 1, limit = 50) {
    const response = await ApiServiceBase.get('/pedidos/historico', { params: { page, limit } });
    // Retorna o objeto de paginação esperado
    return response && response.data ? response.data : { pedidos: [], paginacao: { total_paginas: 1 } };
  },

  /**
   * Gera um relatório/comanda para um evento específico.
   */
  async obterRelatorioPorEvento(idEvento) {
    const response = await ApiServiceBase.get(`/pedidos/relatorio/${idEvento}`);
    return response && response.data ? response.data : null;
  },
};

export default PedidoService;   