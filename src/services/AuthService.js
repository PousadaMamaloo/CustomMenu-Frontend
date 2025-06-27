import ApiServiceBase from './ApiServices';

const AuthService = {
  /**
   * Valida o token de autenticação atual no backend.
   * @returns {Promise<boolean>} True se o token for válido, false caso contrário.
   */
  async validarToken() {
    try {
      // Usar a rota correta conforme a documentação da API
      const response = await ApiServiceBase.get('/auth/validar_token');
      return true;
    } catch (error) {
      // Se a API retornar um erro (401, 403, etc.), o token é inválido.
      console.warn('Token inválido ou expirado:', error.response?.status || error.message);
      return false;
    }
  },

  /**
   * Realiza o logout do usuário atual.
   * @returns {Promise<boolean>} True se o logout foi bem-sucedido, false caso contrário.
   */
  async logout() {
    try {
      await ApiServiceBase.post('/auth/logout');
      return true;
    } catch (error) {
      console.warn('Erro ao fazer logout:', error.response?.status || error.message);
      return false;
    }
  },

  /**
   * Obtém informações do usuário logado.
   * @returns {Promise<object|null>} Dados do usuário ou null se não conseguir obter.
   */
  async obterUsuarioLogado() {
    try {
      const response = await ApiServiceBase.get('/auth/validar_token');
      // A resposta contém dados do usuário conforme a documentação
      return response.data?.usuario || null;
    } catch (error) {
      console.warn('Erro ao obter dados do usuário:', error.response?.status || error.message);
      return null;
    }
  }
};

export default AuthService;
