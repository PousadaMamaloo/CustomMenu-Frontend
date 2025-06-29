import { defineStore } from 'pinia';
import router from '@/router';
import AuthService from '@/services/AuthService';
import AdministradorLoginService from '@/services/AdministradorLoginService';
import HospedeService from '@/services/HospedeService';

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
    setUser(userData) {
      if (userData) {
        if (userData.tipo === 'administrador') userData.tipo = 'admin';
        if (userData.tipo === 'hospede') userData.tipo = 'guest';
      }
      this.user = userData;
    },

    async loginAdmin(credentials) {
      try {
        const responseData = await AdministradorLoginService.login(credentials.usuario, credentials.senha);
        let userInfo = responseData.data.usuario;
        if (userInfo) {
          userInfo = { ...userInfo, tipo: 'administrador' };
          this.setUser(userInfo);
        } else {
          throw new Error("Dados do utilizador não encontrados na resposta do login.");
        }
      } catch (error) {
        console.error('Falha na ação de login do admin (store):', error);
        throw error;
      }
    },

    async loginGuest(credentials) {
      try {
        const responseData = await HospedeService.login(credentials.num_quarto, credentials.telef_hospede);
        const guestData = responseData.data;

        if (guestData && guestData.usuario) {
          const userObject = {
            ...guestData,
            nome: guestData.usuario,
            tipo: 'hospede'
          };
          this.setUser(userObject);
        } else {
          throw new Error("Resposta de login bem-sucedida, mas sem dados do utilizador.");
        }
      } catch (error) {
        console.error('Falha na ação de login do hóspede (store):', error);
        throw error;
      }
    },
    
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

    async checkAuth(route) {
      try {
        const userInfo = await AuthService.getAuthenticatedUser(route);
        this.setUser(userInfo);
      } catch (error) {
        console.warn('Sessão inválida ou expirada. A limpar o estado.', error);
        this.user = null;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
