import ApiServiceBase from './ApiServices';
import { useToast } from 'vue-toastification';

const toast = useToast();

/**
 * Serviço para gerenciar operações de autenticação, como logout e validação de token.
 */
const AuthService = {
  /**
   * Realiza o logout do usuário no backend.
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      await ApiServiceBase.post('/auth/logout');
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtém informações do usuário autenticado validando o token no backend.
   * Normaliza a resposta da API para um formato consistente.
   * @returns {Promise<object|null>} Dados do usuário normalizados ou nulo se não autenticado.
   */
  async getAuthenticatedUser() {
    try {
      const responseData = await ApiServiceBase.get('/auth/validar-token');

      if (responseData && responseData.data && responseData.data.usuario) {
        const tokenUser = responseData.data.usuario;
        let user = {};

        if (tokenUser.role === 'administrador') {
          user.tipo = 'admin';
          user.nome = tokenUser.nome;
        } else if (tokenUser.role === 'hospede') {
          user.tipo = 'guest';
          user.nome = tokenUser.nome;
          user.num_quarto = tokenUser.num_quarto;
        }

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