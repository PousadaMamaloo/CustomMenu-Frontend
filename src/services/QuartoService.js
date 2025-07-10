import ApiServiceBase from './ApiServices';

/**
 * Serviço para gerenciar as operações da API relacionadas a Quartos.
 */
const QuartoService = {
  /**
   * Cria um novo quarto.
   * @param {object} dadosQuarto - Dados do quarto a ser criado.
   * @returns {Promise<object>} O quarto criado.
   */
  async criarQuarto(dadosQuarto) {
    const response = await ApiServiceBase.post('/quartos', dadosQuarto);
    if (response && response.quarto) return response.quarto;
    if (response && response.data && response.data.quarto) return response.data.quarto;
    return response;
  },

  /**
   * Atualiza um quarto pelo seu número.
   * @param {string|number} numeroQuarto - O número do quarto.
   * @param {object} dadosAtualizacao - Os dados a serem atualizados.
   * @returns {Promise<object>} A resposta da API.
   */
  async atualizarQuarto(numeroQuarto, dadosAtualizacao) {
    return await ApiServiceBase.put(`/quartos/${numeroQuarto}`, dadosAtualizacao);
  },
    
  /**
   * Deleta um quarto pelo seu número.
   * @param {string|number} numeroQuarto - O número do quarto.
   * @returns {Promise<object>} A resposta da API.
   */
  async deletarQuarto(numeroQuarto) {
    return await ApiServiceBase.delete(`/quartos/${numeroQuarto}`);
  },

  /**
   * Lista todos os quartos existentes.
   * @returns {Promise<Array>} Uma lista de quartos.
   */
  async listarQuartos() {
    const response = await ApiServiceBase.get('/quartos/');
    if (Array.isArray(response)) return response;
    if (response && Array.isArray(response.data)) return response.data;
    return [];
  },

  /**
   * Busca um quarto pelo seu número.
   * @param {string|number} numeroQuarto - O número do quarto.
   * @returns {Promise<object>} O quarto encontrado.
   */
  async buscarQuartoPorNumero(numeroQuarto) {
    return await ApiServiceBase.get(`/quartos/${numeroQuarto}`);
  }
};

export default QuartoService;