import ApiServiceBase from './ApiServices';

import { useToast } from 'vue-toastification';

const toast = useToast();

/**
 * Serviço para gerenciar as operações da API relacionadas a Eventos.
 */
const EventoService = {
  /**
   * Busca o relatório de itens para os eventos de hoje.
   * @returns {Promise<object>}
   */
  async relatorioItensEventosHoje() {
    try {
      const response = await ApiServiceBase.get('/eventos/hoje');
      return response && response.data ? response.data : { mensagem: '', data: [] };
    } catch (error) {
      toast.error('Erro ao buscar relatório de itens dos eventos de hoje');
      throw error;
    }
  },

  /**
   * Lista todos os eventos e busca a quantidade de itens de cada um.
   * @returns {Promise<Array>} Uma lista de eventos com a contagem de itens.
   */
  async listarEventos() {
    try {
      const response = await ApiServiceBase.get('/eventos');
      const eventos = response && response.data ? response.data : [];
      
      // Para cada evento, buscar a quantidade de itens associados
      for (const evento of eventos) {
        try {
          const itensEvento = await this.buscarCardapio(evento.id_evento);
          evento.quantidade_itens = Array.isArray(itensEvento) ? itensEvento.length : 0;
        } catch (error) {
          toast.error(`Erro ao buscar itens do evento`);
          evento.quantidade_itens = 0;
        }
      }
      
      return eventos;
    } catch (error) {
      toast.error('Erro ao buscar eventos:');
      throw error;
    }
  },

  /**
   * Busca um evento específico pelo ID.
   * @param {number} id - O ID do evento.
   * @returns {Promise<object|null>} O objeto do evento ou nulo.
   */
  async buscarPorId(id) {
    try {
      const response = await ApiServiceBase.get(`/eventos/${id}`);
      return response && response.data ? response.data : null;
    } catch (error) {
      toast.error(`Erro ao buscar evento`);
      throw error;
    }
  },

  /**
   * Cria um novo evento.
   * @param {object} dadosEvento - Os dados para o novo evento.
   * @returns {Promise<object|null>} O evento criado ou nulo.
   */
  async criar(dadosEvento) {
    try {
      const response = await ApiServiceBase.post('/eventos', dadosEvento);
      return response && response.data ? response.data : null;
    } catch (error) {
      toast.error('Erro ao criar evento');
      throw error;
    }
  },

  /**
   * Atualiza um evento existente.
   * @param {number} id - O ID do evento a ser atualizado.
   * @param {object} dadosEvento - Os novos dados do evento.
   * @returns {Promise<object|null>} O evento atualizado ou nulo.
   */
  async atualizar(id, dadosEvento) {
    try {
      const response = await ApiServiceBase.put(`/eventos/${id}`, dadosEvento);
      return response && response.data ? response.data : null;
    } catch (error) {
      toast.error(`Erro ao atualizar evento`);
      throw error;
    }
  },

  /**
   * Exclui um evento.
   * @param {number} id - O ID do evento a ser excluído.
   * @returns {Promise<object|null>} A resposta da API ou nulo.
   */
  async excluir(id) {
    try {
      const response = await ApiServiceBase.delete(`/eventos/${id}`);
      return response && response.data ? response.data : null;
    } catch (error) {
      toast.error(`Erro ao excluir evento`);
      throw error;
    }
  },

  /**
   * Busca o cardápio (lista de itens) de um evento.
   * @param {number} eventoId - O ID do evento.
   * @returns {Promise<Array>} Uma lista de itens do cardápio.
   */
  async buscarCardapio(eventoId) {
    try {
      const response = await ApiServiceBase.get(`/eventos/${eventoId}/itens`);
      return response && response.data ? response.data : [];
    } catch (error) {
      toast.error(`Erro ao buscar cardápio do evento`);
      throw error;
    }
  },

  /**
   * Salva o cardápio de um evento com uma lista de IDs de itens.
   * @param {number} eventoId - O ID do evento.
   * @param {Array<number>} itensIds - A lista de IDs dos itens.
   * @returns {Promise<object|null>} A resposta da API ou nulo.
   */
  async salvarCardapio(eventoId, itensIds) {
    try {
      const payload = { itensIds: itensIds };
      const response = await ApiServiceBase.post(`/eventos/${eventoId}/itens`, payload);
      return response && response.data ? response.data : null;
    } catch (error) {
      toast.error(`Erro ao salvar cardápio do evento`);
      throw error;
    }
  },

  /**
   * Remove um item do cardápio de um evento.
   * @param {number} eventoId - O ID do evento.
   * @param {number} itemId - O ID do item a ser removido.
   * @returns {Promise<object|null>} A resposta da API ou nulo.
   */
  async removerItemCardapio(eventoId, itemId) {
    try {
      const response = await ApiServiceBase.delete(`/eventos/${eventoId}/itens/${itemId}`);
      return response && response.data ? response.data : null;
    } catch (error) {
      toast.error(`Erro ao remover item ${itemId} do cardápio do evento`);
      throw error;
    }
  },

  /**
   * Associa um item a um evento.
   * @param {number} eventoId - O ID do evento.
   * @param {number} itemId - O ID do item.
   * @returns {Promise<object|null>} A resposta da API ou nulo.
   */
  async associarItem(eventoId, itemId) {
    try {
      const payload = { 
        id_evento: eventoId, 
        id_item: itemId,
        disp_item: true // Assumindo que o item estará disponível ao ser associado
      };
      const response = await ApiServiceBase.post('/eventoItem/', payload);
      return response && response.data ? response.data : null;
    } catch (error) {
      toast.error(`Erro ao associar item ${itemId} ao evento`);
      throw error;
    }
  },

  /**
   * Desassocia um item de um evento.
   * @param {number} eventoId - O ID do evento.
   * @param {number} itemId - O ID do item.
   * @returns {Promise<object>} A resposta da API.
   */
  async desassociarItem(eventoId, itemId) {
    try {
      const response = await ApiServiceBase.delete(`/eventos/${eventoId}/itens/${itemId}`);

      toast.success('Desvinculação bem-sucedida:');
      return response && response.data ? response.data : { mensagem: 'Item desvinculado com sucesso!' };
    } catch (error) {
      toast.error(`Erro ao desvincular item ${itemId} do evento ${eventoId}:`);
      throw error;
    }
  },

  /**
   * Lista todas as associações entre eventos e itens.
   * @returns {Promise<Array>} Uma lista de associações.
   */
  async listarAssociacoes() {
    try {
      const response = await ApiServiceBase.get('/eventoItem/');
      return response && response.data ? response.data : [];
    } catch (error) {
      toast.error('Erro ao listar associações evento-item:');
      throw error;
    }
  },

  /**
   * Busca as associações de um evento específico que estão disponíveis.
   * @param {number} eventoId - O ID do evento.
   * @returns {Promise<Array>} Uma lista de associações disponíveis para o evento.
   */
  async buscarAssociacoesPorEvento(eventoId) {
    try {
      const todasAssociacoes = await this.listarAssociacoes();
      return todasAssociacoes.filter(assoc => 
        (assoc.eventoId === eventoId || assoc.id_evento === eventoId) && 
        (assoc.disp_item === true || assoc.disp_item === 1)
      );
    } catch (error) {
      toast.error(`Erro ao buscar associações do evento ${eventoId}:`);
      throw error;
    }
  },
};

export default EventoService;