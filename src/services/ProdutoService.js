import ApiServiceBase from './ApiServices';

/**
 * Service para gerenciar as operações da API relacionadas a Itens/Produtos.
 * Cada método propaga erros para serem tratados pela camada de UI (componentes).
 */
const ProdutoService = {
  /**
   * Cria um novo item (produto) no sistema.
   * @param {object} dadosProduto - Os dados do produto a ser criado.
   * @returns {Promise<object>} A resposta da API.
   * @throws {Error} Lança um erro se a requisição falhar.
   */
  async criarProduto(dadosProduto) {
    try {
      return await ApiServiceBase.post('/itens/criar', dadosProduto);
    } catch (error) {
      throw error; // Propaga o erro para o componente
    }
  },

  /**
   * Lista todos os produtos (itens) do cardápio.
   * @returns {Promise<Array>} A lista de produtos.
   * @throws {Error} Lança um erro se a requisição falhar.
   */
  async listarTodosProdutos() {
    try {
      const response = await ApiServiceBase.get('/itens/listar');
      if (response && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    } catch (error) {
      throw error; // Propaga o erro para o componente
    }
  },

  /**
   * Obtém os detalhes de um produto específico pelo seu ID.
   * @param {string|number} idProduto - O ID do produto a ser buscado.
   * @returns {Promise<object|undefined>} Os detalhes do produto.
   * @throws {Error} Lança um erro se a requisição falhar.
   */
  async obterProdutoPorId(idProduto) {
    try {
      const produtos = await this.listarTodosProdutos();
      return produtos.find(p => p.id_item == idProduto);
    } catch (error) {
      throw error; // Propaga o erro para o componente
    }
  },

  /**
   * Atualiza um item (produto) existente.
   * @param {number} idProduto - O ID do produto a ser atualizado.
   * @param {object} dadosAtualizacao - Os dados a serem atualizados.
   * @returns {Promise<object>} A resposta da API.
   * @throws {Error} Lança um erro se a requisição falhar.
   */
  async atualizarProduto(idProduto, dadosAtualizacao) {
    try {
      return await ApiServiceBase.put(`/itens/atualizar/${idProduto}`, dadosAtualizacao);
    } catch (error) {
      throw error; // Propaga o erro para o componente
    }
  },

  /**
   * Exclui um item (produto) existente pelo seu ID.
   * @param {number} idProduto - O ID do produto a ser excluído.
   * @returns {Promise<object>} A resposta da API.
   * @throws {Error} Lança um erro se a requisição falhar.
   */
  async deletarProduto(idProduto) {
    try {
      return await ApiServiceBase.delete(`/itens/excluir/${idProduto}`);
    } catch (error) {
      throw error; // Propaga o erro para o componente
    }
  },

  /**
   * Lista todas as categorias únicas de itens.
   * @returns {Promise<Array<string>>} A lista de categorias.
   * @throws {Error} Lança um erro se a requisição falhar.
   */
  async listarCategorias() {
    try {
      const response = await ApiServiceBase.get('/itens/categorias');
      if (response && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    } catch (error) {
      throw error; // Propaga o erro para o componente
    }
  }
};

export default ProdutoService;