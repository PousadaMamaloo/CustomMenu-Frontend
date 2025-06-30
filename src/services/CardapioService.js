import ApiServiceBase from './ApiServices';

/**
 * Service para gerenciar as operações da API relacionadas a Eventos e seus Cardápios (Itens).
 * Nota: Este serviço implementa as rotas de '/api/eventos'.
 */
const CardapioService = {
  // --- Métodos de Eventos ---

  /**
   * Lista todos os eventos existentes.
   * @returns {Promise<Array>} Uma promessa que resolve para uma lista de eventos.
   */
  async listarEventos() {
    return await ApiServiceBase.get('/eventos/');
  },

  /**
   * Cria um novo evento.
   * @param {object} dadosEvento - { nome_evento, desc_evento, horarios, sts_evento }
   * @returns {Promise<object>} O objeto do evento criado.
   */
  async criarEvento(dadosEvento) {
    const response = await ApiServiceBase.post('/eventos/', dadosEvento);
    if (response && response.evento) {
      return response.evento;
    }
    return response;
  },

  /**
   * Atualiza um evento existente pelo seu ID.
   * @param {number} eventoId - O ID do evento a ser atualizado.
   * @param {object} dadosAtualizacao - Os dados a serem atualizados.
   * @returns {Promise<object>} A resposta da API.
   */
  async atualizarEvento(eventoId, dadosAtualizacao) {
    return await ApiServiceBase.put(`/eventos/${eventoId}`, dadosAtualizacao);
  },

  /**
   * Exclui um evento existente pelo seu ID.
   * @param {number} eventoId - O ID do evento a ser excluído.
   * @returns {Promise<object>} A resposta da API.
   */
  async excluirEvento(eventoId) {
    return await ApiServiceBase.delete(`/eventos/${eventoId}`);
  },

  // --- Métodos de Itens do Evento (Cardápio) ---

  /**
   * Lista todos os itens associados a um evento específico.
   * @param {number} eventoId - O ID do evento.
   * @returns {Promise<object>} Uma promessa que resolve para os dados completos do evento com itens.
   */
  async listarItensPorEvento(eventoId) {
    console.log('[CardapioService] Buscando dados do evento e itens para ID:', eventoId);
    console.log('[CardapioService] URL da requisição:', `/eventoItem/${eventoId}`);
    
    try {
      const response = await ApiServiceBase.get(`/eventoItem/${eventoId}`);
      console.log('[CardapioService] Dados completos recebidos do servidor:', response);
      
      // Retorna os dados completos que incluem evento e itens
      return response;
    } catch (error) {
      console.error('[CardapioService] Erro ao buscar dados do evento:', error);
      console.error('[CardapioService] Detalhes do erro:', {
        status: error.status,
        message: error.message,
        data: error.data
      });
      throw error;
    }
  },

  /**
   * Vincula múltiplos itens a um único evento, criando/atualizando o cardápio.
   * Realiza uma única requisição POST com todos os IDs dos itens.
   * @param {number} eventoId - O ID do evento ao qual os itens serão vinculados.
   * @param {Array<number>} itemIds - Um array com os IDs dos itens a serem vinculados.
   * @returns {Promise<object>} A resposta da API.
   */
  async vincularItensAEvento(eventoId, itemIds) {
    if (!itemIds || itemIds.length === 0) {
      throw new Error("A lista de itens para vinculação não pode estar vazia.");
    }
    const payload = { itensIds: itemIds };
    return await ApiServiceBase.post(`/eventos/${eventoId}/itens`, payload);
  },

  /**
   * Desvincula um item de um evento específico.
   * @param {number} eventoId - O ID do evento.
   * @param {number} itemId - O ID do item a ser desvinculado.
   * @returns {Promise<object>} A resposta da API.
   */
  async desvincularItemDeEvento(eventoId, itemId) {
    return await ApiServiceBase.delete(`/eventos/${eventoId}/itens/${itemId}`);
  },

  /**
   * Lista eventos disponíveis para o hóspede logado.
   * @returns {Promise<Array>} Uma promessa que resolve para uma lista de eventos disponíveis.
   */
  async listarEventosParaHospede() {
    try {
      const response = await ApiServiceBase.get('/eventos/hospede');
      return response && response.data ? response.data : [];
    } catch (error) {
      console.error('Erro ao buscar eventos para hóspede:', error);
      // Se não houver endpoint específico, usar a lista geral de eventos
      return await this.listarEventos();
    }
  },

  /**
   * Obtém um evento específico pelo seu ID.
   * @param {number} eventoId - O ID do evento a ser obtido.
   * @returns {Promise<object>} Uma promessa que resolve para o evento específico.
   */
  async obterEventoPorId(eventoId) {
    return await ApiServiceBase.get(`/eventos/${eventoId}`);
  }
};

export default CardapioService;