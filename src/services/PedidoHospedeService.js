import ApiServiceBase from './ApiServices';
import { useToast } from 'vue-toastification';

const toast = useToast();

/**
 * Serviço para gerenciar as operações de Pedidos realizadas pelo Hóspede.
 */
const PedidoHospedeService = {
  /**
   * Cria um novo pedido para o hóspede logado.
   * @param {object} dadosPedido - Os dados do pedido.
   * @returns {Promise<object>} A resposta da API.
   */
  async criarPedido(dadosPedido) {
    try {
      return await ApiServiceBase.post('/pedidos', dadosPedido);
    } catch (error) {
      toast.error(error.message || 'Não foi possível criar o seu pedido.');
      throw error;
    }
  },

  /**
   * Atualiza um pedido existente.
   * @param {number} idPedido - O ID do pedido a ser atualizado.
   * @param {object} payload - Os novos dados do pedido.
   * @returns {Promise<object>} A resposta da API.
   */
  async atualizarPedido(idPedido, payload) {
    try {
      return await ApiServiceBase.put(`/pedidos/${idPedido}`, payload);
    } catch (error) {
      toast.error(error.message || 'Não foi possível atualizar o seu pedido.');
      throw error;
    }
  },

  /**
   * Deleta um pedido existente.
   * @param {number} idPedido - O ID do pedido a ser deletado.
   * @returns {Promise<object>} A resposta da API.
   */
  async excluirPedido(idPedido) {
    try {
      return await ApiServiceBase.delete(`/pedidos/${idPedido}`);
    } catch (error) {
      toast.error(error.message || 'Não foi possível excluir o seu pedido.');
      throw error;
    }
  },

  /**
   * Busca um pedido de um quarto para um evento em uma data específica.
   * @param {number} idEvento - O ID do evento.
   * @param {string} numQuarto - O número do quarto.
   * @param {string} dataPedido - A data no formato YYYY-MM-DD.
   * @returns {Promise<object|null>} Os dados do pedido ou nulo se não for encontrado.
   */
  async obterPedidoDoDia(idEvento, numQuarto, dataPedido) {
    try {
      const response = await ApiServiceBase.get(`/pedidos/${idEvento}/${numQuarto}/${dataPedido}`);
      return response?.data || null;
    } catch (error) {
      return null;
    }
  }
};

export default PedidoHospedeService;
