import ApiServiceBase from './ApiServices';

const PedidoService = {
  /**
   * Cria um novo pedido.
   * @param {object} dadosPedido - { id_quarto, id_evento, horario_cafe_manha, itens: [{ id_item, qntd_item }] }
   * @returns {Promise<object>} A resposta da API.
   */
  async criarPedido(dadosPedido) {
    try {
      const response = await ApiServiceBase.post('/pedidos', dadosPedido);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      throw error;
    }
  },

  /**
   * Busca os detalhes de um pedido específico pelo seu ID.
   * @param {number} idPedido - O ID do pedido.
   * @returns {Promise<object>} Os dados do pedido.
   */
  async obterPedidoPorId(idPedido) {
    try {
      const response = await ApiServiceBase.get(`/pedidos/${idPedido}`);
      return response?.data?.data || null;
    } catch (error) {
      console.error(`Erro ao obter pedido com ID ${idPedido}:`, error);
      throw error;
    }
  },

  /**
   * Atualiza os itens de um pedido existente.
   * @param {number} idPedido - O ID do pedido a ser atualizado.
   * @param {object} dadosAtualizacao - { itens: [{ id_item, qntd_item }] }
   * @returns {Promise<object>} A resposta da API.
   */
  async atualizarPedido(idPedido, dadosAtualizacao) {
    try {
      const response = await ApiServiceBase.put(`/pedidos/${idPedido}`, dadosAtualizacao);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar pedido com ID ${idPedido}:`, error);
      throw error;
    }
  },

  /**
   * Deleta um pedido existente pelo seu ID.
   * @param {number} idPedido - O ID do pedido a ser deletado.
   * @returns {Promise<object>} A resposta da API.
   */
  async deletarPedido(idPedido) {
    try {
      const response = await ApiServiceBase.delete(`/pedidos/${idPedido}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar pedido com ID ${idPedido}:`, error);
      throw error;
    }
  },

  /**
   * Lista todos os pedidos associados a um quarto específico.
   * @param {string} numQuarto - O número do quarto.
   * @returns {Promise<Array>} Uma lista de pedidos.
   */
  async listarPedidosPorQuarto(numQuarto) {
    try {
      const response = await ApiServiceBase.get(`/pedidos/quarto/${numQuarto}`);
      return response.data?.data || [];
    } catch (error) {
      console.error(`Erro ao listar pedidos para o quarto ${numQuarto}:`, error);
      throw error;
    }
  },

  /**
   * Lista todos os pedidos associados a eventos ativos na data atual.
   * @returns {Promise<Array>} Uma lista de pedidos de eventos ativos.
   */
  async listarPedidosDeEventosAtivos() {
    try {
      const response = await ApiServiceBase.get('/pedidos/eventos/ativos');
      return response.data || [];
    } catch (error) {
      console.error('Erro ao listar pedidos de eventos ativos:', error);
      throw error;
    }
  },

  /**
   * Gera um relatório detalhado para um evento específico.
   * @param {number} idEvento - O ID do evento.
   * @returns {Promise<object>} O relatório do evento.
   */
  async gerarRelatorioGeralEvento(idEvento) {
    try {
      const response = await ApiServiceBase.get(`/pedidos/relatorio/${idEvento}`);
      return response.data?.data || {};
    } catch (error) {
      console.error(`Erro ao gerar relatório para o evento ${idEvento}:`, error);
      throw error;
    }
  },

  /**
   * Lista o histórico de todos os pedidos com paginação.
   * @param {object} params - { page, limit }
   * @returns {Promise<object>} Um objeto com os pedidos e informações de paginação.
   */
  async listarHistorico(params) {
    try {
      const response = await ApiServiceBase.get('/pedidos/historico', { params });
      return response?.data?.data || { pedidos: [], paginacao: { total_paginas: 0 } };
    } catch (error) {
      console.error('Erro ao listar histórico de pedidos:', error);
      throw error;
    }
  },

  /**
   * Lista os pedidos feitos na data atual.
   * @returns {Promise<Array>} Uma lista de pedidos.
   */
  async listarPedidosDeHoje() {
    try {
      const response = await ApiServiceBase.get('/pedidos/hoje');
      return response?.data?.data || [];
    } catch (error) {
      console.error('Erro ao listar pedidos de hoje:', error);
      throw error;
    }
  },
};

export default PedidoService;