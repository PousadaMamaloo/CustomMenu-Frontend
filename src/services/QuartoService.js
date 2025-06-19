import ApiServiceBase from './ApiServices';

const QuartoService = {
  /**
   * Lista todos os quartos existentes.
   * @returns {Promise<Array>} Lista de quartos.
   */
  async listarQuartos() {
    const response = await ApiServiceBase.get('/quartos/listar');
    // Suporta resposta como array direto ou { data: [...] }
    if (Array.isArray(response)) return response;
    if (response && Array.isArray(response.data)) return response.data;
    return [];
  },

  /**
   * Cria um novo quarto.
   * @param {object} dadosQuarto - { numero, capacidade, disponivel }
   * @returns {Promise<object>} Quarto criado.
   */
  async criarQuarto(dadosQuarto) {
    const response = await ApiServiceBase.post('/quartos/criar', dadosQuarto);
    // Retorna o objeto do quarto criado, se disponível
    if (response && response.quarto) return response.quarto;
    if (response && response.data && response.data.quarto) return response.data.quarto;
    return response;
  },

  /**
   * Busca um quarto pelo número.
   * @param {string|number} numeroQuarto
   * @returns {Promise<object>} Quarto encontrado.
   */
  async buscarQuartoPorNumero(numeroQuarto) {
    return await ApiServiceBase.get(`/quartos/buscar/${numeroQuarto}`);
  },

  /**
   * Atualiza um quarto pelo número.
   * @param {string|number} numeroQuarto
   * @param {object} dadosAtualizacao - { capacidade?, disponivel? }
   * @returns {Promise<object>} Resposta da API.
   */
  async atualizarQuarto(numeroQuarto, dadosAtualizacao) {
    return await ApiServiceBase.put(`/quartos/${numeroQuarto}`, dadosAtualizacao);
  },

  /**
   * Deleta um quarto pelo número.
   * @param {string|number} numeroQuarto
   * @returns {Promise<object>} Resposta da API.
   */
  async deletarQuarto(numeroQuarto) {
    return await ApiServiceBase.delete(`/quartos/${numeroQuarto}`);
  }
};

export default QuartoService;