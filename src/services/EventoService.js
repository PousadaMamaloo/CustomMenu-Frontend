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
};

export default EventoService;