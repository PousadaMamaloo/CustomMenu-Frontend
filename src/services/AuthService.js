import ApiServiceBase from './ApiServices';
import { useToast } from 'vue-toastification';

const toast = useToast();

const AuthService = {
  /**
   * Realiza o logout do usuário atual no backend.
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      await ApiServiceBase.post('/auth/logout');
    } catch (error) {
      throw error; // Propaga o erro para o store, se necessário
    }
  },

  /**
   * Obtém informações do usuário logado, validando implicitamente o token.
   * Versão com logs detalhados para depuração.
   * @returns {Promise<object|null>} Dados do usuário ou null se não estiver autenticado.
   */
  async getAuthenticatedUser() {
    try {
      const responseData = await ApiServiceBase.get('/auth/validar_token');

      if (responseData && responseData.data && responseData.data.usuario) {
        const tokenUser = responseData.data.usuario;
        let user = {};

        if (tokenUser.role === 'administrador') {
          user.tipo = 'admin';
          user.nome = tokenUser.nome;
        } else if (tokenUser.role === 'hospede') {
          user.tipo = 'guest';
          user.nome = tokenUser.nome;
          user.num_quarto = tokenUser.num_quarto; // num_quarto vem do token
        }

        // Retorna um objeto normalizado para o store comparar
        if (user.tipo) {
          return user;
        }
      }
      
      return null;
    } catch (error) {
      if (error.status === 401) {
        return null;
      }
      return null;
    }
  },
};

export default AuthService;