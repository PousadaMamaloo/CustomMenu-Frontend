import ApiServiceBase from './ApiServices';

const EventoService = {
  async relatorioItensEventosHoje() {
    try {
      const response = await ApiServiceBase.get('/eventos/hoje');
      // A resposta pode ser { mensagem, data: [...] }
      return response && response.data ? response.data : [];
    } catch (error) {
      console.error('Erro ao buscar relatório de itens dos eventos de hoje:', error);
      throw error;
    }
  },
};

export default EventoService;