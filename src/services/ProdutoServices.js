import ApiServiceBase from './ApiServices';

/**
 * Service para gerenciar as operações da API relacionadas a produtos (itens).
 */
const ProdutoService = {
  /**
   * Lista todos os produtos (itens) existentes.
   * @returns {Promise<Array>} Uma promessa que resolve para uma lista de produtos.
   */
  async listarProdutos() {
    return await ApiServiceBase.get('/itens/listar');
  },

  /**
   * Lista todas as categorias de produtos únicas.
   * @returns {Promise<Array<string>>} Uma promessa que resolve para uma lista de nomes de categorias.
   */
  async listarCategorias() {
    return await ApiServiceBase.get('/itens/categorias');
  },

  /**
   * Cria um novo produto (item).
   * @param {object} dadosProduto - Os dados do produto a ser criado.
   * @returns {Promise<object>} O objeto do produto criado.
   */
  async criarProduto(dadosProduto) {
    const response = await ApiServiceBase.post('/itens/criar', dadosProduto);
    // A API retorna { mensagem: "...", item: {...} }, então retornamos o item.
    if (response && response.item) {
      return response.item;
    }
    return response;
  },

  /**
   * Atualiza um produto (item) existente pelo seu ID.
   * @param {number} id - O ID do produto a ser atualizado.
   * @param {object} dadosAtualizacao - Os dados a serem atualizados.
   * @returns {Promise<object>} A resposta da API.
   */
  async atualizarProduto(id, dadosAtualizacao) {
    return await ApiServiceBase.put(`/itens/atualizar/${id}`, dadosAtualizacao);
  },

  /**
   * Exclui um produto (item) pelo seu ID.
   * @param {number} id - O ID do produto a ser excluído.
   * @returns {Promise<object>} A resposta da API.
   */
  async excluirProduto(id) {
    return await ApiServiceBase.delete(`/itens/excluir/${id}`);
  }
};

export default ProdutoService;