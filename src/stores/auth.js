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
    async setUser(userData) {
      if (userData) {
        if (userData.tipo === 'administrador') userData.tipo = 'admin';
        if (userData.tipo === 'hospede') userData.tipo = 'guest';
      }
      this.user = userData;
    },

    async loginAdmin(credentials) {
      try {
        this.user = null; // Limpa o estado do usuário antes do login
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

    async loginGuest(credentials) {
      try {
        this.user = null; // Limpa o estado do usuário antes do login
        const response = await HospedeService.login(credentials.num_quarto, credentials.telef_hospede);
        const guestData = response.data; // Acessa a propriedade 'data' da resposta

        if (guestData && guestData.usuario) {
          const userObject = {
            nome: guestData.usuario,
            id_quarto: guestData.id_quarto,
            num_quarto: guestData.num_quarto,
            tipo: 'hospede'
          };
          await this.setUser(userObject);
          return userObject; // Retorna os dados do usuário
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
        // Não mostrar erro no logout, pois o resultado final (deslogado) é o mesmo.
      } finally {
        this.user = null;
        document.cookie = 'jwt_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        router.push({ name: redirectTo });
      }
    },

    async checkAuth(route) {
      try {
        const userInfoFromToken = await AuthService.getAuthenticatedUser(route);

        if (userInfoFromToken) {
          // Se for hóspede, verifica a consistência dos dados
          if (userInfoFromToken.tipo === 'guest') {
            const currentUser = this.user;
            
            // Compara nome e número do quarto. Converte para string para evitar erros de tipo (ex: 1 vs "1")
            const nameMatches = currentUser.nome === userInfoFromToken.nome;
            const roomMatches = String(currentUser.num_quarto) === String(userInfoFromToken.num_quarto);

            if (!nameMatches || !roomMatches) {
              toast.error('Inconsistência nos dados da sessão. Por favor, faça login novamente.');
              await this.logout(); // Força o logout
              return; // Interrompe a execução
            }
            // Se os dados são consistentes, não fazemos nada, mantendo os dados completos do login inicial.
          }
          // Para admin, ou se os dados do hóspede são consistentes, apenas garantimos que o estado não seja nulo.
          // Não é necessário `setUser` aqui para não sobrescrever os dados completos.
        } else {
          // Se o token não for válido, limpa o usuário
          this.user = null;
        }
      } catch (error) {
        // Se ocorrer qualquer erro na verificação, desloga por segurança.
        this.user = null;
      } finally {
        this.isLoading = false;
      }
    },
  },
});