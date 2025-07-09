import { defineStore } from 'pinia';
import { useToast } from 'vue-toastification';
import router from '@/router';
import AuthService from '@/services/AuthService';
import AdministradorLoginService from '@/services/AdministradorLoginService';
import HospedeService from '@/services/HospedeService';

const toast = useToast();

/**
 * Store para gerenciamento de estado de autenticação.
 * Controla o usuário logado, seu tipo (admin/guest) e o estado de carregamento da autenticação.
 */
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isLoading: true,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    userRole: (state) => state.user?.tipo || null,
    isAdmin: (state) => state.user?.tipo === 'admin',
    isGuest: (state) => state.user?.tipo === 'guest',
  },

  actions: {
    /**
     * Define os dados do usuário no estado, normalizando o tipo.
     * @param {object|null} userData - Os dados do usuário ou nulo para limpar.
     */
    async setUser(userData) {
      if (userData) {
        if (userData.tipo === 'administrador') userData.tipo = 'admin';
        if (userData.tipo === 'hospede') userData.tipo = 'guest';
      }
      this.user = userData;
    },

    /**
     * Realiza o login do administrador.
     * @param {object} credentials - { usuario, senha }.
     */
    async loginAdmin(credentials) {
      try {
        this.user = null;
        const responseData = await AdministradorLoginService.login(credentials.usuario, credentials.senha);
        let userInfo = responseData.data.usuario;
        if (userInfo) {
          userInfo = { ...userInfo, tipo: 'administrador' };
          await this.setUser(userInfo);
        } else {
          throw new Error("Dados do utilizador não encontrados na resposta do login.");
        }
      } catch (error) {
        toast.error('Credenciais inválidas. Verifique seus dados e tente novamente.');
        throw error;
      }
    },

    /**
     * Realiza o login do hóspede.
     * @param {object} credentials - { num_quarto, telef_hospede }.
     * @returns {Promise<object>} Os dados do usuário logado.
     */
    async loginGuest(credentials) {
      try {
        this.user = null;
        const response = await HospedeService.login(credentials.num_quarto, credentials.telef_hospede);
        const guestData = response.data;

        if (guestData && guestData.usuario) {
          const userObject = {
            nome: guestData.usuario,
            id_quarto: guestData.id_quarto,
            num_quarto: guestData.num_quarto,
            tipo: 'hospede'
          };
          await this.setUser(userObject);
          return userObject;
        } else {
          throw new Error("Resposta de login inválida do servidor.");
        }
      } catch (error) {
        const errorMessage = error.message || 'Credenciais inválidas. Verifique o número do quarto e tente novamente.';
        toast.error(errorMessage);
        throw new Error(errorMessage); // Lança o erro para o componente de login
      }
    },
    
    /**
     * Realiza o logout do usuário, limpando o estado e o cookie.
     */
    async logout() {
      const redirectTo = this.isAdmin ? 'AdminLogin' : 'HospedeLogin';
      try {
        await AuthService.logout();
      } catch (error) {
        // O erro é ignorado pois o resultado final (deslogado) é o mesmo.
      } finally {
        this.user = null;
        document.cookie = 'jwt_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        router.push({ name: redirectTo });
      }
    },

    /**
     * Verifica a validade do token de autenticação e a consistência dos dados do usuário.
     * Se os dados do token de um hóspede não corresponderem aos dados da sessão, força o logout.
     * @param {object} route - A rota de destino (opcional).
     */
    async checkAuth(route) {
      try {
        const userInfoFromToken = await AuthService.getAuthenticatedUser(route);

        if (userInfoFromToken) {
          if (userInfoFromToken.tipo === 'guest') {
            const currentUser = this.user;
            
            const nameMatches = currentUser.nome === userInfoFromToken.nome;
            const roomMatches = String(currentUser.num_quarto) === String(userInfoFromToken.num_quarto);

            if (!nameMatches || !roomMatches) {
              toast.error('Inconsistência nos dados da sessão. Por favor, faça login novamente.');
              await this.logout();
              return;
            }
          }
        } else {
          this.user = null;
        }
      } catch (error) {
        this.user = null;
      } finally {
        this.isLoading = false;
      }
    },
  },
});