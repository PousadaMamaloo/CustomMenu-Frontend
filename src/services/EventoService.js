import ApiServiceBase from './ApiServices';

const EventoService = {
  async relatorioItensEventosHoje() {
    try {
      const response = await ApiServiceBase.get('/eventos/hoje');
      return response && response.data ? response.data : { mensagem: '', data: [] };
    } catch (error) {
      console.error('Erro ao buscar relatório de itens dos eventos de hoje:', error);
      throw error;
    }
  },

  async listarEventos() {
    try {
      const response = await ApiServiceBase.get('/eventos');
      return response && response.data ? response.data : [];
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      throw error;
    }
  },

  async buscarPorId(id) {
    try {
      const response = await ApiServiceBase.get(`/eventos/${id}`);
      return response && response.data ? response.data : null;
    } catch (error) {
      console.error(`Erro ao buscar evento ${id}:`, error);
      throw error;
    }
  },

  async criar(dadosEvento) {
    try {
      const response = await ApiServiceBase.post('/eventos', dadosEvento);
      return response && response.data ? response.data : null;
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      throw error;
    }
  },

  async atualizar(id, dadosEvento) {
    try {
      const response = await ApiServiceBase.put(`/eventos/${id}`, dadosEvento);
      return response && response.data ? response.data : null;
    } catch (error) {
      console.error(`Erro ao atualizar evento ${id}:`, error);
      throw error;
    }
  },

  async excluir(id) {
    try {
      const response = await ApiServiceBase.delete(`/eventos/${id}`);
      return response && response.data ? response.data : null;
    } catch (error) {
      console.error(`Erro ao excluir evento ${id}:`, error);
      throw error;
    }
  },

  // Métodos para gerenciar cardápios de eventos
  async buscarCardapio(eventoId) {
    try {
      const response = await ApiServiceBase.get(`/eventos/${eventoId}/itens`);
      return response && response.data ? response.data : [];
    } catch (error) {
      console.error(`Erro ao buscar cardápio do evento ${eventoId}:`, error);
      throw error;
    }
  },

  async salvarCardapio(eventoId, itensIds) {
    try {
      const payload = { itensIds: itensIds };
      const response = await ApiServiceBase.post(`/eventos/${eventoId}/itens`, payload);
      return response && response.data ? response.data : null;
    } catch (error) {
      console.error(`Erro ao salvar cardápio do evento ${eventoId}:`, error);
      throw error;
    }
  },

  async removerItemCardapio(eventoId, itemId) {
    try {
      const response = await ApiServiceBase.delete(`/eventos/${eventoId}/itens/${itemId}`);
      return response && response.data ? response.data : null;
    } catch (error) {
      console.error(`Erro ao remover item ${itemId} do cardápio do evento ${eventoId}:`, error);
      throw error;
    }
  },
};

export default EventoService;