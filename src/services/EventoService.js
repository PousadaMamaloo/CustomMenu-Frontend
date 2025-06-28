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
      const eventos = response && response.data ? response.data : [];
      
      // Para cada evento, buscar a quantidade de itens associados
      for (const evento of eventos) {
        try {
          const itensEvento = await this.buscarCardapio(evento.id_evento);
          evento.quantidade_itens = Array.isArray(itensEvento) ? itensEvento.length : 0;
        } catch (error) {
          console.warn(`Erro ao buscar itens do evento ${evento.id_evento}:`, error);
          evento.quantidade_itens = 0;
        }
      }
      
      return eventos;
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

  // Métodos para associar/desassociar itens individuais usando EventoItem
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
      console.error(`Erro ao associar item ${itemId} ao evento ${eventoId}:`, error);
      throw error;
    }
  },

  async desassociarItem(eventoId, itemId) {
    try {
      console.log(`Desvinculando item ${itemId} do evento ${eventoId} usando DELETE /eventos/${eventoId}/itens/${itemId}`);
      
      // Usar a rota DELETE correta conforme documentação
      const response = await ApiServiceBase.delete(`/eventos/${eventoId}/itens/${itemId}`);
      
      console.log('Desvinculação bem-sucedida:', response);
      return response && response.data ? response.data : { mensagem: 'Item desvinculado com sucesso!' };
    } catch (error) {
      console.error(`Erro ao desvincular item ${itemId} do evento ${eventoId}:`, error);
      throw error;
    }
  },

  // Método para listar todas as associações evento-item
  async listarAssociacoes() {
    try {
      const response = await ApiServiceBase.get('/eventoItem/');
      return response && response.data ? response.data : [];
    } catch (error) {
      console.error('Erro ao listar associações evento-item:', error);
      throw error;
    }
  },

  // Método para buscar associações específicas de um evento
  async buscarAssociacoesPorEvento(eventoId) {
    try {
      const todasAssociacoes = await this.listarAssociacoes();
      return todasAssociacoes.filter(assoc => 
        (assoc.eventoId === eventoId || assoc.id_evento === eventoId) && 
        (assoc.disp_item === true || assoc.disp_item === 1)
      );
    } catch (error) {
      console.error(`Erro ao buscar associações do evento ${eventoId}:`, error);
      throw error;
    }
  },
};

export default EventoService;