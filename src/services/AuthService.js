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

        // // Verificação e inferência do tipo (role)
        // if (!user.role) {
        //   const currentPath = window.location.pathname;
        //   console.warn(`[AuthService] 'tipo' do usuário não encontrado. Tentando inferir a partir do URL: ${currentPath}`);
          
        //   if (currentPath.startsWith('/admin')) {
        //     user.tipo = 'administrador';
        //     console.log("[AuthService] URL começa com /admin. 'tipo' definido como 'administrador'.");
        //   } else if (currentPath.startsWith('/hospede')) {
        //     user.tipo = 'hospede';
        //     console.log("[AuthService] URL começa com /hospede. 'tipo' definido como 'hospede'.");
        //   } else {
        //      console.error("[AuthService] Não foi possível inferir o 'tipo' a partir do URL. O URL não corresponde a /admin ou /hospede.");
        //   }
        // }

        if (user.role === 'administrador') {
          user.tipo = 'admin';
        } else if (user.role === 'hospede') {
          user.tipo = 'guest';
        }

        // Verificação final
        if (user.tipo === 'admin' || user.tipo === 'guest') {
          return user;
        } else {
          return null;
        }
      } else {
        toast.warn('[AuthService] Resposta da API não continha um objeto de usuário válido. responseData.usuario:', responseData?.usuario);
        return null;
      }
    } catch (error) {
      toast.error('[AuthService] Erro ao chamar /auth/validar_token:', error);
      return null;
    }
  },
};

export default AuthService;