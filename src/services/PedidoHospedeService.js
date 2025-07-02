import ApiServiceBase from './ApiServices';
import { useToast } from 'vue-toastification';

const toast = useToast();

const PedidoHospedeService = {
  async criarPedido(dadosPedido) {
    try {
      return await ApiServiceBase.post('/pedidos', dadosPedido);
    } catch (error) {
      console.error('[PedidoHospedeService] Erro ao criar pedido:', error);
      toast.error(error.message || 'Não foi possível criar o seu pedido.');
      throw error;
    }
  },

  /**
   * @param {number} idPedido - O ID do pedido a ser atualizado.
   * @param {object} payload - Os dados de atualização.
   * @returns {Promise<object>} A resposta da API.
   */
  async atualizarPedido(idPedido, payload) {
    try {
      // Envia o payload diretamente, que agora contém o horário e os itens.
      return await ApiServiceBase.put(`/pedidos/${idPedido}`, payload);
    } catch (error) {
      console.error(`[PedidoHospedeService] Erro ao atualizar pedido ${idPedido}:`, error);
      toast.error(error.message || 'Não foi possível atualizar o seu pedido.');
      throw error;
    }
  },

  async obterPedidoPorId(idPedido) {
    try {
      const response = await ApiServiceBase.get(`/pedidos/${idPedido}`);
      // A API retorna um objeto com a chave 'data' que contém o pedido
      return response?.data || null;
    } catch (error) {
      console.error(`[PedidoHospedeService] Erro ao obter pedido ${idPedido}:`, error);
      return null;
    }
  },

  async listarPedidosPorQuarto(numQuarto) {
    try {
      const response = await ApiServiceBase.get(`/pedidos/quarto/${numQuarto}`);
      // A API retorna um objeto com a chave 'data' que contém a lista
      return response?.data || [];
    } catch (error) {
      console.warn(`[PedidoHospedeService] Nenhum pedido encontrado para o quarto ${numQuarto} ou erro na busca.`);
      return [];
    }
  },

  async excluirPedido(idPedido) {
    try {
      return await ApiServiceBase.delete(`/pedidos/${idPedido}`);
    } catch (error) {
      console.error(`[PedidoHospedeService] Erro ao excluir pedido ${idPedido}:`, error);
      toast.error(error.message || 'Não foi possível excluir o seu pedido.');
      throw error;
    }
  }
};

export default PedidoHospedeService;
