import ApiServiceBase from './ApiServices';
import { useToast } from 'vue-toastification';

const toast = useToast();

const PedidoHospedeService = {
  /**
   * Cria um novo pedido para o hóspede logado.
   */
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
   * Atualiza um pedido existente.
   */
  async atualizarPedido(idPedido, payload) {
    try {
      return await ApiServiceBase.put(`/pedidos/${idPedido}`, payload);
    } catch (error) {
      console.error(`[PedidoHospedeService] Erro ao atualizar pedido ${idPedido}:`, error);
      toast.error(error.message || 'Não foi possível atualizar o seu pedido.');
      throw error;
    }
  },

  /**
   * Deleta um pedido existente.
   */
  async excluirPedido(idPedido) {
    try {
      return await ApiServiceBase.delete(`/pedidos/${idPedido}`);
    } catch (error) {
      console.error(`[PedidoHospedeService] Erro ao excluir pedido ${idPedido}:`, error);
      toast.error(error.message || 'Não foi possível excluir o seu pedido.');
      throw error;
    }
  },

  /**
   * @param {number} idEvento - O ID do evento.
   * @param {string} numQuarto - O número do quarto.
   * @param {string} dataPedido - A data no formato YYYY-MM-DD.
   * @returns {Promise<object|null>} Os dados do pedido ou null se não for encontrado.
   */
  async obterPedidoDoDia(idEvento, numQuarto, dataPedido) {
    try {
      const response = await ApiServiceBase.get(`/pedidos/evento/${idEvento}/quarto/${numQuarto}/data/${dataPedido}`);
      return response?.data || null;
    } catch (error) {
      console.warn(`[PedidoHospedeService] Erro ao buscar pedido do dia. Pode ser que não exista um.`, error);
      return null;
    }
  }
};

export default PedidoHospedeService;
