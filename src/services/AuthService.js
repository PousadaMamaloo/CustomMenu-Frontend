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
      throw error; // Propaga o erro para o store, se necessário
    }
  },

  /**
   * Obtém informações do usuário logado, validando implicitamente o token.
   * Versão com logs detalhados para depuração.
   * @returns {Promise<object|null>} Dados do usuário ou null se não estiver autenticado.
   */
  async getAuthenticatedUser() {
    console.log("[AuthService] Iniciando checkAuth - Verificando sessão...");
    try {
      const responseData = await ApiServiceBase.get('/auth/validar_token');
      console.log('[AuthService] Resposta de /auth/validar_token:', responseData);

      if (responseData && typeof responseData.data === 'object' && responseData.usuario !== null) {
        let user = responseData.data;
        console.log('[AuthService] Usuário encontrado na resposta:', user);

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
        console.log('[AuthService] Usuário após normalização:', user);

        // Verificação final
        if (user.tipo === 'admin' || user.tipo === 'guest') {
          console.log('[AuthService] Usuário validado com sucesso. Retornando dados do usuário.');
          return user;
        } else {
          console.error(`[AuthService] Falha na validação final. 'tipo' inválido: '${user.tipo}'. Retornando null.`);
          return null;
        }
      } else {
        console.warn('[AuthService] Resposta da API não continha um objeto de usuário válido. responseData.usuario:', responseData?.usuario);
        return null;
      }
    } catch (error) {
      console.error('[AuthService] Erro ao chamar /auth/validar_token:', error);
      return null;
    }
  },
};

export default AuthService;