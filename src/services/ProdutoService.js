import ApiServiceBase from './ApiServices';

/**
 * Service para gerenciar as operações da API relacionadas a Itens/Produtos.
 */
const ProdutoService = {
  /**
   * Cria um novo item (produto) no sistema.
   * @param {object} dadosProduto - Os dados do produto a ser criado.
   * @param {string} dadosProduto.nome_item - Nome do item.
   * @param {string} dadosProduto.desc_item - Descrição do item.
   * @param {string} dadosProduto.foto_item - URL da foto do item.
   * @param {string} dadosProduto.categ_item - Categoria do item.
   * @param {number} dadosProduto.qntd_max_hospede - Quantidade máxima por hóspede.
   * @param {number} dadosProduto.valor_item - Valor do item.
   * @returns {Promise<object>} Uma promessa que resolve para a resposta da API contendo o item criado.
   */
  async criarProduto(dadosProduto) {
    return await ApiServiceBase.post('/itens/criar', dadosProduto);
  },

  /**
   * Lista todos os produtos (itens) do cardápio.
   * @returns {Promise<Array>} Uma promessa que resolve para a lista de produtos.
   */
  async listarTodosProdutos() {
    const response = await ApiServiceBase.get('/itens/listar');
    // A API retorna um objeto { status, data, message, errors }
    // A lista de itens está na propriedade 'data'.
    if (response && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  },

  /**
   * Atualiza um item (produto) existente.
   * @param {number} idProduto - O ID do produto a ser atualizado.
   * @param {object} dadosAtualizacao - Os dados a serem atualizados.
   * @returns {Promise<object>} A resposta da API.
   */
  async atualizarProduto(idProduto, dadosAtualizacao) {
    return await ApiServiceBase.put(`/itens/atualizar/${idProduto}`, dadosAtualizacao);
  },

  /**
   * Exclui um item (produto) existente pelo seu ID.
   * @param {number} idProduto - O ID do produto a ser excluído.
   * @returns {Promise<object>} A resposta da API.
   */
  async deletarProduto(idProduto) {
    return await ApiServiceBase.delete(`/itens/excluir/${idProduto}`);
  },

  /**
   * Lista todas as categorias únicas de itens.
   * @returns {Promise<Array<string>>} Uma promessa que resolve para a lista de categorias.
   */
  async listarCategorias() {
    const response = await ApiServiceBase.get('/itens/categorias');
    // A API retorna um objeto { status, data, message, errors }
    // A lista de categorias está na propriedade 'data'.
    if (response && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  }
};

export default ProdutoService;