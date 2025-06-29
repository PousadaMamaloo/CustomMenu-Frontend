import { defineStore } from 'pinia';
import router from '@/router';
import AuthService from '@/services/AuthService';
import AdministradorLoginService from '@/services/AdministradorLoginService';

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
     * Define os dados do usuário no estado, normalizando o seu tipo.
     * @param {object | null} userData - Dados do usuário vindos da API.
     */
    setUser(userData) {
      if (userData?.tipo === 'administrador') {
        userData.tipo = 'admin';
      }
      if (userData?.tipo === 'hospede') {
        userData.tipo = 'guest';
      }
      this.user = userData;
    },

    /**
     * Realiza o login do Administrador.
     * @param {object} credentials - { usuario, senha }
     */
    async loginAdmin(credentials) {
      try {
        // Supondo que a sua versão do ApiServiceBase retorna a resposta completa
        const responseData = await AdministradorLoginService.login(credentials.usuario, credentials.senha);
        
        // A sua lógica de adicionar o tipo manualmente
        let userInfo = responseData.data.usuario; 
        if (userInfo) {
          userInfo = {
            ...userInfo,
            tipo: 'administrador'
          }
          this.setUser(userInfo);
        } else {
          throw new Error("Dados do usuário não encontrados na resposta do login.");
        }
      } catch (error) {
        console.error('Falha na ação de login do admin (store):', error);
        throw error;
      }
    },
    
    /**
     * Limpa o estado e o cookie, depois redireciona.
     */
    async logout() {
      const redirectTo = this.isAdmin ? 'AdminLogin' : 'HospedeLogin';

      try {
        await AuthService.logout();
      } catch (error) {
        console.warn('Erro na chamada de logout do backend, mas o logout no frontend prosseguirá.', error);
      } finally {
        this.user = null;
        document.cookie = 'jwt_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        router.push({ name: redirectTo });
      }
    },

    /**
     * Verifica o token no backend e busca dados do usuário.
     * Esta é a versão corrigida.
     */
    async checkAuth() {
      try {
        const userInfo = await AuthService.getAuthenticatedUser();
        this.setUser(userInfo);
      } catch (error) {
        console.warn('Sessão inválida ou expirada. Limpando estado.');
        this.user = null;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
