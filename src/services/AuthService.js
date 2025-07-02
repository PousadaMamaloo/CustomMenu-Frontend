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

      if (responseData && typeof responseData.data === 'object' && responseData.data.usuario !== null) {
        let user = responseData.data.usuario;

        if (user.role === 'administrador') {
          user.tipo = 'admin';
        } else if (user.role === 'hospede') {
          user.tipo = 'guest';
          user.id_quarto = responseData.data.id_quarto;
          user.num_quarto = responseData.data.num_quarto;
        }

        // Verificação final
        if (user.tipo === 'admin' || user.tipo === 'guest') {
          return user;
        } else {
          return null;
        }
      } else {
        // Não mostrar toast para casos onde simplesmente não há usuário logado
        return null;
      }
    } catch (error) {
      // Não mostrar toast para erro 401 (não autenticado) durante verificação inicial
      if (error.status === 401) {
        return null;
      }
      
      // Mostrar toast apenas para outros tipos de erro
      toast.error('Usuário não validado. Faça login novamente.');
      return null;
    }
  },
};

export default AuthService;