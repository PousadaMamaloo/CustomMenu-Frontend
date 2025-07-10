import ApiServiceBase from './ApiServices';
import { useToast } from 'vue-toastification';
const toast = useToast();

/**
 * Serviço para gerenciar as operações da API relacionadas a Eventos e seus Cardápios.
 */
const CardapioService = {

  /**
   * Lista todos os eventos existentes.
   * @returns {Promise<Array>} Uma lista de eventos.
   */
  async listarEventos() {
    return await ApiServiceBase.get('/eventos/');
  },

  /**
   * Cria um novo evento.
   * @param {object} dadosEvento - Dados do evento a ser criado.
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

  /**
   * Lista todos os itens associados a um evento específico.
   * @param {number} eventoId - O ID do evento.
   * @returns {Promise<object>} Os dados completos do evento com seus itens.
   */
  async listarItensPorEvento(eventoId) {
    toast.info('Buscando dados do evento e itens...');

    try {
      const response = await ApiServiceBase.get(`/eventos/${eventoId}/itens`);
      return response;
    } catch (error) {
      toast.error('[CardapioService] Erro ao buscar dados do evento:');
      throw error;
    }
  },

  /**
   * Vincula múltiplos itens a um único evento.
   * @param {number} eventoId - O ID do evento.
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
   * @returns {Promise<Array>} Uma lista de eventos disponíveis.
   */
  async listarEventosParaHospede() {
    try {
      const response = await ApiServiceBase.get('/eventos/disponiveis');
      return response && response.data ? response.data : [];
    } catch (error) {
      toast.error('Erro ao listar eventos para hóspede:');
      return await this.listarEventos();
    }
  },

  /**
   * Obtém um evento específico pelo seu ID.
   * @param {number} eventoId - O ID do evento.
   * @returns {Promise<object>} O evento específico.
   */
  async obterEventoPorId(eventoId) {
    return await ApiServiceBase.get(`/eventos/${eventoId}`);
  }
};

export default CardapioService;