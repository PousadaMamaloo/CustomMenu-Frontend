import { defineStore } from 'pinia';
import { useToast } from 'vue-toastification';
import router from '@/router';
import AuthService from '@/services/AuthService';
import AdministradorLoginService from '@/services/AdministradorLoginService';
import HospedeService from '@/services/HospedeService';

const toast = useToast();

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
        toast.error('Credenciais inválidas. Verifique seus dados e tente novamente.');
        throw error;
      }
    },

    async loginGuest(credentials) {
      try {
        const responseData = await HospedeService.login(credentials.num_quarto, credentials.telef_hospede);
        const guestData = responseData.data;

        if (guestData && guestData.usuario) {
          const userObject = {
            nome: guestData.usuario,
            id_quarto: guestData.id_quarto,
            num_quarto: guestData.num_quarto,
            tipo: 'hospede'
          };
          this.setUser(userObject);
        } else {
          throw new Error("Resposta de login bem-sucedida, mas sem dados do utilizador.");
        }
      } catch (error) {
        toast.error('Credenciais inválidas. Verifique o número do quarto e tente novamente.');
        throw error;
      }
    },
    
    async logout() {
      const redirectTo = this.isAdmin ? 'AdminLogin' : 'HospedeLogin';
      try {
        await AuthService.logout();
      } catch (error) {
        toast.error('Erro ao sair do sistema. Tente novamente.');
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
        // Se for timeout, mostrar mensagem específica
        if (error.message && error.message.includes('timeout')) {
          toast.warn('Servidor está respondendo lentamente. Tente novamente em alguns momentos.');
        } else {
          // Para outros erros, apenas log sem toast
          toast.error('Usuário não autenticado. Faça login novamente.');
        }
        this.user = null;
      } finally {
        this.isLoading = false;
      }
    },
  },
});