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

  /**
   * Cria um novo pedido.
   * Usa o endpoint POST /api/pedidos.
   */
  async criarPedido(dadosPedido) {
    try {
      const response = await ApiServiceBase.post('/pedidos', dadosPedido);
      return response && response.data ? response.data : null;
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      throw error;
    }
  },

  /**
   * Edita um pedido existente.
   * Usa o endpoint PUT /api/pedidos/:id.
   */
  async editarPedido(idPedido, dadosPedido) {
    try {
      const response = await ApiServiceBase.put(`/pedidos/${idPedido}`, dadosPedido);
      return response && response.data ? response.data : null;
    } catch (error) {
      console.error(`Erro ao editar pedido com ID ${idPedido}:`, error);
      throw error;
    }
  },

  /**
   * Lista os pedidos do quarto para o evento específico.
   * Usa o endpoint GET /api/pedidos/quarto/:id_quarto/evento/:id_evento.
   */
  async listarPedidosQuartoEvento(idQuarto, idEvento) {
    try {
      const response = await ApiServiceBase.get(`/pedidos/quarto/${idQuarto}/evento/${idEvento}`);
      return response && Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error(`Erro ao listar pedidos do quarto ${idQuarto} para evento ${idEvento}:`, error);
      throw error;
    }
  },

  /**
   * Exclui um pedido.
   * Usa o endpoint DELETE /api/pedidos/:id.
   */
  async excluirPedido(idPedido) {
    try {
      const response = await ApiServiceBase.delete(`/pedidos/${idPedido}`);
      return response && response.data ? response.data : null;
    } catch (error) {
      console.error(`Erro ao excluir pedido com ID ${idPedido}:`, error);
      throw error;
    }
  },
};

export default PedidoService;