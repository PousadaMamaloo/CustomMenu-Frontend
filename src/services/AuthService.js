import ApiServiceBase from './ApiServices';

const AuthService = {
  /**
   * Realiza o logout do usuário atual no backend.
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      await ApiServiceBase.post('/auth/logout');
    } catch (error) {
      console.warn('Erro ao fazer logout no backend:', error.response?.status || error.message);
      throw error;
    }
  },

  /**
   * Obtém informações do usuário logado, validando implicitamente o token.
   * @returns {Promise<object|null>} Dados do usuário ou null se não estiver autenticado.
   */
  async getAuthenticatedUser() {
    try {
      const response = await ApiServiceBase.get('/auth/validar_token');
      
      if (response.data && response.data.usuario) {
        console.log('Usuário autenticado:', response.data);
        const user = response.data.usuario;

        if (user.tipo === 'administrador') {
            user.tipo = 'admin';
        }
        if (user.tipo === 'hospede') {
            user.tipo = 'guest';
        }
        return user;
      }
      return null;

    } catch (error) {
      console.warn('Não foi possível obter o usuário autenticado:', error.response?.status || error.message);
      return null;
    }
  },
};

export default AuthService;
