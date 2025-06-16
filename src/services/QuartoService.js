import ApiServiceBase from './ApiServices';

const QuartoService = {
  /**
   * Lista todos os quartos existentes.
   * @returns {Promise<Array<object>>} Uma promessa que resolve para uma lista de quartos.
   * @throws {object} O erro da API ou um erro genérico, conforme tratado pelo ApiServiceBase.
   */
  async listarQuartos() {
    try {
      // ApiServiceBase.get('/quartos/listar') will return the entire response object
      // as processed by ApiServiceBase's handleResponse.
      // If handleResponse returns response.data, and your API wraps its list in another "data" field,
      // you need to access it.
      const response = await ApiServiceBase.get('/quartos/listar');
      
      // Assuming ApiServiceBase.get already returns the body of the HTTP response
      // (i.e., the object { status, data, message, errors })
      // And the actual list of rooms is in response.data
      if (response && response.data && Array.isArray(response.data)) {
        return response.data; // Access the nested 'data' array
      } else {
        // This case handles if the structure is not as expected,
        // or if ApiServiceBase returns something different.
        console.warn('Resposta da API de listarQuartos não continha um array "data" esperado:', response);
        return []; // Return empty array or throw an error
      }
    } catch (error) {
      console.error('Erro ao listar quartos (QuartoService):', error);
      throw error; // Re-throw for the component
    }
  },

  // ... (criarQuarto, buscarQuartoPorNumero, atualizarQuarto, deletarQuarto methods remain the same for now)
  // You'll need to adjust them similarly if their API responses are also wrapped in a "data" field.
  // For example, criarQuarto might expect response.quarto from the API documentation,
  // but if your actual API wraps it like { data: { mensagem: "...", quarto: {...} } },
  // then you'd need to access response.data.quarto.

  /**
   * Cria um novo quarto.
   * @param {object} dadosQuarto - Os dados do quarto a ser criado.
   * @returns {Promise<object>} A resposta da API, especificamente o objeto do quarto criado.
   */
  async criarQuarto(dadosQuarto) {
    try {
      const response = await ApiServiceBase.post('/quartos/criar', dadosQuarto);
      // API doc: { "mensagem": "Quarto criado com sucesso!", "quarto": { ... } }
      // If your actual API wraps this in a 'data' field: { data: { mensagem: "...", quarto: {...} } }
      // Adjust accordingly. Assuming ApiServiceBase returns the body directly:
      if (response && response.quarto) {
        return response; // Or response.quarto if you only want the room object
      }
      console.warn('Resposta da API de criarQuarto não continha um objeto "quarto" esperado:', response);
      throw new Error(response?.message || "Falha ao criar quarto, resposta inesperada.");
    } catch (error) {
      console.error('Erro ao criar quarto (QuartoService):', error);
      throw error;
    }
  },
  // ... other methods ...
};

export default QuartoService;